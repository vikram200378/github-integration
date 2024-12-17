import { DatePipe, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService, GitIcons } from 'src/shared';
import {
  GithubStatusDetail,
  SyncDetail,
  SyncStatus,
} from 'src/shared/interfaces/github';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { ReposComponent } from '../repos/repos';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  interval,
  switchMap,
  takeUntil,
  takeWhile,
  throwError,
} from 'rxjs';
@Component({
  selector: 'git-dashboard',
  templateUrl: './dashboard.html',
  imports: [
    MatExpansionModule,
    GitIcons,
    MatIconModule,
    DatePipe,
    MatButtonModule,
    NgIf,
    MatSnackBarModule,
    ReposComponent,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  styleUrls: ['./dashboard.scss'],
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _dashboardService = inject(DashboardService);
  private readonly _snackbar = inject(MatSnackBar);

  public panelOpenState = false;
  public date = new Date();

  public statusDetail!: GithubStatusDetail;
  public syncCompleted: boolean = false;
  public syncLoader: boolean = false;

  ngOnInit(): void {
    this.getDetail();
  }

  public getDetail() {
    this._dashboardService
      .status()
      ?.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.statusDetail = res;
          if (
            this.statusDetail.connected &&
            !this.isSyncComplete(res?.integration?.syncStatus)
          ) {
            console.log('Strt interval');
            this.getStatus();
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  public getStatus() {
    this.syncLoader = true;
    interval(2000)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        switchMap(() => this._dashboardService.status()),
        takeWhile(
          (response) => !this.isSyncComplete(response?.integration?.syncStatus),
          true
        ),
        catchError((error) => {
          console.error('Polling error:', error);
          return throwError(() => error); // Handle errors
        })
      )
      ?.subscribe({
        next: (res) => {
          if (this.isSyncComplete(res?.integration?.syncStatus)) {
            this.syncCompleted = true;
            this.syncLoader = false;
            this.statusDetail.integration.syncStatus = {
              ...res?.integration?.syncStatus,
            };
          }
        },
        error: (err) => {
          this.syncCompleted = false;
          this.syncLoader = false;
          this._snackbar.open(err?.error?.message, 'Close');
        },
      });
  }

  public removeAccount() {
    this._dashboardService.remove().subscribe({
      next: (res) => {
        this._snackbar.open(res?.message, 'Cancel');
        this.getDetail();
      },
      error: (err) => {
        this._snackbar.open('Please try later', 'OK');
      },
    });
  }

  public connect() {
    return this._dashboardService.login();
  }

  // Function to check if sync is complete
  private isSyncComplete(syncStatus: SyncDetail): boolean {
    return (
      syncStatus?.repos?.status === SyncStatus.complete &&
      syncStatus?.commits?.status === SyncStatus.complete &&
      syncStatus?.issues?.status === SyncStatus.complete &&
      syncStatus?.pullRequests?.status === SyncStatus.complete
    );
  }

  /**
   * Toggle Panel State
   * @param state
   */
  public togglePanelState(state: boolean) {
    this.panelOpenState = state;
  }
}

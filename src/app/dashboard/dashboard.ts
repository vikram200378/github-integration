import { DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService, GitIcons } from 'src/shared';
import { GithubStatusDetail } from 'src/shared/interfaces/github';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'git-dashboard',
  templateUrl: './dashboard.html',
  standalone: true,
  imports: [
    MatExpansionModule,
    GitIcons,
    MatIconModule,
    DatePipe,
    MatButtonModule,
    NgIf,
    MatSnackBarModule,
  ],
  styleUrls: ['./dashboard.scss'],
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit {
  private readonly _dashboardService = inject(DashboardService);
  private readonly _snackbar = inject(MatSnackBar);

  public panelOpenState = false;
  public date = new Date();

  public statusDetail!: GithubStatusDetail;

  ngOnInit(): void {
    this.getDetail();
  }

  public getDetail() {
    this._dashboardService.status()?.subscribe({
      next: (res) => {
        this.statusDetail = res;
      },
      error: (err) => {
        console.log(err);
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

  /**
   * Toggle Panel State
   * @param state
   */
  public togglePanelState(state: boolean) {
    this.panelOpenState = state;
  }
}

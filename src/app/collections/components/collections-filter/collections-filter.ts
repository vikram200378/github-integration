import { MatInputModule } from '@angular/material/input';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EntityDropdown } from '../entity-dropdown';
import { GithubStoreService } from '../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'github-collections-filter',
  templateUrl: './collections-filter.html',
  styleUrl: './collections-filter.scss',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    EntityDropdown,
    MatInputModule,
    MatIconModule,
  ],
})
export class CollectionsFilterComponent {
  // Services
  private readonly _githubService = inject(GithubStoreService);
  private readonly _destroyRef = inject(DestroyRef);

  // Active Integration
  public activeIntegration: string = 'github';

  // Entity
  public selectedEntity: any | undefined = undefined;

  // Search
  public search: string = '';

  constructor() {
    // Reset filter values
    this._githubService.filterClean
      ?.pipe(takeUntilDestroyed(this._destroyRef))
      ?.subscribe((state) => {
        if (state) {
          this.activeIntegration = 'github';
          this.selectedEntity = undefined;
          this.search = '';
        }
      });
  }

  // Active integration changed
  public activeIntegrationChanged() {
    // Implement logic for active integration changed
  }

  // Entity filter changed
  public entityChanged(value: any) {
    this.selectedEntity = value;
    this._githubService.entity = value || '';
  }

  // Search changed
  public searchChanged() {
    this._githubService.search = this.search?.trim() || '';
  }
}

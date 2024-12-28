import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';
import { GithubService } from '../services';

@Component({
  selector: 'github-entity-dropdown',
  template: ` <label for="entity" class="field-label">Entity:</label>
    <mat-form-field [appearance]="'outline'">
      <mat-select [(ngModel)]="entity" (ngModelChange)="handleEntityChange()">
        @for (entity of entities(); track entity) {
        <mat-option [value]="entity?.type">
          {{ entity?.label }}
        </mat-option>
        }
      </mat-select>
    </mat-form-field>`,
  standalone: true,
  imports: [MatFormField, MatSelectModule, FormsModule],
})
export class EntityDropdown {
  @Output() valueChanged = new EventEmitter<any>();

  private readonly _githubService = inject(GithubService);

  public entities = toSignal(this._githubService.getEntities());

  constructor() {
    effect(() => {
      this.entity = this.entities();
      console.log('Entities data:', this.entity);
    });
  }

  public entity!: any;

  public handleEntityChange() {
    console.log(this.entity,'this.entitythis.entitythis.entitythis.entity')
    this.valueChanged.emit(this.entity);
  }
}

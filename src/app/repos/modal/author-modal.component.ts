import { DatePipe, TitleCasePipe, CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-author-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    CommonModule, // Import CommonModule to provide DatePipe and TitleCasePipe
    TitleCasePipe,
    DatePipe
  ],
  template: `
    <h2 mat-dialog-title class="modal-title">Author Details</h2>
    <mat-dialog-content>
      <mat-card class="modal-card">
        <mat-card-content class="author-content">
          <!-- Check if data is an array (for multiple users) -->
          <div *ngIf="Array?.isArray(data); else singleUser">
            <div *ngFor="let author of data">
              <!-- Author Avatar -->
              <div class="author-avatar">
                <img [src]="author.author_avatar_url" alt="Author Avatar" class="avatar-img" />
              </div>

              <!-- Author Info -->
              <div class="author-info">
                <h3>{{ author.author_login | titlecase }}</h3>
                <p><strong>Email:</strong> {{ author.commit_author_email }}</p>
                <p *ngIf="author.authorBio"><strong>Bio:</strong> {{ author.authorBio || 'NA' }}</p>
                <p *ngIf="author.authorJoinedDate">
                  <strong>Joined:</strong> {{ author.commit_author_date | date: 'medium' }}
                </p>
                <p *ngIf="!author.authorJoinedDate"><strong>Joined:</strong> N/A</p>
                <p><strong>Type:</strong> {{ author.author_type }}</p>
                <p *ngIf="author.author_organizations_url">
                  <strong>Organizations URL:</strong>
                  <a [href]="author.author_organizations_url" target="_blank">{{ author.author_organizations_url }}</a>
                </p>
              </div>
            </div>
          </div>
          <!-- Single user case (fallback when not an array) -->
          <ng-template #singleUser>
            <div *ngIf="data">
              <!-- Author Avatar -->
              <div class="author-avatar">
                <img [src]="data.user_avatar_url" alt="Author Avatar" class="avatar-img" />
              </div>

              <!-- Author Info -->
              <div class="author-info">
                <h3>{{ data.user_login | titlecase }}</h3>
                <p><strong>Email:</strong> {{ data.commit_author_email }}</p>
                <p *ngIf="data.authorBio"><strong>Bio:</strong> {{ data.authorBio || 'NA' }}</p>
                <p *ngIf="data.authorJoinedDate">
                  <strong>Joined:</strong> {{ data.commit_author_date | date: 'medium' }}
                </p>
                <p *ngIf="!data.authorJoinedDate"><strong>Joined:</strong> N/A</p>
                <p><strong>Type:</strong> {{ data.user_type }}</p>
                <p *ngIf="data.author_organizations_url">
                  <strong>Organizations URL:</strong>
                  <a [href]="data.user_organizations_url" target="_blank">{{ data.user_organizations_url }}</a>
                </p>
              </div>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="closeDialog()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    /* Modal Title */
    .modal-title {
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
      text-align: center;
      margin: 0;
    }

    /* Modal Card */
    .modal-card {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }

    /* Author Content */
    .author-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    /* Author Avatar */
    .author-avatar {
      margin-bottom: 15px;
    }

    .avatar-img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #ccc;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    /* Author Info */
    .author-info {
      width: 100%;
      margin-top: 20px;
    }

    .author-info h3 {
      font-size: 22px;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .author-info p {
      font-size: 16px;
      color: #7f8c8d;
      margin: 5px 0;
    }

    /* Links Styling */
    a {
      color: #3498db;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    /* Dialog Actions */
    mat-dialog-actions {
      display: flex;
      justify-content: center;
      padding: 10px;
    }

    button {
      background-color: #3498db;
      color: white;
      font-weight: bold;
    }

    button:hover {
      background-color: #2980b9;
    }
  `]
})
export class AuthorModalComponent {
Array: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AuthorModalComponent>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}

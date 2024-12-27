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
  template: `<h2 mat-dialog-title class="modal-title">Details</h2>
  <mat-dialog-content>
    <mat-card class="modal-card">
      <mat-card-content>
        <!-- User Details -->
        <div *ngIf="isUserDetails(); else commitDetails">
          <div class="author-avatar">
            <!-- <img [src]="data.user_avatar_url" alt="User Avatar" class="avatar-img" /> -->
            <img 
  [src]="data.user_avatar_url || 'https://via.placeholder.com/100'" 
  alt="Author Avatar" 
  class="avatar-img" 
/>

          </div>
          <div class="author-info">
            <h3>{{ data.user_login | titlecase }}</h3>
            <p><strong>Email:</strong> {{ data.commit_author_email || 'NA' }}</p>
            <p *ngIf="data.authorBio"><strong>Bio:</strong> {{ data.authorBio || 'NA' }}</p>
            <p><strong>Joined:</strong> {{ data.authorJoinedDate ? (data.authorJoinedDate | date: 'medium') : 'N/A' }}</p>
            <p><strong>Type:</strong> {{ data.user_type }}</p>
            <p *ngIf="data.user_organizations_url">
              <strong>Organizations URL:</strong>
              <a [href]="data.user_organizations_url" target="_blank">{{ data.user_organizations_url }}</a>
            </p>
          </div>
        </div>

        <!-- Commit Details -->
        <ng-template #commitDetails>

          <div class="author-info">
          <div class="author-avatar">
            <!-- <img [src]="data.user_avatar_url" alt="User Avatar" class="avatar-img" /> -->
            <img [src]="data.author_avatar_url || 'https://via.placeholder.com/100'" alt="Author Avatar" class="avatar-img"
            
            />

          </div>
            <p><strong>Commit Author:</strong> {{ data.commit_author_name }}</p>
            <p><strong>Commit Date:</strong> {{ data.commit_author_date | date: 'medium' }}</p>
            <p><strong>Commit Message:</strong> {{ data.commit_message }}</p>
            <p><strong>Commit Email:</strong> {{ data.commit_author_email }}</p>
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
  ) { }
  isUserDetails(): boolean {
    return !!this.data.user_avatar_url; // Check for a property unique to user details
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

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
  // template: `<h2 mat-dialog-title class="modal-title">Author Details</h2>
  // <mat-dialog-content>
  //   <mat-card class="modal-card">
  //     <mat-card-content>
  //       <div class="author-details">
  //         <!-- Dynamically loop over each key in the data object -->
  //         <div *ngFor="let key of dynamicKeys" class="detail-row">
  //           <ng-container *ngIf="key === 'avatar'; else nonAvatarContent">
  //             <div class="author-avatar">
  //               <img [src]="data[key]" alt="Author Avatar" class="avatar-img" />
  //             </div>
  //           </ng-container>
  //           <ng-template #nonAvatarContent>
  //             <strong>{{ key | titlecase }}:</strong>
  //             <span *ngIf="data[key]">
  //               <!-- Handle Date formatting if needed -->
  //               <span *ngIf="isDate(data[key])">
  //                 {{ data[key] | date: 'medium' }}
  //               </span>
  //               <span *ngIf="!isDate(data[key])">{{ data[key] }}</span>
  //             </span>
  //             <span *ngIf="!data[key]">N/A</span>
  //           </ng-template>
  //         </div>
  //       </div>
  //     </mat-card-content>
  //   </mat-card>
  // </mat-dialog-content>
  // <mat-dialog-actions>
  //   <button mat-button (click)="closeDialog()">Close</button>
  // </mat-dialog-actions>

  template: `<h2 mat-dialog-title class="modal-title">Author Details</h2>
  <mat-dialog-content>
    <mat-card class="modal-card">
      <mat-card-content class="author-content">
        <!-- Author Avatar -->
        <div class="author-avatar">
          <img [src]="data.author.avatar_url" alt="Author Avatar" class="avatar-img" />
        </div>
  
        <!-- Author Info -->
        <div class="author-info">
          <h3>{{ data.commit.author.name | titlecase }}</h3>
          <p><strong>Email:</strong> {{ data.commit.author.email }}</p>
          <p *ngIf="data.authorBio"><strong>Bio:</strong> {{ data.authorBio ||'NA' }}</p>
  
          <!-- Joined Date -->
          <p *ngIf="data.authorJoinedDate">
            <strong>Joined:</strong> {{ data.authorJoinedDate | date: 'medium' }}
          </p>
          <p *ngIf="!data.authorJoinedDate"><strong>Joined:</strong> N/A</p>
  
          <!-- Type -->
          <p><strong>Type:</strong> {{ data.author.type }}</p>
          <p *ngIf="data.organizations_url"><strong>Organizations URL:</strong> 
            <a [href]="data.organizations_url" target="_blank">{{ data.organizations_url }}</a>
          </p>
        </div>
      </mat-card-content>
    </mat-card>
  </mat-dialog-content>
  
  <mat-dialog-actions>
    <button mat-button (click)="closeDialog()">Close</button>
  </mat-dialog-actions>
  `,
  styles: [`/* Modal Title */
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
  public dynamicKeys: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AuthorModalComponent>
  ) {
    // Dynamically extract keys from the data object
    this.dynamicKeys = Object.keys(data);

  }

  // Check if the value is a Date
  isDate(value: any): boolean {
    return !isNaN(Date.parse(value)); // This will check if the value can be parsed as a date
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

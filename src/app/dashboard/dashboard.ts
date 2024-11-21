import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GitIcons } from 'src/shared';

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
  ],
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {
  public panelOpenState = false;
  public date = new Date();

  /**
   * Toggle Panel State
   * @param state
   */
  public togglePanelState(state: boolean) {
    this.panelOpenState = state;
  }
}

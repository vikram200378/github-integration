import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'git-root',
  template: `<router-outlet />`,
  standalone: true,
  imports: [RouterModule],
})
export class AppComponent {
  title = 'github-integration';
}

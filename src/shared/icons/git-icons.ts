import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'git-icons',
  template: `
    <img
      src="/assets/icons/{{ name }}.png"
      alt="github-icon"
      [ngStyle]="{ objectFit: 'contain', width: width, height: height }"
      style="object-fit: contain;"
    />
  `,
  imports: [NgStyle],
  standalone: true,
})
export class GitIcons {
  @Input() name: string = '';
  @Input() width: string = '50px';
  @Input() height: string = '50px';
}

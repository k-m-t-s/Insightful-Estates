import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <app-header></app-header>
  <app-side-controls></app-side-controls>
  `,
  styles: []
})
export class AppComponent {
  title = 'my-app';
}

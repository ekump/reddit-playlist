import { Component } from '@angular/core';

@Component({
  selector: 'reddit-playlist',
  template: require('./app.component.html'),
  styles: [ require('./app.component.scss') ],
})
export class AppComponent {
  title = 'Reddit Playlist';
}

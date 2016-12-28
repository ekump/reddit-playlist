import { Component } from '@angular/core';

const config = require('../../config');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = config.spotify.clientID;
}

import { Component } from '@angular/core';


@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class SettingsComponent {

  text: string;

  constructor() {
    console.log('Hello SettingsComponent Component');
    this.text = 'Hello World';
  }

}

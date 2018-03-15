import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from './../../providers/auth.service';

@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class SettingsComponent {

  text: string;

  constructor(private _AuthService: AuthService,public navCtrl: NavController ) {
    console.log('Hello SettingsComponent Component');
    this.text = 'Hello World';
  }

  logout(){

   this._AuthService.logout();
   this.navCtrl.pop();

  }



}

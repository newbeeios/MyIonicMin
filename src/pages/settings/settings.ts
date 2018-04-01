import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { AuthService } from './../../providers/auth.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class SettingsComponent {

  text: string;

  constructor(private _AuthService: AuthService,public navCtrl: NavController,private alertCtrl:AlertController ) {
    console.log('Hello SettingsComponent Component');
    this.text = 'Hello World';
  }


  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
         
          }
        },
        {
          text: 'Yes',
          handler: () => {

            this._AuthService.logout().then((res) => {
              this.navCtrl.setRoot(LoginPage);
              console.log("logout method fired Signed Out");
              this._AuthService.user=null;
          
          
            }
            );
            
          }
        }
      ]
    });
    alert.present();
  }

  logout(){

    this.presentConfirm();



 

  }



}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from './../../providers/auth.service';
import { LoginPage } from '../login/login';

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

   this._AuthService.logout().then((res) => {
    this.navCtrl.setRoot(LoginPage);
    console.log("logout method fired Signed Out");
    this._AuthService.user=null;


  }



  // this.navCtrl.push(LoginPage) //this.router.navigate(['login'])
  );

  //  this._firebaseAuth.auth.signOut()
  //  .then((res) => {
  //    console.log("Signed Out");
     

  //  }

 

  }



}

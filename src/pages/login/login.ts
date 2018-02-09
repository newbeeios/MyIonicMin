import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from './../../providers/auth.service';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public authSer: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  LoginClick(){
   this.authSer.signInWithGoogle().auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
   
  }

}

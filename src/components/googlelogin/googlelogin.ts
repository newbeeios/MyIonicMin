import { Component } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'googlelogin',
  templateUrl: 'googlelogin.html'
})
export class GoogleloginComponent {


  user: Observable<firebase.User>;

  constructor(private navctrl:NavController,private afAuth: AngularFireAuth, private gplus: GooglePlus, private platform: Platform) {

    this.user = this.afAuth.authState;

  }

  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();

    } else {
      this.webGoogleLogin();

    }


  }

  async nativeGoogleLogin(): Promise<void> {
    try {
      const gplusUser = await this.gplus.login({
        'webClientId': 'A540411607255-iu25jjg2orsng6gkhruj5jooccq6kjv0.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })

      return await this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
      )

    } catch (err) {
      console.log(err);

    }

  }

  async webGoogleLogin(): Promise<void> {
    try {

      const provider = new firebase.auth.GoogleAuthProvider();
     // const credential = await this.afAuth.auth.signInWithPopup(provider);

      this.afAuth.auth.signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        this.navctrl.push();
        // ...
      }).catch(function(error) {

        console.log(error);

        // Handle Errors here.
       // var errorCode = error.code;
       // var errorMessage = error.message;
        // The email of the user's account used.
      //  var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
       // var credential = error.credential;
        // ...
      });
      

    }
    catch (err) {

    }

  }

  signOut() {

    this.afAuth.auth.signOut();

    if (this.platform.is('cordova')) {
      this.gplus.logout();

    }

  }




}

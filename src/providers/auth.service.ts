import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';



@Injectable()
export class AuthService {
  public user: Observable<firebase.User>;
  public userDetails: firebase.User = null;

constructor(private _firebaseAuth: AngularFireAuth,private gplus: GooglePlus, private platform: Platform) { 
      this.user = _firebaseAuth.authState;
      this.user.subscribe(
        (user) => {
          if (user) {
            this.userDetails = user;
            console.log(this.userDetails);
          }
          else {
            this.userDetails = null;
          }
        }
      );
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

      return await this._firebaseAuth.auth.signInWithCredential(
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

      this._firebaseAuth.auth.signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

 
        // ...
      }).catch(function(error) {

        console.log(error);
      });
      

    }
    catch (err) {

    }

  }

  signOut() {

    this._firebaseAuth.auth.signOut();

    if (this.platform.is('cordova')) {
      this.gplus.logout();

    }

  }



  signInWithGoogle() {
    return this._firebaseAuth;
    // .auth.signInWithPopup(
    //   new firebase.auth.GoogleAuthProvider()
    // )
  }

  signInWithFacebook() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    )
  }

  signInWithTwitter() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.TwitterAuthProvider()
    )
  }

  signInRegular(email, password) {
    const credential = firebase.auth.EmailAuthProvider.credential( email, password );
    return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
 }

  isLoggedIn() {
    if (this.userDetails == null ) {
        return false;
      } else {
        return true;
      }
    }

  logout() {
      this._firebaseAuth.auth.signOut()
      .then((res) => {
        console.log("Signed Out");
        

      }

      

     // this.navCtrl.push(LoginPage) //this.router.navigate(['login'])
    );
    
    }
  

}
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
//import { NavController } from 'ionic-angular';
//import { LoginPage } from './../../login/login';

@Injectable()
export class AuthService {
  public user: Observable<firebase.User>;
  public userDetails: firebase.User = null;

constructor(private _firebaseAuth: AngularFireAuth) { 
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
      .then((res) => 
      console.log("Signed Out")
     // this.navCtrl.push(LoginPage) //this.router.navigate(['login'])
    );
    
    }
  

}
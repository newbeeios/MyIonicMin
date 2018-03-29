import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';
import {AngularFireDatabase,FirebaseListObservable} from 'angularfire2/database';


@Injectable()
export class AuthService {
  public user: Observable<firebase.User>;
  public userDetails: firebase.User = null;

  appSettings = {
    'webClientId': '540411607255-e5k8htocogjmvmqqmj10nvvp9a5o9fii.apps.googleusercontent.com',
    'offline': true,
    'scopes': 'profile email'
  }

  constructor(private _firebaseAuth: AngularFireAuth, private gplus: GooglePlus,
     private platform: Platform,public afd:AngularFireDatabase)  {
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

  silentLogin() {
    return this.gplus.trySilentLogin(this.appSettings);
  }



  async nativeGoogleLogin(): Promise<void> {
    try {
      const gplusUser = await this.gplus.login(this.appSettings);

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

      this._firebaseAuth.auth.signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;


        // ...
      }).catch(function (error) {

        console.log(error);
      });


    }
    catch (err) {

    }

  }

  signOut() {

    console.log("Signout method entered");

    //this.user = null;


    if (this.platform.is('cordova')) {

      console.log("Platform is cordova");

      return this.gplus.logout();
    }
    else {

      return this._firebaseAuth.auth.signOut();

    }

  }


  reset(email)
  {
  return this._firebaseAuth.auth.sendPasswordResetEmail(email);
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

  signInRegular(email,password)
  {
  return this._firebaseAuth.auth.signInWithEmailAndPassword(email,password);
  
  }

  // signUpRegular(email, password) {
  //   const credential = firebase.auth.EmailAuthProvider.credential(email, password);
  //   return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
  // }


  signUpRegular(email,password,firstname,lastname,phone)
  {
  return this._firebaseAuth.auth.createUserWithEmailAndPassword(email,password)
   .then(newUser=>{
    this.afd.list('/userProfile').update(newUser.uid,{email:email,firstname:firstname,lastname:lastname,phone:phone});
  });
  
  }

  setUser(data) {
    console.log('Setting User Data: ', data);
    this.user = data;
  }

  isLoggedIn() {
    if (this.userDetails == null) {
      return false;
    } else {
      return true;
    }
  }

  logout() {
    return this._firebaseAuth.auth.signOut();


  }


}
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Loading, LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from './../../providers/auth.service';
import * as firebase from 'firebase/app';
import { TabsPage } from '../tabs/tabs';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SignupPage } from './../../pages/signup/signup';
import {ResetPasswordPage} from './../../pages/resetpassword/resetpassword';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private login: FormGroup;
  loading: Loading;
  invalidPassword: boolean = false;

  constructor(private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams,
    public authSer: AuthService, public plt: Platform, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.login = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });

    this.plt.ready().then(() => {
      // Silent login issue to be fixed.

      // this.authSer.silentLogin().then(data => {
      //   console.log("SILENT LOGIN");
      //   this.authSer.setUser(data);
      //   this.navCtrl.setRoot(TabsPage);
      // });



    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  LoginRegular() {
    if (this.login.valid) {

      let loading = this.loadingCtrl.create({
        content: 'Please wait...',
        spinner: 'bubbles'
      });

      loading.present();
      this.authSer.signInRegular(this.login.value.email, this.login.value.password).then((data) => {

      loading.dismiss();
        // this.navCtrl.setRoot(TabsPage);

      }, error => {

        this.invalidPassword = true;
        loading.dismiss();
        console.log(error);
      }

      );
    }
  }

  SignUpPage() {
    this.navCtrl.setRoot(SignupPage);

  }




  LoginClick() {

    this.authSer.googleLogin();
  }

  Reset() {
   this.navCtrl.setRoot(ResetPasswordPage);
  }



  presentLoadingDefault(show: boolean) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'bubbles'
    });

    if (show) {
      loading.present();
    } else {
      loading.dismiss();
    }

    // setTimeout(() => {
    //   loading.dismiss();
    // }, 5000);
  }

}

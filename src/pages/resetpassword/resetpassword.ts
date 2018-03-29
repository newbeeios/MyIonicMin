import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from './../../providers/auth.service';
import { LoginPage } from './../../pages/login/login';

@Component({
  selector: 'reset-password',
  templateUrl: 'resetpassword.html'
})
export class ResetPasswordPage {

  private signup: FormGroup;

  constructor(public navCtrl: NavController,  private authSer: AuthService, private formBuilder: FormBuilder, public alertCtrl: AlertController) {
    this.signup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])]
    });
  }


  Reset() {
    this.authSer.reset(this.signup.value.email).then(() => {

      this.showBasiscAlert('Email Sent!!', 'Check your email for further instructions...');
      this.navCtrl.setRoot(LoginPage);
    }).catch(err => {
      console.log(err.message);
      this.showBasiscAlert('Email Not Found', 'Please check the email');

    });
  }

  GoToLogin(){

    this.navCtrl.setRoot(LoginPage);
  }

  showBasiscAlert(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']

    })
    alert.present();


  }





}

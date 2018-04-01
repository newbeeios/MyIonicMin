import { Component } from '@angular/core';
import { IonicPage, NavController,Loading,LoadingController,AlertController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from './../../providers/auth.service';
import {LoginPage} from './../../pages/login/login';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  private signup : FormGroup;
   loading:Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams,public firebaseService:AuthService, private formBuilder: FormBuilder,public loadingCtrl: LoadingController ,public alertCtrl:AlertController) {
    this.signup = this.formBuilder.group({
      firstname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.email,Validators.required])],
      phonenumber: ['', Validators.compose([Validators.required,Validators.maxLength(10)])],
      password:['',Validators.compose([Validators.required,Validators.minLength(6)])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingupPage');
  }

  logForm()
  {
     if(this.signup.valid)
    {
     this.loading = this.loadingCtrl.create();
     this.loading.present();

      this.firebaseService.signUpRegular(this.signup.value.email,this.signup.value.password,
        this.signup.value.firstname,this.signup.value.lastname,this.signup.value.phonenumber)
        .then(()=>{
          this.loading.dismiss();
          this.navCtrl.setRoot(LoginPage);
          
        },error=>{
                this.loading.dismiss().then(()=>{

                let alert = this.alertCtrl.create({
                title:'Error',
                message: error.message,
                buttons:[
                        {
                            text:'OK',
                            role:'cancel'
                        }
                      ]
                });
                alert.present();
                });

         //create alert
         console.log(error);
        }
      
      );
        



    }

console.log(this.signup.value);

  }

  LoginPage(){

    this.navCtrl.setRoot(LoginPage);
  }



}

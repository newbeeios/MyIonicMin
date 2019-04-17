import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
 import { FormControl, FormGroup, Validators, FormBuilder,FormGroupDirective, NgForm } from '@angular/forms';
 import { AuthService } from './../../providers/auth.service';
 import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import {  Loading, LoadingController, AlertController,  } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-createform',
  templateUrl: 'createform.html',
})
export class CreateformPage {

  myform: FormGroup;
  user: Observable<firebase.User>;
  form: FirebaseListObservable<any[]>;
  isEdit: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: AuthService,
     public afAuth: AngularFireAuth,
    public af: AngularFireDatabase, 
    private fb: FormBuilder,
    public loadingCtrl: LoadingController,
     public alertCtrl: AlertController
  ) {

    this.form = af.list('/forms/', {
      query: {
          limitToLast: 50
      }
  });


    this.user = this.afAuth.authState;

    this.myform = this.fb.group({
      id: 0,
      isedit: false,
      formname: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      displaytext: ['', Validators.required],
      description: ['', Validators.required],
      sortorder: [''],
      imageurl: ['https://image.flaticon.com/icons/svg/123/123390.svg']

    });


  }

  ionViewDidLoad() {



  }




  onSubmit() {

   var newKey = this.form.push(this.myform.value).key;

    this.af.object('/forms/' + newKey)
      .update({
        "createdby": this.authService.userDetails.email,
        "createddate": new Date().getDate() + '-' + this.getMonth(new Date().getMonth()) + '-' + new Date().getFullYear(),
        "createdtime(HH:MM:SS)": new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
      });

      let alert = this.alertCtrl.create({
        title: 'Success',
        subTitle: 'Form Created',
        buttons: ['Dismiss']
      });

      alert.present();

      this.navCtrl.pop();
  }



  getMonth(month: Number) {


    switch (month) {
      case 1: {
        return 'JAN';
      }
      case 2: {
        return 'FEB';
      }
      case 3: {
        return 'MAR';
      }
      case 4: {
        return 'APR';
      }
      case 5: {
        return 'MAY';
      }
      case 6: {
        return 'JUN';
      }
      case 7: {
        return 'JUL';
      }
      case 8: {
        return 'AUG';
      }
      case 9: {
        return 'SEP';
      }
      case 10: {
        return 'OCT';
      }
      case 11: {
        return 'NOV';
      }
      case 12: {
        return 'DEC';
      }

      default: {
        return '';
      }
    }
  }

}

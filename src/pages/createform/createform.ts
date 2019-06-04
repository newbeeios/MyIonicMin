import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from './../../providers/auth.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { Loading, LoadingController, AlertController, } from 'ionic-angular';
import { userInfo } from 'os';

@IonicPage()
@Component({
  selector: 'page-createform',
  templateUrl: 'createform.html',
})
export class CreateformPage {

  myform: FormGroup;
  myacess: FormGroup;
  user: Observable<firebase.User>;
  form: FirebaseListObservable<any[]>;
  formaccess:FirebaseListObservable<any[]>;
  isEdit: boolean = false;
  formdata: any;
  formname: string;
  title:string;
  alignment: string = "vertical";
  selectedAnimation: any = "interactive";
  animations: any;
  interactive = false;
  anim: any;
  animationSpeed: number = 1;
  isLoading:any=false;

  lottieAnimations = [
    {
      path: 'assets/animations/lottie/check-animation.json'
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    public af: AngularFireDatabase,
    private fb: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {

    this.changeAnimations();

    this.formdata = navParams.get('data');
    if(this.formdata!=null){
    this.formname = this.formdata.displaytext;
    }

    this.form = af.list('/forms/', {
      query: {
        limitToLast: 500
      }
    });


   this.formaccess = af.list('/formaccess/'+this.authService.userDetails.uid);

    this.user = this.afAuth.authState;





    if (this.formdata == null) {
      this.title ="Create Form";

      this.myform = this.fb.group({
        id: 0,
        isedit: false,
        formname: [''],
        displaytext: ['', Validators.required],
        description: ['', Validators.required],
        sortorder: [''],
        imageurl: ['https://image.flaticon.com/icons/svg/123/123390.svg']

      });

    } else {
      this.title ="Edit "+this.formdata.displaytext;
      this.isEdit = true;
      this.myform = this.fb.group({
        id: this.formdata.$key,
        isedit: true,
        formname: [this.formdata.formname],
        displaytext: [this.formdata.displaytext, Validators.required],
        description: [this.formdata.description, Validators.required],
        sortorder: [this.formdata.sortorder],
        imageurl: this.formdata.imageurl

      });

    }





  }

  ionViewDidLoad() {



  }

  closePopup(){
    this.navCtrl.pop();
  }

 changeAnimations() {
    this.interactive = false;
    this.animations = this.lottieAnimations;
  }


  onSubmit() {

    if (this.formdata != null) {

      var data = this.af.object('/forms/' + this.formdata.$key)
        .update({
          "description": this.myform.value.description,
          "displaytext": this.myform.value.displaytext,
          "formname": this.myform.value.formname,
          "id": 0,
          "imageurl": this.myform.value.imageurl,
          "isedit": true,
          "sortorder": this.myform.value.sortorder,
          "updatedby": this.authService.userDetails.uid,
          "updateddate": new Date().getDate() + '-' + this.getMonth(new Date().getMonth() + 1) + '-' + new Date().getFullYear(),
          "updatedtime(HH:MM:SS)": new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() 
        });


        this.isLoading=true;
        // let alert = this.alertCtrl.create({
        //   title: 'Success',
        //   subTitle: 'Form Updated',
        //   buttons: ['Dismiss']
        // });
    
        // alert.present();

    } else {

       var newKey = this.form.push(this.myform.value).key;

     var currentForm =  this.af.object('/forms/' + newKey)
        .update({
          "createdby": this.authService.userDetails.uid,
          "createddate": new Date().getDate() + '-' + this.getMonth(new Date().getMonth()) + '-' + new Date().getFullYear(),
          "createdtime(HH:MM:SS)": new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
        });

      // var currentObject = this.af.object('/forms/' + newKey);

        //Form assignment part
      var AssignKey =  this.formaccess.push(this.myform.value).key;
      this.af.object('/formaccess/'+this.authService.userDetails.uid+'/'+AssignKey)
      .update({
         "formKey":newKey,
         "createdby": this.authService.userDetails.uid,
         "createddate": new Date().getDate() + '-' + this.getMonth(new Date().getMonth()) + '-' + new Date().getFullYear(),
         "createdtime(HH:MM:SS)": new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()

      });

       this.isLoading=true;


    }

   

   // this.navCtrl.pop();
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

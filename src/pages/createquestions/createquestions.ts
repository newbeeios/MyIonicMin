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
  selector: 'page-createquestions',
  templateUrl: 'createquestions.html',
})
export class CreatequestionsPage {

  myform: FormGroup;
  user: Observable<firebase.User>;
  element: FirebaseListObservable<any[]>;
  id: string;
  formdata:any;
  formname:string;
  elementTypes = [

    { key: "Label", value: "Label" },
    { key: "Textbox", value: "Textbox" },
    { key: "Dropdown", value: "Dropdown" },
    { key: "Scanner", value: "Scanner" },
    { key: "Gps", value: "Gps" },
    { key: "TextArea", value: "TextArea" },
    { key: "Multi-Select", value: "Multi-Select" },
    { key: "Divider", value: "Divider" },
    { key: "Gender", value: "Gender" },
    { key: "YesNo", value: "YesNo" },
    // { key: "Photo", value: "Photo" },
    { key: "Segment", value: "Segment" },
    { key: "Date", value: "Date" },
    { key: "Time", value: "Time" },
    { key: "Checkbox", value: "Checkbox" },
    { key: "Email", value: "Email" },
    { key: "Number", value: "Number" },
    { key: "Signature", value: "Signature" }
];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: AuthService,
     public afAuth: AngularFireAuth,
    public af: AngularFireDatabase, 
    private fb: FormBuilder,
    public loadingCtrl: LoadingController,
     public alertCtrl: AlertController) {


      this.formdata = navParams.get('data');
      this.formname = this.formdata.displaytext;
      
      this.user = this.afAuth.authState;

      this.element = af.list('/elements', {
          query: {
              limitToLast: 1000,
              orderByChild: 'formid',
              equalTo: this.formdata.$key
          }
      });


      this.myform = this.fb.group({
        formid: this.formdata.$key,
        elementname: ['', Validators.compose([Validators.required, Validators.minLength(5)])],   /*, MyCustomValidators.cannotContainSpace*/
        elementtype: ['', Validators.required],
        displaytext: ['', Validators.required],
        description: [''],
        sortorder: [''],
        required: [''],
        // options: this.dpOptions
        options: this.fb.array([
            this.initOptions(),
        ])
    });

  }

  onNoClick(){
     this.navCtrl.pop();
  }

  onSubmit() {

   this.element.push(this.myform.value);
 
 
       let alert = this.alertCtrl.create({
         title: 'Success',
         subTitle: 'Question Created',
         buttons: ['Dismiss']
       });
 
       alert.present();
 
       this.navCtrl.pop();
   }

  initOptions() {

    return this.fb.group(
        { key: [''], value: [''] }
    );

}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatequestionsPage');
  }

}

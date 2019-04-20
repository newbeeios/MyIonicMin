import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from './../../providers/auth.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { Loading, LoadingController, AlertController, } from 'ionic-angular';
import { CreatedropdownsPage } from '../createdropdowns/createdropdowns';

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
  formdata: any;
  questiondata: any;
  formname: string;
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


    this.formdata = navParams.get('formInfo');
    this.questiondata = navParams.get('questionInfo');

    this.formname = this.formdata.displaytext;

    this.user = this.afAuth.authState;

    this.element = af.list('/elements', {
      query: {
        limitToLast: 1000,
        orderByChild: 'formid',
        equalTo: this.formdata.$key
      }
    });


    if (this.questiondata != null) {
      this.myform = this.fb.group({
        formid: this.formdata.$key,
        elementname: [this.questiondata.elementname, Validators.compose([Validators.required, Validators.minLength(5)])],   /*, MyCustomValidators.cannotContainSpace*/
        elementtype: [this.questiondata.elementtype, Validators.required],
        displaytext: [this.questiondata.displaytext, Validators.required],
        description: [this.questiondata.description],
        sortorder: [this.questiondata.sortorder],
        required: [this.questiondata.required]
      });

     } else {
      this.myform = this.fb.group({
        formid: this.formdata.$key,
        elementname: ['', Validators.compose([Validators.required, Validators.minLength(5)])],   /*, MyCustomValidators.cannotContainSpace*/
        elementtype: ['', Validators.required],
        displaytext: ['', Validators.required],
        description: [''],
        sortorder: [''],
        required: ['false']   //,
        // options: this.dpOptions
        // options: this.fb.array([
        //     this.initOptions(),
        // ])
      });
    }

  }

  onNoClick() {
    this.navCtrl.pop();
  }

  onSubmit() {

    if (this.questiondata != null) {


      var data = this.af.object('/elements/' + this.questiondata.$key)
      .update({
        "elementname": this.myform.value.elementname,
        "displaytext": this.myform.value.displaytext,
        "elementtype": this.myform.value.elementtype,
        "sortorder": this.myform.value.sortorder,
        "required":this.myform.value.required,
        "description":this.myform.value.description,
        "updatedby": this.authService.userDetails.email,
        "updateddate": new Date().getDate() + '-' + this.getMonth(new Date().getMonth() + 1) + '-' + new Date().getFullYear(),
        "updatedtime(HH:MM:SS)": new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
      });

      let alert = this.alertCtrl.create({
        title: 'Success',
        subTitle: 'Question Updated',
        buttons: ['Dismiss']
      });
  
      alert.present();

    }else{

      var newkey = this.element.push(this.myform.value).key;


      let alert = this.alertCtrl.create({
        title: 'Success',
        subTitle: 'Question Created',
        buttons: ['Dismiss']
      });
  
      alert.present();
    }

 

 


    this.navCtrl.pop();

    if (this.myform.value.elementtype == "Dropdown" || this.myform.value.elementtype == "Multi-Select") {
      this.navCtrl.push(CreatedropdownsPage, { newKey: newkey, data: this.myform.value });
    }

  }

  initOptions() {

    return this.fb.group(
      { key: [''], value: [''] }
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatequestionsPage');
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

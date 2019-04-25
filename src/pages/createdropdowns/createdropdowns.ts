import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms'
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';


@IonicPage()
@Component({
  selector: 'page-createdropdowns',
  templateUrl: 'createdropdowns.html',
})
export class CreatedropdownsPage {

  responseStatus: Object = [];
  status: boolean;
  mydropdown: FormGroup;
  dropdownname: string;

  id: number;
  private sub: any;
  user: Observable<firebase.User>;
  dropdown: FirebaseListObservable<any[]>;
  value: any;
  dpdata: any;
  newKey: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public afAuth: AngularFireAuth, public af: AngularFireDatabase,
    private fb: FormBuilder) {


    this.dpdata = navParams.get('data');

    if (navParams.get('newKey') != undefined) {  // While editing
      this.newKey = navParams.get('newKey');
    } else {   // After creating the new element from create question page
      this.newKey = this.dpdata.$key;
    }

    debugger;


    this.dropdownname = this.dpdata.displaytext;

    this.dropdown = af.list('/elements/' + this.newKey + '/options', {
      query: {
        limitToLast: 1000,
        orderByChild: 'SortOrder'

      }
    });

    this.user = this.afAuth.authState;

    this.mydropdown = this.fb.group({
      key: [this.value, Validators.compose([Validators.required])],   /*, MyCustomValidators.cannotContainSpace*/
      value: [this.value, Validators.required]
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatedropdownsPage');
  }

  onSubmit() {

    firebase.database().ref('elements/' + this.newKey + '/' + 'options').push({
      key: this.value,
      value: this.value
    });


  }


  removeItem(item: any) {
    this.dropdown.remove(item.$key);
    //firebase.database().ref('elements/' + this.newKey + '/' + 'options').remove(item.$key);

  }

  initOptions() {
    return this.fb.group({
      key: ['', Validators.required],
      value: ['']
    });
  }

}

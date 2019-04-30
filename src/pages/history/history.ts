import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { DynamicFormPage } from '../dynamicform/dynamicform';
import { DFormPage } from '../d-form/d-form';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { SettingsProvider } from './../../providers/settings/settings';
import { FormControl } from '@angular/forms';
import { AuthService } from './../../providers/auth.service';
import { DataPage } from '../data/data';
import { Printer, PrintOptions } from '@ionic-native/printer';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
// import * as jsPDF from 'jspdf'; 
// import 'jspdf-autotable';
import * as _ from "lodash";

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  historyItems: any;  //FirebaseListObservable<any[]>;
  filteredHistoryItems: any;

  formname: string;

  // Active filter rules

  filters = {}



  isLoading: boolean = false;
  searchControl: FormControl;
  searchText: string = '';
  loading: any;

  formItems: FirebaseListObservable<any[]>;

  constructor(public printer: Printer, private authSer: AuthService,
    public navCtrl: NavController, public firebaseProvider: FirebaseProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, private settings: SettingsProvider,
    private af: AngularFireDatabase) {
    this.searchControl = new FormControl();

    var items = [];

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.loading.present();


    this.formItems = this.af.list('/forms', {
      query: {
        limitToLast: 2000,
        orderByChild: 'createdby',
        equalTo: this.authSer.userDetails.email //,
        //startAt: this.searchText
      }
    });



    //   this.historyItems.subscribe(() => {
    //     loading.dismiss();
    //   }
    //   //this.isLoading = false
    // );

  }

  ionViewDidLoad() {


    this.af.list('/data', {
      query: {
        limitToLast: 2000,
        orderByChild: 'createdby',
        equalTo: this.authSer.userDetails.email //,
        //startAt: this.searchText
      }
    }).subscribe(history => {
      this.historyItems = history;
      this.loading.dismiss();
      this.applyFilters();
    });



    console.log('ionViewDidLoad HistoryPage');
  }

  private applyFilters() {

    this.filteredHistoryItems = _.filter(this.historyItems, _.conforms(this.filters))


  }

  filterExact(property: string, rule: any) {
   
 
    if (rule == "All") {
 
      this.removeFilter(property);
      this.formname="All";
      return false;

    } else {
      
      this.filters[property] = val => val == rule
      this.applyFilters()
    }
  }

  removeFilter(property: string) {

    delete this.filters[property]
    this[property] = null
    this.applyFilters();
  }


  download(data: any) {
    //this.print();
    this.navCtrl.push(DataPage, { param1: data });
  }



  deleteRecord(data: any) {

    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want delete this record?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.af.list('/data/').remove(data.$key);
          }
        }
      ]
    });
    alert.present();



  }

  ShowAlert(Message: any) {
    let alert = this.alertCtrl.create({
      title: "Method",
      subTitle: Message,
      buttons: ['Dismiss']
    });
    alert.present();
  }



}

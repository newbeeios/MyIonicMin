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
// import * as jsPDF from 'jspdf'; 
// import 'jspdf-autotable';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  historyItems: FirebaseListObservable<any[]>;
  isLoading: boolean = false;
  searchControl: FormControl;
  searchText: string = '';

  constructor(public printer: Printer, private authSer: AuthService, 
    public navCtrl: NavController, public firebaseProvider: FirebaseProvider,
     public alertCtrl: AlertController, public loadingCtrl: LoadingController, 
     public toastCtrl: ToastController, private settings: SettingsProvider,
      private af: AngularFireDatabase) {
    this.searchControl = new FormControl();


    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    loading.present();

    this.historyItems = this.af.list('/data', {
      query: {
        limitToLast: 2000,
        orderByChild: 'createdby',
        equalTo: this.authSer.userDetails.email //,
        //startAt: this.searchText
      }
    });

    this.historyItems.subscribe(() => {
      loading.dismiss();
    }
    //this.isLoading = false
  );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }

  setFilteredItems() {

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    loading.present();

    if (this.searchText != '') {
      this.isLoading = true;
      console.log(this.searchText);

      this.historyItems = this.af.list('/forms', {
        query: {
          limitToLast: 2000,
          orderByChild: 'createdby',
          equalTo: this.authSer.userDetails.email, //,
          startAt: this.searchText
        }
      });

      this.historyItems.subscribe(() => {
        loading.dismiss();
      }
      //this.isLoading = false
    );

    }
    else {
      this.historyItems = this.af.list('/forms', {
        query: {
          limitToLast: 2000,
          orderByChild: 'createdby',
          equalTo: this.authSer.userDetails.email, //,
          startAt: this.searchText
        }
      });

      this.historyItems.subscribe(() => {
        loading.dismiss();
      }
      //this.isLoading = false
    );
    }
  }



  download(data: any) {
    //this.print();
    this.navCtrl.push(DataPage, { param1: data });
  }



ShowAlert(Message:any){
  let alert = this.alertCtrl.create({
    title: "Method",
    subTitle: Message,
    buttons: ['Dismiss']
  });
  alert.present();
}



  print() {

    console.log("===========Inside print function=================")

    this.printer.isAvailable().then(function () {
      this.printer.print("<html><head></head><body><h1>Test Print with HTML body</h1></body></html>").then(function () {

        console.log("==================Print successful===================");
        //this.ShowAlert("Print Successful");

        // let alert1 = this.alertCtrl.create({
        //   title: "Success",
        //   subTitle: "Printed Successfully",
        //   buttons: ['Dismiss']
        // });
        // alert1.present();


      }, function () {
        console.log("========================Unable to print=============================");

this.ShowAlert("Unable to print");

      });
    }, function () {
      //this.ShowAlert("printing is unavailable");
      console.log("===========================printing is unavailable=====================");




    });

  }

  // download(record:any) {

  //       let doc = new jsPDF();

  //       var col = ["Field Name", "User Input"];
  //       var rows = [];
  //       let formName:string;

  //       for (var key in record) {
  //         var temp = [key, record[key]];
  //         if(key=="formname" || key=="formid")
  //           {
  //               if(key=="formname"){formName=record[key]}
  //               continue;
  //           }

  //         rows.push(temp);

  //       }

  //        doc.text(formName, 15, 10)


  //        doc.autoTable(col, rows); 

  //        doc.save('FirstPdf.pdf');


  //     }

}

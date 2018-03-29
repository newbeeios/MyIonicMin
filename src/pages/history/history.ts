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
// import * as jsPDF from 'jspdf'; 
// import 'jspdf-autotable';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  historyItems: FirebaseListObservable<any[]>;
  isLoading:boolean=true;
  searchControl: FormControl;
  searchText: string = '';

  constructor(private authSer: AuthService,public navCtrl: NavController, public firebaseProvider: FirebaseProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private settings: SettingsProvider, private af: AngularFireDatabase,) {
    this.searchControl = new FormControl();


    this.historyItems = this.af.list('/data',{
      query: {
        limitToLast: 2000,
        orderByChild: 'createdby',
        equalTo: this.authSer.userDetails.email //,
        //startAt: this.searchText
      }
      });
   
    this.historyItems.subscribe(()=> this.isLoading=false);
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }

  setFilteredItems() {
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

      this.historyItems.subscribe(()=>this.isLoading=false);

    }
    else {
      this.historyItems = this.af.list('/forms',{
        query: {
          limitToLast: 2000,
          orderByChild: 'createdby',
          equalTo: this.authSer.userDetails.email, //,
          startAt: this.searchText
        }
        });

        this.historyItems.subscribe(()=>this.isLoading=false);
    }
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

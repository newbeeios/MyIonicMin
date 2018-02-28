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


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  shoppingItems: FirebaseListObservable<any[]>;
  newItem = '';
  searchText: string = '';
  selectedTheme: String;
  searchControl: FormControl;
  searching: any = false;

  constructor(public navCtrl: NavController, public firebaseProvider: FirebaseProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private settings: SettingsProvider, private af: AngularFireDatabase, ) {
    this.searchControl = new FormControl();
    this.shoppingItems = this.firebaseProvider.getShoppingItems();
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  toggleAppTheme() {
    if (this.selectedTheme === 'dark-theme') {
      this.settings.setActiveTheme('light-theme');
    } else {
      this.settings.setActiveTheme('dark-theme');
    }
  }


  ionViewDidLoad() {

    this.setFilteredItems();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {

      
      this.setFilteredItems();
      //this.searching = false;

    });


  }

  onSearchInput() {
    console.log("Data Inputted");
    this.searching = true;
  }

  setFilteredItems() {
    if (this.searchText != '') {
      this.searching = true;
      console.log(this.searchText);

      this.shoppingItems = this.af.list('/forms', {
        query: {
          limitToLast: 200,
          orderByChild: 'formname',
          startAt: this.searchText
        }
      })

      this.searching = false;

    }
    else {
      this.shoppingItems = this.af.list('/forms');
    }
  }



  updateForms() {
    debugger;
    let queryTextLower = this.searchText.toLowerCase();
    let filteredItems = [];
    this.shoppingItems = this.af.list('/forms', {
      query: {
        limitToLast: 200,
        orderByChild: 'formname',
        equalTo: this.searchText
      }
    })
    //Filter logic here


  }

  addItem() {
    this.firebaseProvider.addItem(this.newItem);
  }

  removeItem(id) {
    this.firebaseProvider.removeItem(id);
  }

  goToInputForm($event, formI) {
    this.navCtrl.push(DFormPage, { param1: formI });

    //  this.navCtrl.push(DynamicFormPage,formI);
    //this.presentToast()
    //this.showAlert();

  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'New Friend!',
      subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
      buttons: ['OK']
    });
    alert.present();
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'User was added successfully',
      duration: 3000
    });
    toast.present();
  }


}

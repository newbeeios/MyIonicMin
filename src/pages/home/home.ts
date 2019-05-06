import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { DynamicFormPage } from '../dynamicform/dynamicform';
import { DFormPage } from '../d-form/d-form';
import { CreateformPage } from '../createform/createform';
import { CreatequestionsPage } from '../createquestions/createquestions';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { SettingsProvider } from './../../providers/settings/settings';
import { FormControl } from '@angular/forms';
import { AuthService } from './../../providers/auth.service';
import { DynamicadminquestionsPage } from '../dynamicadminquestions/dynamicadminquestions';
import * as firebase from 'firebase';

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
  isLoading: boolean = false;

  constructor(private authSer: AuthService, public navCtrl: NavController, public firebaseProvider: FirebaseProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, private settings: SettingsProvider,
    private af: AngularFireDatabase) {
    this.searchControl = new FormControl();
    //this.shoppingItems = this.firebaseProvider.getShoppingItems();
    //this.shoppingItems.subscribe(()=> this.isLoading=false);


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

  AddQuestions(formdata: any) {

    // this.navCtrl.push(CreatequestionsPage, {
    //   data: formdata
    // });

    this.navCtrl.push(DynamicadminquestionsPage, {
      data: formdata
    });


  }

  onSearchInput() {
    console.log("Data Inputted");
    this.searching = true;
  }

  setFilteredItems() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });

    //loading.present();

    if (this.searchText != '') {
      this.searching = true;
      console.log(this.searchText);





      this.shoppingItems = this.af.list('/forms', {
        query: {
          limitToLast: 2000,
          orderByChild: 'createdby',
          equalTo: this.authSer.userDetails.email //,
          //startAt: this.searchText
        }
      });

      this.shoppingItems.subscribe(() => {
        this.isLoading = false;
        //loading.dismiss();
      }
      );

      this.searching = false;

    }
    else {
      this.shoppingItems = this.af.list('/forms', {
        query: {
          limitToLast: 2000,
          orderByChild: 'createdby',
          equalTo: this.authSer.userDetails.email //,
          //startAt: this.searchText
        }
      });

      this.shoppingItems.subscribe(() => {
        //loading.dismiss();
      }
        //  this.isLoading=false
      );
    }
  }


  deleteForm(formKey: any) {

    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this form? All the data associated with this form will be deleted and this action is not reversible.',
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
            this.firebaseProvider.removeItem(formKey);

            var elementrefs = firebase.database().ref('elements');
            elementrefs.orderByChild('formid')
              .limitToFirst(1000)
              .equalTo(formKey.$key)
              .once('value').then(function (snapshot) {
                // get the key of the respective image
              
                snapshot.forEach(element => {
                  //const key = Object.keys(snapshot.val())[0];
                  Object.keys(snapshot.val()).forEach(subchild => {
                    elementrefs.child(subchild).remove();
                  });

                  
                });
              });

              var datarefs = firebase.database().ref('data');
              datarefs.orderByChild('formid')
                .limitToFirst(1000)
                .equalTo(formKey.$key)
                .once('value').then(function (snapshot) {
                
                  snapshot.forEach(element => {
                    //const key = Object.keys(snapshot.val())[0];
                    Object.keys(snapshot.val()).forEach(subchild => {
                      datarefs.child(subchild).remove();
                    });
  
                    
                  });
                });

           



          }
        }
      ]
    });
    alert.present();



  }


  updateForms() {

    let queryTextLower = this.searchText.toLowerCase();
    let filteredItems = [];
    this.shoppingItems = this.af.list('/forms', {
      query: {
        limitToLast: 2000,
        orderByChild: 'createdby',
        equalTo: this.authSer.userDetails.email
        //equalTo: this.searchText
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

  CreateNewForm(item: any) {

    this.navCtrl.push(CreateformPage, { data: item });


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

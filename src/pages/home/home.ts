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
import { LoadingPage } from '../loading/loading';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  shoppingItems: FirebaseListObservable<any[]>;
  CombinedForms: FirebaseListObservable<any[]>;
  FormIdsWithAccess: any[];
  newItem = '';
  searchText: string = '';
  selectedTheme: String;
  searchControl: FormControl;
  searching: any = false;
  isLoading: boolean = false;
  formedit: any = true;
  formdelete: any = true;
  formtype:any;

  FormsDataWithAccess: any[];

  selectedAnimation: any = "interactive";
  animations: any;
  interactive = false;
  anim: any;
  animationSpeed: number = 1;


  lottieAnimations = [
    {
      path: 'assets/animations/lottie/material-wave-loading.json'
    }
  ];

  constructor(private authSer: AuthService, public navCtrl: NavController, public firebaseProvider: FirebaseProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, private settings: SettingsProvider,
    private af: AngularFireDatabase) {
    this.searchControl = new FormControl();
    //this.shoppingItems = this.firebaseProvider.getShoppingItems();
    //this.shoppingItems.subscribe(()=> this.isLoading=false);


    // this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);



    this.changeAnimations();

    var settingsInfo = this.af.object('/userSettings/' + this.authSer.userDetails.uid);

    settingsInfo.subscribe((snapshot) => {

      //  console.log("Inside Snapshot for UserSettings");
      // console.log(snapshot);

      this.formedit = snapshot.editForms == undefined ? true : snapshot.editForms;
      this.formdelete = snapshot.deleteForms == undefined ? true : snapshot.deleteForms;
    }
    );

    // var formsaccessInfo = this.af.object('/formaccess/' + this.authSer.userDetails.uid);

    var formsaccessInfo = this.af.list('/formaccess/' + this.authSer.userDetails.uid, {
      query: {
        limitToLast: 200
      }
    });

    formsaccessInfo.subscribe((snap) => {

      snap.forEach((formItem) => {
        console.log(formItem.formkey);
     
        var formInfo = this.af.object('/forms/' + formItem.formkey);
        console.log("Inside Snapshot for FormAccessInfo");

        // formInfo.subscribe((p1) => {
        //   console.log('formaccess values');
        //   console.log(p1);
        //   if (p1!=undefined)
        //   {
        //     this.shoppingItems.forEach((x) => {

        //       debugger;
        //       console.log('inside foreach');
        //       console.log(x);
        //       if (x != undefined) {
        //         if (x[0].$key == p1.$key) {
        //           console.log("duplicate value")
        //         } else {
        //           this.pushValuesBasedOnAccess(p1);
        //            //this.CombinedForms.push(p1);
        //         }
        //       }
  
        //     });

        //   }
        // });


      })

      // this.FormIdsWithAccess.push(snap.val());
    });





    console.log("FormsInfo with Access ");
    console.log(this.FormsDataWithAccess);



  }


 pushValuesBasedOnAccess(item:any){
  this.CombinedForms.push(item);
 }


  toggleAppTheme() {
    if (this.selectedTheme === 'dark-theme') {
      this.settings.setActiveTheme('light-theme');
    } else {
      this.settings.setActiveTheme('dark-theme');
    }
  }


  handleAnimation(anim) {
    this.anim = anim;
  }

  stop() {
    this.anim.stop();
  }

  play() {
    this.anim.play();
  }

  pause() {
    this.anim.pause();
  }

  setSpeed() {
    this.anim.setSpeed(this.animationSpeed);
  }

  animate() {
    this.anim.playSegments([[27, 142], [14, 26]], true);
  }

  changeAnimations() {
    this.interactive = false;
    this.animations = this.lottieAnimations;
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
    // let loading = this.loadingCtrl.create({
    //   spinner: 'bubbles',
    //   content: 'Loading...'
    // });

    //loading.present();

    if (this.searchText != '') {
      this.searching = true;
      console.log(this.searchText);

      this.shoppingItems = this.af.list('/forms', {
        query: {
          limitToLast: 200,
          orderByChild: 'createdby',
          equalTo: this.authSer.userDetails.uid //,
          //startAt: this.searchText
        }
      });

      this.shoppingItems.subscribe((Items) => {

       
      
//         Items.forEach((singleitem)=>{
// debugger;
//           this.CombinedForms.push(singleitem);
//         });
       
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
          equalTo: this.authSer.userDetails.uid //,
          //startAt: this.searchText
        }
      });

      this.shoppingItems.subscribe((items) => {
        console.log('items printing');
        console.log(items);
       

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

          // Remove access for all the people as you are the owner of this form.

           var accessrefs = firebase.database().ref('formaccess'+'/'+this.authSer.userDetails.uid);
           accessrefs.orderByChild('formKey').limitToFirst(1).equalTo(formKey.$key)
           .once('value').then(function (snapshot) {
            snapshot.forEach(element => {
          
              //const key = Object.keys(snapshot.val())[0];
              Object.keys(snapshot.val()).forEach(subchild => {
                accessrefs.child(subchild).remove();
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
        limitToLast: 50,
        orderByChild: 'createdby',
        equalTo: this.authSer.userDetails.uid
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

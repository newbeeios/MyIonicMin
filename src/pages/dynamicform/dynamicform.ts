import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-dynamic',
  templateUrl: 'dynamicform.html'
})

export class DynamicFormPage {
  formelements: FirebaseListObservable<any[]>;
  newItem = '';
 
  paramItems: any;

  constructor(public navCtrl: NavController, public firebaseProvider: FirebaseProvider,private navParams:NavParams,public alertCtrl: AlertController) {
   
  //console.log(this.navParams.data.$key);

  debugger;
  
    this.formelements = this.firebaseProvider.getQuestions(this.navParams.data.$key);

    this.paramItems = this.navParams.data;

    console.log(this.formelements);
  }
 
  addItem() {
    this.firebaseProvider.addItem(this.newItem);
  }
 
  removeItem(id) {
    this.firebaseProvider.removeItem(id);
  }

onSubmit()
{
  this.showAlert();
}


   showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: 'Your form submission successful',
      buttons: ['OK']
    });
    alert.present();
  }

}

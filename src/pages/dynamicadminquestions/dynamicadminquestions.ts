import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import { AuthService } from './../../providers/auth.service';
import {CreatequestionsPage} from '../createquestions/createquestions';
import {CreatedropdownsPage} from '../createdropdowns/createdropdowns';

@Component({
  selector: 'page-dynamicadminquestions',
  templateUrl: 'dynamicadminquestions.html',
})
export class DynamicadminquestionsPage {

  payLoad = '';
  data: FirebaseListObservable<any[]>;
  formdata:any;
  formname:any;



  constructor(private authService: AuthService, 
      private af: AngularFireDatabase, 
      private alertCtrl: AlertController, private navCtrl: NavController,
      public navParams: NavParams) {

          this.formdata = navParams.get('data');
          this.formname = this.formdata.displaytext;

      this.data = af.list('/elements', {
          query: {
              limitToLast: 1000,
              orderByChild: 'formid',
              equalTo: this.formdata.$key 
          }
      });

  }




  editQuestion(elementInfo:any){

    this.navCtrl.push(CreatequestionsPage,{formInfo:this.formdata ,questionInfo:elementInfo});

  }

  editList(listInfo:any){
    
    this.navCtrl.push(CreatedropdownsPage,{data:listInfo});
  }


  deleteQuestion(questionKey: any) {

    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this Question?',
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
            this.af.list('/elements/').remove(questionKey);
          }
        }
      ]
    });
    alert.present();



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

  presentAlert() {
      let alert = this.alertCtrl.create({
          title: 'Success',
          subTitle: 'Data saved successfully.',
          buttons: [{
              text: 'Ok',
              handler: () => {
                  this.navCtrl.pop();
              }
          }]
      });
      alert.present();
  }

}

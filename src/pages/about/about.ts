import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams, ModalController } from 'ionic-angular';
import {SignaturePage} from '../signature/signature'


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public signatureImage : any;
  constructor(public navCtrl: NavController,public navParams:NavParams, public modalController:ModalController) {
    this.signatureImage = navParams.get('signatureImage');

  }

  openSignatureModel(){
    setTimeout(() => {
       let modal = this.modalController.create(SignaturePage);
    modal.present();
    }, 300);

  }

}

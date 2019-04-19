import { Component } from '@angular/core';
import { NavController, ActionSheetController, LoadingController } from 'ionic-angular';
import { Camera, PictureSourceType } from '@ionic-native/camera';
import * as Tesseract from 'tesseract.js';


@Component({
  selector: 'page-ocrscannerpage',
  templateUrl: 'ocrscannerpage.html',
})
export class OcrscannerpagePage {

  selectedImage: string;
  imageText: string;
  loading:any;
  constructor(public navCtrl: NavController, private camera: Camera, 
    private actionSheetCtrl: ActionSheetController,
     public loadingCtrl: LoadingController) {

       this.loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Scanning Text...'
      });
  }
 
  selectSource() {    
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Use Library',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Capture Image',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
 
  getPicture(sourceType: PictureSourceType) {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then((imageData) => {
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;
    });
  }
 
  recognizeImage() {
    Tesseract.recognize(this.selectedImage)
    .progress(message => {
      if (message.status === 'recognizing text')
      this.loading.present();
    })
    .catch(err => console.error(err))
    .then(result => {
      this.imageText = result.text;
    })
    .finally(resultOrError => {
      this.loading.dismiss();
    });
  }
 
}
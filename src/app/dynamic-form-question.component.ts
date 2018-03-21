import { Component, Input, OnInit,OnChanges  } from '@angular/core';
import { FormGroup }        from '@angular/forms';
import { QuestionBase }     from './question-base';

import {PicklistModalViewPage} from '../pages/picklist-modal-view/picklist-modal-view';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ActionSheetController,ModalController,NavController } from 'ionic-angular';

import firebase from 'firebase';



@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html'
})

export class DynamicFormQuestionComponent implements OnInit,OnChanges {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;

  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;

    options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

   PhotoLibraryOptions: CameraOptions = {
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,      
    quality: 60,
    targetWidth: 1000,
    targetHeight: 1000,
    encodingType: this.camera.EncodingType.JPEG,      
    correctOrientation: true
  }


  //get isValid() { return this.form.controls[this.question.key].valid; }

  // get isValid() { return this.form.controls[this.question.key] 
  //   ? this.form.controls[this.question.key].valid : true; }

  get isValid() { return this.form.controls[this.question.key] 
    ? ( this.form.controls[this.question.key].valid  ) : true; }

    get isDirty() { return this.form.controls[this.question.key] 
      ? (this.form.controls[this.question.key].dirty ) : true; }
  
      get isTouched() { return this.form.controls[this.question.key] 
        ?   (this.form.controls[this.question.key].touched) : true; }


  constructor(private barcodeScanner: BarcodeScanner,private platform: Platform, private geolocation: Geolocation,private camera: Camera,
    public loadingCtrl: LoadingController,public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,public navCtrl: NavController){
      this.myPhotosRef = firebase.storage().ref('/Photos/');

      console.log("DynamicFormQuestionComponent constructor entered========");
      console.log(this.question);

  }

ngOnInit(){
  console.log("DynamicFormQuestionComponent OnInit entered========");
  console.log(this.question);
 
}

ngOnChanges(data){

  //this.question = data.question;
  console.log("DynamicFormQuestionComponent OnChanges entered========");
  //console.log(this.question);


}



  myCallbackFunction = function(_params,myVal) {

  console.log(_params);
  console.log(myVal);
   
    return new Promise((resolve, reject) => {
     this.form.get(_params).setValue(myVal);
            resolve();
        });

}

  PopUpPickList(key,options){

    this.navCtrl.push(PicklistModalViewPage, {
      key: key,
      options: options,
      callback: this.myCallbackFunction.bind(this)
    })

  }


  
  presentActionSheet(key) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Pick from the following',
      buttons: [
        {
          text: 'Photo Library',
          role: 'photoLibrary',
          handler: () => {
            
            this.camera.getPicture(this.PhotoLibraryOptions)
            .then(file_uri => {
               // If it's base64:
              let base64Image = 'data:image/jpeg;base64,' + file_uri;
              this.form.get(key).setValue(file_uri);
            }, 
            err => console.log(err));

            // this.camera.getPicture(this.PhotoLibraryOptions).then((imageData) => {
            //   // imageData is either a base64 encoded string or a file URI
            //   // If it's base64:
            //   let base64Image = 'data:image/jpeg;base64,' + imageData;
            //   //this.form.get(key).setValue(base64Image);
            //  }, (err) => {
            //   // Handle error
            //  });
          }
        },{
          text: 'Camera',
          role:'camera',
          handler: () => {
            this.camera.getPicture(this.options).then((imageData) => {
              // imageData is either a base64 encoded string or a file URI
              // If it's base64:
              let base64Image = 'data:image/jpeg;base64,' + imageData;
              this.form.get(key).setValue(base64Image);
             }, (err) => {
              // Handle error
             });
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 1500
    });
    loader.present();
  }


  showScanner(key)
  {
    this.scan(key);
    console.log("show scanner clicked");

  }

  scan(key) {
   
    this.barcodeScanner.scan().then((barcodeData) => {
      this.form.get(key).setValue(barcodeData.text); 
      //$scope.barcodeText = barcodeData.text;
     console.log(barcodeData.text);
      } 
      
    );
  }

  checkedChange(key,e:any)
  {
   if(e.checked)
    {
    this.form.get(key).setValue(true); 
    }
    else
    {
      this.form.get(key).setValue(false); 
    }
  }


 

  getLocationCoordinates(key){

    this.platform.ready().then(() => {
      
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();

            // get current position

            this.geolocation.getCurrentPosition().then(pos => {
              console.log('lat: ' + pos.coords.latitude + '<br/> lon: ' + pos.coords.longitude+'<br/>accuracy: ' + pos.coords.accuracy+'<br/>altitude: ' + pos.coords.altitude+'<br/>altitudeAccuracy: ' + pos.coords.altitudeAccuracy+'</br>speed: ' + pos.coords.speed);
              console.log('accuracy: ' + pos.coords.accuracy);
              console.log('altitude: ' + pos.coords.altitude);
              console.log('altitudeAccuracy: ' + pos.coords.altitudeAccuracy);
              console.log('speed: ' + pos.coords.speed);
             // this.form.get(key).setValue('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude); 
             this.form.get(key).setValue('Latitude: ' + pos.coords.latitude + '\nLongitude: ' + pos.coords.longitude+'\nAccuracy: ' + pos.coords.accuracy+'\nAltitude: ' + pos.coords.altitude+'\nAltitudeAccuracy: ' + pos.coords.altitudeAccuracy+'\nSpeed: ' + pos.coords.speed)
             loader.dismiss();
            });
      
            const watch = this.geolocation.watchPosition().subscribe(pos => {
              console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
            //  this.form.get(key).setValue('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude); 
            this.form.get(key).setValue('Latitude: ' + pos.coords.latitude + '\nLongitude: ' + pos.coords.longitude+'\nAccuracy: ' + pos.coords.accuracy+'\nAltitude: ' + pos.coords.altitude+'\nAltitudeAccuracy: ' + pos.coords.altitudeAccuracy+'\nSpeed: ' + pos.coords.speed)
            });
      

            // to stop watching
            watch.unsubscribe();

           
      
          });
      
        }

  
}




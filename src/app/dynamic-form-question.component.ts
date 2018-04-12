import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from './question-base';

import { PicklistModalViewPage } from '../pages/picklist-modal-view/picklist-modal-view';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ActionSheetController, ModalController, NavController, } from 'ionic-angular';

import firebase from 'firebase';
import { NavParams } from 'ionic-angular';
import { SignaturePage } from '../pages/signature/signature'
import { SignaturePad } from 'angular2-signaturepad/signature-pad';


@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html'
})

export class DynamicFormQuestionComponent implements OnInit, OnChanges {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;

  @ViewChild(SignaturePad) public signaturePad: SignaturePad;

  public signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 200
  };
  public signatureImage: string;


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

  get isValid() {
    return this.form.controls[this.question.key]
      ? (this.form.controls[this.question.key].valid) : true;
  }

  get isDirty() {
    return this.form.controls[this.question.key]
      ? (this.form.controls[this.question.key].dirty) : true;
  }

  get isTouched() {
    return this.form.controls[this.question.key]
      ? (this.form.controls[this.question.key].touched) : true;
  }


  constructor(private barcodeScanner: BarcodeScanner, private platform: Platform, private geolocation: Geolocation, private camera: Camera,
    public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController, public navCtrl: NavController) {
    this.myPhotosRef = firebase.storage().ref();

    console.log("DynamicFormQuestionComponent constructor entered========");
    console.log(this.question);

  }

  ngOnInit() {
    console.log("DynamicFormQuestionComponent OnInit entered========");
    console.log(this.question);

  }

  ngOnChanges(data) {

    //this.question = data.question;
    console.log("DynamicFormQuestionComponent OnChanges entered========");
    //console.log(this.question);


  }

  openSignatureModel() {
    setTimeout(() => {
      let modal = this.modalCtrl.create(SignaturePage);
      modal.present();
    }, 300);

  }



  myCallbackFunction = function (_params, myVal) {

    console.log(_params);
    console.log(myVal);

    return new Promise((resolve, reject) => {
      this.form.get(_params).setValue(myVal);
      resolve();
    });

  }

  PopUpPickList(key, options) {

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
            this.selectPhoto(key);

            // this.camera.getPicture(this.PhotoLibraryOptions)
            // .then(file_uri => {

            //   let base64Image = 'data:image/jpeg;base64,' + file_uri;
            //   this.form.get(key).setValue(file_uri);
            // }, 
            // err => console.log(err));


          }
        }, {
          text: 'Camera',
          role: 'camera',
          handler: () => {

            this.takePhoto(key);
            // this.camera.getPicture(this.options).then((imageData) => {
            //   let base64Image = 'data:image/jpeg;base64,' + imageData;
            //   this.form.get(key).setValue(base64Image);
            //  }, (err) => {
            //   console.log(err);
            //  });
          }
        }, {
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



  takePhoto(key) {
    let loader = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Uploading Image..."
    });



    this.camera.getPicture({
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: true
    }).then(imageData => {
      loader.present();
      this.myPhoto = imageData;
      this.uploadPhoto(key, loader);
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  selectPhoto(key): void {

    let loader = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Uploading Image..."
    });

    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 50,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      loader.present();
      this.myPhoto = imageData;
      this.uploadPhoto(key, loader);
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  private uploadPhoto(key, loader): void {
    var newGUID = this.generateUUID();
    this.myPhotosRef.child(newGUID + '.png')
      .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.myPhotoURL = savedPicture.downloadURL;
        this.form.get(key).setValue('thumb_' + newGUID + '.png');
        //this.form.get(key).setValue(this.myPhotoURL);
        loader.dismiss();

      });
  }

  private generateUUID(): any {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 1500
    });
    loader.present();
  }


  showScanner(key) {
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

  checkedChange(key, e: any) {
    if (e.checked) {
      this.form.get(key).setValue(true);
    }
    else {
      this.form.get(key).setValue(false);
    }
  }


  getLocationCoordinates(key) {

    this.platform.ready().then(() => {

      let loader = this.loadingCtrl.create({
        spinner: "bubbles",
        content: "Please wait..."
      });
      loader.present();

      // get current position

      this.geolocation.getCurrentPosition().then(pos => {
        console.log('lat: ' + pos.coords.latitude + '<br/> lon: ' + pos.coords.longitude + '<br/>accuracy: ' + pos.coords.accuracy + '<br/>altitude: ' + pos.coords.altitude + '<br/>altitudeAccuracy: ' + pos.coords.altitudeAccuracy + '</br>speed: ' + pos.coords.speed);
        console.log('accuracy: ' + pos.coords.accuracy);
        console.log('altitude: ' + pos.coords.altitude);
        console.log('altitudeAccuracy: ' + pos.coords.altitudeAccuracy);
        console.log('speed: ' + pos.coords.speed);
        // this.form.get(key).setValue('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude); 
        this.form.get(key).setValue('Latitude: ' + pos.coords.latitude + '\nLongitude: ' + pos.coords.longitude + '\nAccuracy: ' + pos.coords.accuracy + '\nAltitude: ' + pos.coords.altitude + '\nAltitudeAccuracy: ' + pos.coords.altitudeAccuracy + '\nSpeed: ' + pos.coords.speed)
        loader.dismiss();
      });

      const watch = this.geolocation.watchPosition().subscribe(pos => {
        console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
        //  this.form.get(key).setValue('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude); 
        this.form.get(key).setValue('Latitude: ' + pos.coords.latitude + '\nLongitude: ' + pos.coords.longitude + '\nAccuracy: ' + pos.coords.accuracy + '\nAltitude: ' + pos.coords.altitude + '\nAltitudeAccuracy: ' + pos.coords.altitudeAccuracy + '\nSpeed: ' + pos.coords.speed)
      });


      // to stop watching
      watch.unsubscribe();



    });

  }





  drawCancel() {
    //this.navCtrl.push(HomePage);
    this.navCtrl.pop();
  }

  private uploadSignature(key, loader): void {
    console.log("Image Data " + this.signatureImage);

    var NewGUID = this.generateUUID();

    this.myPhotosRef.child(NewGUID + '.png')
      .putString(this.signatureImage, 'data_url')
      .then((savedPicture) => {

        this.myPhotoURL = savedPicture.downloadURL;

        //this.form.get(key).setValue(this.myPhotoURL);
        this.form.get(key).setValue('thumb_' + NewGUID + '.png');
        loader.dismiss();

      });
  }


  drawComplete(key) {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    //this.uploadImage(this.signatureImage, loader);

    this.signatureImage = this.signaturePad.toDataURL();
    this.uploadSignature(key, loader);


    //this.form.get(key).setValue(this.signatureImage); 
    //this.navCtrl.push(HomePage, { signatureImage: this.signatureImage });
  }

  drawClear() {
    this.signaturePad.clear();
  }

  canvasResize() {
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }

  ngAfterViewInit() {
    // this.signaturePad.clear();
    //this.canvasResize();
  }


  uploadImage(imageString, loader): Promise<any> {
    let image: string = 'movie-' + new Date().getTime() + '.jpg',
      storageRef: any,
      parseUpload: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref('Photos/' + image);
      parseUpload = storageRef.putString(imageString, 'base64', { contentType: 'image/png' });

      parseUpload.on('state_changed', (_snapshot) => {

        // We could log the progress here IF necessary
        // console.log('snapshot progess ' + _snapshot);
      },
        (_err) => {
          loader.dismiss();
          reject(_err);
        },
        (success) => {
          loader.dismiss();
          resolve(parseUpload.snapshot);
        });
    });
  }


}




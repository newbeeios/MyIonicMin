import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Printer, PrintOptions } from '@ionic-native/printer';
import firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from "rxjs/Rx";
import { QuestionBase } from './../../providers/question-base';

@IonicPage()
@Component({
  selector: 'page-data',
  templateUrl: 'data.html',
})
export class DataPage {
  formData: any;
  public myPhotosRef: any;
  public invokeEvent: Subject<any> = new Subject();
  questions1$: QuestionBase<any>[] = [];
  //col:any = ["Field Name", "User Input"];
  //rows:any = [];
  data: { key: string, value: string }[] = [];

  constructor(private printer: Printer, public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.myPhotosRef = firebase.storage().ref();
    this.formData = navParams.get('param1');
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad DataPage');

    let loader = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Loading...",
    });
    loader.present();

    let formName: string;

    for (var key in this.formData) {
      var temp = [key, this.formData[key]];
      if (key == "formname" || key == "formid") {
        if (key == "formname") { formName = this.formData[key] }
        continue;
      }

  

      if (key.includes("Photo_")) {

        var ctrlKey: string = key;
      //  alert("Inside Photo_" + this.formData[key]);
        console.log();
        var imageURL: string = '';
        var imageName: string = this.formData[ctrlKey];

        if (imageName != "") {

          firebase.storage().ref(imageName).getDownloadURL().then(function (url) {
            imageURL = url;
            alert(ctrlKey);
           var CurrentKey=ctrlKey;
           
           // do{
             // alert(url + "=====IMAGE KEY=====" + CurrentKey);
              (<HTMLImageElement>document.querySelector("." + CurrentKey)).src = url;
  
            // }while(url==null || url=='')
   

            //ctrlKey = '';

            // console.log("IMAGE URL" + imageURL);

          }).catch(function (error) {
            alert(error);
            console.log(error);
          });


          this.data.push({ key: key, value: imageURL });

        }


        else {
          this.data.push({ key: key, value: this.formData[key] });
        }


        // firebase.storage().child(this.formData[key]).getDownloadURL().then(function(url){
        //   console.log(url);
        // }).catch(function(error) {
        //  console.log(error);
        // });
      }
      else if (key.includes("Sign_")) {

        var ctrlKey: string = key;
        //alert("Inside Sign_" + this.formData[key]);

        var imageName: string = this.formData[ctrlKey];
        var imageURL: string = '';

       // var ctrlKey = key;
        firebase.storage().ref(imageName).getDownloadURL().then(function (url) {

          alert( ctrlKey);
          var CurrentKey=ctrlKey;
          imageURL = url;
          

           //do{
           // alert(url + "=====SIGN KEY=====" + CurrentKey);
            (<HTMLImageElement>document.querySelector("." + CurrentKey)).src = url;

          // }while(url==null || url=='')
 

          ctrlKey = '';

          console.log("Inside IMAGE URL" + imageURL);

        }).catch(function (error) {
          alert(error);
          console.log(error);
        });


        this.data.push({ key: key, value: imageURL });

      }


      else {
        this.data.push({ key: key, value: this.formData[key] });
      }

      //this.rows.push(temp);


    }

    loader.dismiss();


    let options: PrintOptions = {
      name: 'MyDocument',
      printerId: 'printer007',
      duplex: true,
      landscape: true,
      grayscale: true
    };


    //this.print();

    //this.printer.print("Hello World", options); // .then({onSuccess}, onError);

  }


  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Print',
      subTitle: 'Print not available',
      buttons: ['Dismiss']
    });
    alert.present();
  }


  printDisabled() {
    this.presentAlert();
  }

  print() {

    this.printer.isAvailable().then(function () {
      this.printer.print("https://www.techiediaries.com").then(function () {
        alert("printing done successfully !");
      }, function () {
        alert("Error while printing !");
      });
    }, function () {
      alert('Error : printing is unavailable on your device ');
    });

  }



}

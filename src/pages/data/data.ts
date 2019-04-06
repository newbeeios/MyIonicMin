import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Printer, PrintOptions } from '@ionic-native/printer';
import firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from "rxjs/Rx";
import { QuestionBase } from './../../providers/question-base';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

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
  columns: any[] = [];
  formdata: any;
  formName: any;
  constructor(private printer: Printer, public af: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.myPhotosRef = firebase.storage().ref();
    this.formData = navParams.get('param1');

    //console.log(this.formData.$key);

    var data1 = this.af.object('/forms/' + this.formData["formid"], { preserveSnapshot: true });
    data1.subscribe(snapshot => {
      this.formName = snapshot.val().displaytext;
    });


    this.af.list('/elements', {
      query: {
        limitToLast: 200,
        orderByChild: 'formid',
        equalTo: this.formData["formid"], //'-L1yqzYrLrPzSqXdlHZM',
        preserveSnapshot: true
      }
    }).subscribe(snapshot => {
      if (snapshot != undefined) {
        //console.log(snapshot);

        snapshot.forEach((childSnapshot) => {
          this.columns.push({ columnDef: childSnapshot.elementname, elementtype: childSnapshot.elementtype, header: childSnapshot.displaytext, cell: (element: any) => `${element.elementname}` });
          return false;
        });
      }

    });

    var recordData = this.af.object('/data/' + this.formData.$key, { preserveSnapshot: true });

    recordData.subscribe(snap => {
      this.formdata = snap.val();
      for (var key in this.formData) {

        if (key.toLowerCase().startsWith("photo_") || key.toLowerCase().startsWith("sign_")) {
          this.getImageUrl(this.formData[key], key);
        }

        console.log(key);
      }


      console.log(snap.val());
    });




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



      if (key.toLowerCase().includes("photo_")) {

        var ctrlKey: string = key;
        //  alert("Inside Photo_" + this.formData[key]);
        console.log();
        var imageURL: string = '';
        var imageName: string = this.formData[ctrlKey];

        if (imageName != "") {


          firebase.storage().ref('images/' + imageName).getDownloadURL().then(function (url) {
            imageURL = url;

            var CurrentKey = ctrlKey;

            (<HTMLImageElement>document.querySelector("." + CurrentKey)).src = url;

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
      else if (key.toLowerCase().includes("sign_")) {

        var ctrlKey: string = key;
        //alert("Inside Sign_" + this.formData[key]);

        var imageName: string = this.formData[ctrlKey];
        var imageURL: string = '';


        var storageRef = firebase.storage().ref();
        storageRef.child('images/' + imageName).getDownloadURL().then(function (url) {
          // firebase.storage().ref(imageName).getDownloadURL().then(function (url) {

          alert(url);
          var CurrentKey = ctrlKey;
          imageURL = url;

          (<HTMLImageElement>document.querySelector("." + CurrentKey)).src = url;

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


  getImageUrl(imageName, CurrentKey): any {

    if (imageName != "") {
      var storageRef = firebase.storage().ref();
      storageRef.child('images/' + imageName).getDownloadURL().then(function (url) {
        console.log("Inside IMAGE URL" + url);
        (<HTMLImageElement>document.querySelector("." + CurrentKey)).src = url;
        //return url;

      }).catch(function (error) {
        console.log(error);
        // alert("Inside getImageUrl() "+error);
        return error;


      });
    }

  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Print',
      subTitle: 'Print available only with PRO Version',
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


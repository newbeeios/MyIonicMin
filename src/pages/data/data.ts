import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform, ToastController } from 'ionic-angular';
import { Printer, PrintOptions } from '@ionic-native/printer';
import firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from "rxjs/Rx";
import { QuestionBase } from './../../providers/question-base';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { isRightSide } from 'ionic-angular/umd/util/util';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  pdfObj = null;
  columnDataForPdf: any[] = [];
  columnRelDataForPdf: any[] = [];
  loader: any;
  error: any;
  alignment:string="horizontal";

  constructor(private printer: Printer, public af: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams,
    private loadingCtrl: LoadingController, private alertCtrl: AlertController,
    private file: File, private fileOpener: FileOpener, private plt: Platform,
    private toastCtrl: ToastController
  ) {
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
          this.columnDataForPdf.push(childSnapshot.displaytext);
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

        //console.log(key);
      }


      console.log(snap.val());
    });




  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad DataPage');

    this.loader = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Loading...",
    });
    this.loader.present();

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

          //alert(url);
          var CurrentKey = ctrlKey;
          imageURL = url;

          (<HTMLImageElement>document.querySelector("." + CurrentKey)).src = url;

          ctrlKey = '';

          console.log("Inside IMAGE URL" + imageURL);

        }).catch(function (error) {
          //alert(error);
          console.log(error);
        });


        this.data.push({ key: key, value: imageURL });

      }


      else {
        this.data.push({ key: key, value: this.formData[key] });
      }

      //this.rows.push(temp);


    }

    this.loader.dismiss();


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


  createPdf() {


    for (let item of this.columns) {

      this.columnRelDataForPdf.push(this.formData[item.columnDef])

    }

    console.log("Inside create pdf");

    console.log(this.columnDataForPdf);
    console.log(this.columnRelDataForPdf);


    var bodyData = [];
    var dataRowHeader = [];
    dataRowHeader.push(this.formName)
    dataRowHeader.push('')
    bodyData.push(dataRowHeader);

    for (let item of this.columns) {

      var dataRow = [];

      dataRow.push(item.header);
      dataRow.push(this.formdata[item.columnDef] == undefined ? "" : this.formdata[item.columnDef]);
      bodyData.push(dataRow)

    }






    var docDefinition = {
      content: [
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', '*'],

            body: bodyData
          }
        }
      ], styles: {
        header: {
          bold: true,
          fontSize: 20,
          alignment: 'right'
        }
      }
    };


    this.pdfObj = pdfMake.createPdf(docDefinition);
  }


  print() {
    //////PDF CREATION LOGIC SAVED FOR PRO VERSION

    this.createPdf();

    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer(function (buffer) {

        let utf8 = new Uint8Array(buffer);
        let binaryArray = utf8.buffer;

        var filename = this.formname + new Date().toDateString();
        // var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.externalDataDirectory, filename+'.pdf', binaryArray, { replace: true }).then(fileEntry => {

          const toast = this.toastCtrl.create({
            message: 'File saved to your device',
            duration: 3000,
            position: 'top'
          });
          toast.present();


          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.documentsDirectory + filename+'.pdf', 'application/pdf');
        })
      });


      // create the pdf document first
      // this.pdfObj.getBuffer((buffer) => {

      //   var utf8 = new Uint8Array(buffer);
      //   var binaryArray = utf8.buffer;
      //   var blob = new Blob([binaryArray], { type: 'application/pdf' });

      //   this.saveAndOpenPdf(blob, "Form.pdf");
      //   // this.file.writeFile(this.file.externalDataDirectory, this.formName + '.pdf', blob, { replace: true }).then(fileEntry => {

      //   //   this.fileOpender.open(this.file.externalDataDirectory + this.formName + '.pdf', 'application/pdf');
      //   // }).catch((e) => {
      //   //   alert(e.message);
      //   // });

      // })

    } else {
      console.log("Inside download");

      this.pdfObj.download();

    }

    //this.presentAlert();
  }


  saveAndOpenPdf(pdf: any, filename: string) {

    var pdfloader = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Creating Pdf...",
    });
    pdfloader.present();

    const writeDirectory = this.plt.is('ios') ? this.file.documentsDirectory : this.file.externalDataDirectory;

    this.file.writeFile(writeDirectory, filename, pdf, { replace: true })
      .then(() => {
        pdfloader.dismiss();
        this.error = "Inside saveAndOpenPdf()-- WriteFile()";

        this.fileOpener.open(writeDirectory + filename, 'application/pdf')
          .catch((errors) => {
            console.log('Error opening pdf file');
            this.error = "Inside saveAndOpenPdf()-- Open-- " + errors;
            pdfloader.dismiss();

          });
      })
      .catch((errors) => {
        console.error('Error writing pdf file');
        this.error = errors;
        pdfloader.dismiss();
      });
    // this.file.writeFile(writeDirectory, filename, this.convertBaseb64ToBlob(pdf, 'application/pdf'), {replace: true})
    //   .then(() => {
    //       this.loader.dismiss();
    //       this.fileOpender.open(writeDirectory + filename, 'application/pdf')
    //           .catch(() => {
    //               console.log('Error opening pdf file');
    //               this.loader.dismiss();
    //           });
    //   })
    //   .catch(() => {
    //       console.error('Error writing pdf file');
    //       this.loader.dismiss();
    //   });
  }


  convertBaseb64ToBlob(b64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }



  printToWirelessPrinter() {




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


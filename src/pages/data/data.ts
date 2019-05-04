import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform, ToastController } from 'ionic-angular';
import { Printer, PrintOptions } from '@ionic-native/printer';
import firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from "rxjs/Rx";
import { QuestionBase } from './../../providers/question-base';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { isRightSide } from 'ionic-angular/umd/util/util';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DomSanitizer } from '@angular/platform-browser';

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
  alignment: string = "vertical";

  constructor(private printer: Printer, public af: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams,
    private loadingCtrl: LoadingController, private alertCtrl: AlertController,
    private file: File, private fileOpener: FileOpener, private plt: Platform,
    private toastCtrl: ToastController,private DomSanitizer: DomSanitizer
  ) {
    this.myPhotosRef = firebase.storage().ref();
    this.formData = navParams.get('param1');
  

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
      else if (key.toLowerCase().includes("sign")) {

       

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
         // (<HTMLImageElement>document.querySelector("." + ctrlKey)).src = this.formData[CurrentKey];
          (<HTMLImageElement>document.querySelector("." + CurrentKey)).src = url;

          ctrlKey = '';
         
          console.log("Inside IMAGE URL" + imageURL);

        }).catch(function (error) {
          //alert(error);
          console.log(error);
        });


       // this.data.push({ key: key, value: imageURL });

        this.data.push({ key: key, value:  this.formData[key] });
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


 


  convertToDataURLviaCanvas(url, outputFormat){
    return new Promise((resolve, reject) => {
   var  img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      resolve(dataURL);
      canvas = null;
    };
    img.src = url;
  });
}



  getImageUrl(imageName, CurrentKey): any {

    if (imageName != "") {
      var storageRef = firebase.storage().ref();
      storageRef.child('images/' + imageName).getDownloadURL().then(function (url) {
        console.log("Inside IMAGE URL" + url);
       // (<HTMLImageElement>document.querySelector("." + CurrentKey)).src = url;

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




  createPdfObject() {


    for (let item of this.columns) {

      this.columnRelDataForPdf.push(this.formData[item.columnDef])

    }

    console.log("Inside create pdf");

    console.log(this.columnDataForPdf);
    console.log(this.columnRelDataForPdf);


    var bodyData = [];
    var dataRowHeader = [];
    dataRowHeader.push(
      { text: this.formName, style: 'subheader', color: 'black', opacity: 0.3, bold: true, alignment: 'left' }
    )


    dataRowHeader.push({ text: new Date().toDateString(), color: 'black', opacity: 0.3, bold: true, alignment: 'right' });
    bodyData.push(dataRowHeader);

    for (let item of this.columns) {

      var dataRow = [];

      dataRow.push(item.header);
    

      if(item.elementtype=='Photo' || item.elementtype=='Signature'  ){
        dataRow.push({
          image:this.formdata[item.columnDef],
          width: 200,
          alignment: 'left'
        });
   

      }else{
        dataRow.push(this.formdata[item.columnDef] == undefined ? "" : this.formdata[item.columnDef]);
      }
      bodyData.push(dataRow);


    }







    // var docDefinition = {
    //   content: [
    //     {
    //       layout: 'lightHorizontalLines', // optional
    //       table: {
    //         // headers are automatically repeated if the table spans over multiple pages
    //         // you can declare how many rows should be treated as headers
    //         headerRows: 1,
    //         widths: ['*', '*'],

    //         body: bodyData
    //       }
    //     }
    //   ], styles: {
    //     header: {
    //       bold: true,
    //       fontSize: 20,
    //       alignment: 'right'
    //     }
    //   }
    // };

    var docDefinition = {
      // watermark: {text: 'Minute Forms', color: 'green', opacity: 0.3, bold: true, italics: false,alignment: 'left'},
      
    //   header: function(currentPage, pageCount, pageSize) {
    //     return [
    //         { image: 'sampleImage.jpg', height: 30, width: 100 }
    //     ]
    // },
      content: [
     
        { text: 'Minute Forms', style: 'header', color: 'green', opacity: 0.3, bold: true, alignment: 'left' },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: bodyData
          }
        }

      ], styles: {
        header: {
          bold: true,
          fontSize: 30,
          alignment: 'right'
        }
      }
    };


    this.pdfObj = pdfMake.createPdf(docDefinition);

  }


  print() {
    //////PDF CREATION LOGIC SAVED FOR PRO VERSION

    this.createPdfObject();

    var pdfloader1 = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Creating Pdf...",
    });

    if (this.plt.is('cordova')) {
      // this.pdfObj.getBuffer(function (buffer) {


      //   pdfloader1.present();

      //   let utf8 = new Uint8Array(buffer);
      //   let binaryArray = utf8.buffer;

      //   //var filename = this.formname + new Date().toDateString();
      //    var blob = new Blob([buffer], { type: 'application/pdf' });

      //   // Save the PDF to the data Directory of our App

      //   var dirpath = this.plat.is('ios') ? this.file.documentsDirectory : this.file.dataDirectory;
      //   this.file.writeFile(dirpath, 'Form.pdf', blob, { replace: true }).then(fileEntry => {

      //     pdfloader1.dismiss();

      //     // Open the PDf with the correct OS tools
      //     this.fileOpener.open(dirpath + 'Form.pdf', 'application/pdf');
      //   })
      // });


      //create the pdf document first
      this.pdfObj.getBuffer((buffer) => {

        var utf8 = new Uint8Array(buffer);
        var binaryArray = utf8.buffer;
        var blob = new Blob([binaryArray], { type: 'application/pdf' });

        this.saveAndOpenPdf(blob, "Form.pdf");
        // this.file.writeFile(this.file.externalDataDirectory, this.formName + '.pdf', blob, { replace: true }).then(fileEntry => {

        //   this.fileOpender.open(this.file.externalDataDirectory + this.formName + '.pdf', 'application/pdf');
        // }).catch((e) => {
        //   alert(e.message);
        // });

      });


    } else {
      console.log("Inside download");

      var pdfloader = this.loadingCtrl.create({
        spinner: "bubbles",
        content: "Creating Pdf...",
      });
      pdfloader.present();

      this.pdfObj.download();

      pdfloader.dismiss();

    }

    //this.presentAlert();
  }


  saveAndOpenPdf(pdfObject: any, filename: string) {

    var pdfloader = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Creating Pdf...",
    });
    pdfloader.present();

    const writeDirectory = this.plt.is('ios') ? this.file.documentsDirectory : this.file.dataDirectory;

    this.file.writeFile(writeDirectory, filename, pdfObject, { replace: true })
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


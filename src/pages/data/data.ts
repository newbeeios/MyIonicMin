import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController } from 'ionic-angular';
import { Printer, PrintOptions } from '@ionic-native/printer';


@IonicPage()
@Component({
  selector: 'page-data',
  templateUrl: 'data.html',
})
export class DataPage {
  formData:any;
   //col:any = ["Field Name", "User Input"];
   //rows:any = [];
   data: {key: string, value: string}[] = [];
  constructor(private printer: Printer,public navCtrl: NavController, public navParams: NavParams,private loadingCtrl: LoadingController,private alertCtrl:AlertController) {
    this.formData = navParams.get('param1');
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad DataPage');

    let loader = this.loadingCtrl.create({
      spinner:"bubbles",
      content: "Loading...",
    });
    loader.present();
   
        let formName:string;

        for (var key in this.formData) {
          var temp = [key, this.formData[key]];
          if(key=="formname" || key=="formid")
            {
                if(key=="formname"){formName=this.formData[key]}
                continue;
            }
            
          //this.rows.push(temp);
          this.data.push({key:key,value:this.formData[key]})
         
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


  printDisabled(){
this.presentAlert();

  }

  print(){
    
            this.printer.isAvailable().then(function(){
              this.printer.print("https://www.techiediaries.com").then(function(){
                alert("printing done successfully !");
                },function(){
                alert("Error while printing !");
                });
            }, function(){
            alert('Error : printing is unavailable on your device ');
            });
    
    }

  

}

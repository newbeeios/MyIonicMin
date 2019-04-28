import { Component } from '@angular/core';
import { Platform, AlertController,NavController,ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SettingsProvider } from './../providers/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
//import { FCM } from '@ionic-native/fcm';
import { AuthService } from './../providers/auth.service';
import { Network } from '@ionic-native/network';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;
  selectedTheme: String;
  //rootPage:any = LoginPage;
  constructor(private toastCtrl: ToastController,private network: Network,  private authService: AuthService,  //private fcm: FCM, 
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private settings: SettingsProvider, private push: Push, private alertCtrl: AlertController) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      //this.pushsetup();
    
      this.authService.user.subscribe(
        (user) => {
          if (user) {
           this.rootPage = TabsPage;
          }
          else {
          this.rootPage = LoginPage;
          }
        }
      );

           // IN CASE THE USER DISCONNECT
           this.network.onDisconnect().subscribe(() => {

            this.presentToast("network was disconnected :-(");
            //DO YOUR CODE, SAVE SOMETHING ON LOCALDATABASE, CALL FUNCTION, ETC.
          });
    
          // IN CASE USER RECONECCT BACK
          this.network.onConnect().subscribe(() => {

            this.presentToast("network connected!");
           // DO CODE
          });

  
      splashScreen.hide();


    });
  }


  presentToast(Message:any) {
    let toast = this.toastCtrl.create({
      message: Message,
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  // pushsetup() {

  //   this.fcm.getToken().then(token => {
  //     console.log(token);
  //   })
  //   this.fcm.onTokenRefresh().subscribe(token => {
  //     console.log(token);
  //   })
  //   this.fcm.onNotification().subscribe(data => {
  //     if (data.wasTapped) {
  //       console.log("Received in background");
  //       console.log(data);
  //     } else {
  //       console.log("Received in foreground");
      
  //       console.log(data);
  //     };
  //   })



  //   const options: PushOptions = {
  //    android: {
  //        senderID: 'here you SENDER IR from FCM'
  //    },
  //    ios: {
  //        alert: 'true',
  //        badge: true,
  //        sound: 'true'
  //    },
  //    windows: {}
  // };

  // const pushObject: PushObject = this.push.init(options);

  //   pushObject.on('notification').subscribe((notification: any) => {
  //     if (notification.additionalData.foreground) {
  //       let youralert = this.alertCtrl.create({
  //         title: 'New Push notification',
  //         message: notification.message
  //       });
  //       youralert.present();
  //     }
  //   });

  //   pushObject.on('registration').subscribe((registration: any) => {
  //      //do whatever you want with the registration ID
  //   });

  //   pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
  //   }



}

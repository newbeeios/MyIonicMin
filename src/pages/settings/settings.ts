import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthService } from './../../providers/auth.service';
import { LoginPage } from '../login/login';
import { Platform } from 'ionic-angular';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import { SettingsProvider } from './../../providers/settings/settings';

@Component({
  selector: 'settings',
  templateUrl: 'settings.html',
  providers: [SettingsProvider]
})
export class SettingsComponent {

  text: string;
  userDetails: any;
  selectedTheme: String;
  ThemeValue:boolean=false;

  url = 'https://minuteforms.com';

  constructor(private _AuthService: AuthService, public navCtrl: NavController,
    private alertCtrl: AlertController,
    private socialSharing: SocialSharing, private file: File,
    private plt: Platform, private settings: SettingsProvider
  ) {

    this.text = 'Minute Forms';



    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);

    this.userDetails = _AuthService.userDetails;

    console.log(this.userDetails);
  }


  toggleAppTheme() {
    if (this.selectedTheme === 'dark-theme') {
      this.settings.setActiveTheme('light-theme');
    } else {
      this.settings.setActiveTheme('dark-theme');
    }
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {

            this._AuthService.logout().then((res) => {
              this.navCtrl.setRoot(LoginPage);
              console.log("logout method fired Signed Out");
              this._AuthService.user = null;


            }
            );

          }
        }
      ]
    });
    alert.present();
  }

  logout() {
    this.presentConfirm();
  }


  shareTwitter() {
    if (this.plt.is('android')) {
      this.url = "https://play.google.com/store/apps/details?id=io.minuteforms.com"
    }

    this.socialSharing.shareViaTwitter("", "", this.url).then(() => {
      console.log("Twitter share success");
    }).catch((e) => {
      alert(e.message);
    });
  }



  // async shareTwitter() {
  //   // Either URL or Image
  //   this.socialSharing.shareViaTwitter(null, null, this.url).then(() => {
  //     // Success
  //   }).catch((e) => {
  //     // Error!
  //   });
  // }

  async shareWhatsApp() {
    if (this.plt.is('android')) {
      this.url = "https://play.google.com/store/apps/details?id=io.minuteforms.com"
    }

    // Text + Image or URL works
    this.socialSharing.shareViaWhatsApp(this.text, null, this.url).then(() => {
      // Success
    }).catch((e) => {
      alert(e.message);
    });
  }

  async resolveLocalFile() {
    return this.file.copyFile(`${this.file.applicationDirectory}www/assets/imgs/`, 'icon.png', this.file.cacheDirectory, `${new Date().getTime()}.jpg`);
  }

  removeTempFile(name) {
    this.file.removeFile(this.file.cacheDirectory, name);
  }

  async shareEmail() {
    let file = await this.resolveLocalFile();

    if (this.plt.is('android')) {
      this.url = "https://play.google.com/store/apps/details?id=io.minuteforms.com"
    }

    this.socialSharing.shareViaEmail(this.text, 'Minute Forms', ['saimon@devdactic.com'], null, null, file.nativeURL).then(() => {
      this.removeTempFile(file.name);
    }).catch((e) => {
      alert(e.message);
    });
  }

  async shareFacebook() {
    let file = await this.resolveLocalFile();

    if (this.plt.is('android')) {
      this.url = "https://play.google.com/store/apps/details?id=io.minuteforms.com"
    }

    // Image or URL works
    this.socialSharing.shareViaFacebook(null, file.nativeURL, null).then(() => {
      this.removeTempFile(file.name);
    }).catch((e) => {
      alert(e.message);
    });
  }


}

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { Printer } from '@ionic-native/printer';
import { Network } from '@ionic-native/network';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {HistoryPage} from '../pages/history/history';
import { DynamicFormPage } from '../pages/dynamicform/dynamicform';
import { DFormPage } from '../pages/d-form/d-form';
import { DynamicFormComponent }         from './dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';
import {PicklistModalViewPage} from '../pages/picklist-modal-view/picklist-modal-view';
import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {ResetPasswordPage} from '../pages/resetpassword/resetpassword';
import {ReportsPage} from '../pages/reports/reports';
import {DataPage} from '../pages/data/data';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpModule } from '@angular/http';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { FirebaseProvider } from './../providers/firebase/firebase';
import { QuestionService } from './../providers/question-service';
import {AuthService} from './../providers/auth.service';
import { AngularFireAuthModule } from 'angularfire2/auth';


import { SettingsProvider } from './../providers/settings/settings';

import {SettingsComponent} from '../pages/settings/settings';



import {GooglePlus} from '@ionic-native/google-plus';
import {GoogleloginComponent} from './../components/googlelogin/googlelogin';
import { Push} from '@ionic-native/push';
import { FCM } from '@ionic-native/fcm';


import { SignaturePage } from '../pages/signature/signature';
import { SignaturePadModule } from 'angular2-signaturepad';


export const firebaseConfig={
    apiKey: "AIzaSyDJzt1-d5doukG8_TX6D06_xKbQOf7WaRQ",
    authDomain: "minute-forms.firebaseapp.com",
    databaseURL: "https://minute-forms.firebaseio.com",
    projectId: "minute-forms",
    storageBucket: "minute-forms.appspot.com",
    messagingSenderId: "540411607255"

}



@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    DynamicFormPage,
    DFormPage,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    PicklistModalViewPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    SettingsComponent,
    ReportsPage,
    DataPage,
    GoogleloginComponent,
    SignaturePage,
    HistoryPage
  ],
  imports: [
    BrowserModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IonicModule.forRoot(MyApp),
    HttpModule,
    AngularFireAuthModule,
    SignaturePadModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    DynamicFormPage,
    DFormPage,
    PicklistModalViewPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    SettingsComponent,
    ReportsPage,
    DataPage,
    GoogleloginComponent,
    SignaturePage,
    HistoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseProvider,
    QuestionService,
    BarcodeScanner,
    Geolocation,
    Camera,
    Printer,
    Network,
    AuthService,
    SettingsProvider,
    GooglePlus,
    Push,
    FCM,
    Device
  ]
})
export class AppModule {}

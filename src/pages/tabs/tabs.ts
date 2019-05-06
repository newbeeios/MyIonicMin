import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { DFormPage } from '../d-form/d-form';
import {SettingsComponent} from '../settings/settings';
import {ReportsPage} from '../reports/reports';
import {HistoryPage} from '../history/history';
import { OcrscannerpagePage } from '../ocrscannerpage/ocrscannerpage';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = HistoryPage; //AboutPage;
  tab3Root = SettingsComponent;
  tab4Root = ReportsPage;
   tab5Root = OcrscannerpagePage;


  constructor() {

  }
}

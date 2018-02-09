import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PicklistModalViewPage } from './picklist-modal-view';

@NgModule({
  declarations: [
    PicklistModalViewPage,
  ],
  imports: [
    IonicPageModule.forChild(PicklistModalViewPage),
  ],
})
export class PicklistModalViewPageModule {}

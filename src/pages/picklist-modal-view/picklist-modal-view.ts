import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-picklist-modal-view',
  templateUrl: 'picklist-modal-view.html',
})
export class PicklistModalViewPage {
  public key:any;
  public options: any;
  public cbk: any;
  myInput: any;
  searchItemsInitial: any;
  searchItems: any;
  //public result: {key: string, value: string}[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.searchItemsInitial = navParams.get("options");
    this.searchItems = navParams.get("options");

    this.key = navParams.get("key");
    this.options = navParams.get("options");
    this.cbk =  this.navParams.get("callback")
    console.log(this.options);

  }

  searchPickList(searchbar) {
    

  
    // reset countries list with initial call
    this.searchItems = this.searchItemsInitial;
    // set q to the value of the searchbar
    var q = searchbar.data;


// if the value is an empty string don't filter the items

    if (q && q.trim() != '') {
      this.searchItems = this.searchItems.filter((item) => {
        return (item.value.toLowerCase().indexOf(q.toLowerCase()) > -1);
      })
    }


} 





ValueSelected(param){

  // this.result =[{key: this.key,  value: param}];

  this.cbk(this.key,param).then(()=>{
    this.navCtrl.pop();
 });
}
 

  ionViewDidLoad() {
    console.log('ionViewDidLoad PicklistModalViewPage');
  }

}

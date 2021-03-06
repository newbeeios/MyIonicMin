import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from './question-base';
import { QuestionControlService } from './question-control.service';
import { AuthService } from './../providers/auth.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { AlertController, NavController,ModalController } from 'ionic-angular';
import * as firebase from 'firebase';
import { Device } from '@ionic-native/device';
import {SuccessmessagePage} from '../pages/successmessage/successmessage';

@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnChanges {

    //@Input() questions: QuestionBase<any>[] = [];
    form: FormGroup;
    //@Input() questions: Observable<QuestionBase<any>[]>;
    //form: Observable<FormGroup>;
    payLoad = '';
    data: FirebaseListObservable<any[]>;

    @Input() formnamestring: string;
    @Input() formId: string;


    private _questions = [];
    @Input()
    set questions(value: any[]) {
        this._questions = value || [];
    }
    get questions(): any[] {
        return this._questions;
    }


    constructor(private device: Device, private authService: AuthService, 
        private qcs: QuestionControlService, private af: AngularFireDatabase, 
        private alertCtrl: AlertController, private navCtrl: NavController,
        public modalCtrl: ModalController) {

        this.data = af.list('/data', {
            query: {
                limitToLast: 1
            }
        });



        console.log("DynamicFormComponent constructor triggered");

    }

    presentSuccessModal() {
        this.navCtrl.pop();
        let successModal = this.modalCtrl.create(SuccessmessagePage);
        successModal.present();
      }

    // ngOnInit() {  

    //   console.log("DynamicFormComponent ngOnInit triggered");
    //   console.log(this.questions);
    //   this.form = this.qcs.toFormGroup(this.questions);

    // }




    ngOnChanges() {

        this.form = this.qcs.toFormGroup(this.questions);

    }



    // ngOnChanges(changes: any) {
    //   this.form = this.qcs.toFormGroup(changes.questions);
    // }

    getMonth(month: Number) {

        switch (month) {
            case 1: {
                return 'JAN';
            }
            case 2: {
                return 'FEB';
            }
            case 3: {
                return 'MAR';
            }
            case 4: {
                return 'APR';
            }
            case 5: {
                return 'MAY';
            }
            case 6: {
                return 'JUN';
            }
            case 7: {
                return 'JUL';
            }
            case 8: {
                return 'AUG';
            }
            case 9: {
                return 'SEP';
            }
            case 10: {
                return 'OCT';
            }
            case 11: {
                return 'NOV';
            }
            case 12: {
                return 'DEC';
            }

            default: {
                return '';
            }
        }

    }

    onSubmit() {

        this.payLoad = JSON.stringify(this.form.value);
        var inserted = this.data.push(this.form.value).key;



        this.af.object('/data/' + inserted)
            .update({
                "createdby": this.authService.userDetails.email,
                "formid": this.formId,
                "formname": this.formnamestring,
                "createddate": new Date().getDate() + '-' + this.getMonth(new Date().getMonth()) + '-' + new Date().getFullYear(),
                "createdtime": new Date().getHours() + ':' + new Date().getMinutes(),
                "deviceuuid": this.device.uuid,
                "devicemodel": this.device.model,
                "platform": this.device.platform,
                "devicehardwareserial": this.device.serial,
                "osversion": this.device.version,
                "devicemanufacturer": this.device.manufacturer
            });

            var adaRankRef = firebase.database().ref('forms/' + this.formId + '/datacount');
            adaRankRef.transaction(function (currentRank) {
                return currentRank == null ? 1 : currentRank + 1;
            });



        if (inserted != null) {
            // Increase the records count
            var adaRankRef = firebase.database().ref('counts/data');
            adaRankRef.transaction(function (currentRank) {
                return currentRank == null ? 0 : currentRank + 1;
            });

            
            this.presentSuccessModal();
       
            //this.presentAlert();
        }

        //this.data.push(this.payLoad);
    }

    presentAlert() {
        let alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: 'Data saved successfully.',
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.navCtrl.pop();
                }
            }]
        });
        alert.present();
    }


}


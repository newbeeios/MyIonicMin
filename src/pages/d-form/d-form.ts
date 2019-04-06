import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from './../../providers/question-base';
import { QuestionService } from './../../providers/question-service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


import { Observable } from 'rxjs';

//Controrls Import

import { DropdownQuestion } from './../../providers/question-dropdown';
import { TextboxQuestion } from './../../providers/question-textbox';
import { TextAreaQuestion } from './../../providers/question-textarea';
import { SegmentQuestion } from './../../providers/question-segment';
import { MultiSelectQuestion } from './../../providers/question-multiselect';
import { ScannerQuestion } from './../../providers/question-scanner';
import { GpsQuestion } from './../../providers/question-gps';
import { PictureQuestion } from './../../providers/question-picture';
import { CheckboxQuestion } from './../../providers/question-checkbox';
import { PickListQuestion } from './../../providers/question-picklist';
import { DateQuestion } from './../../providers/question-date';
import { TimeQuestion } from './../../providers/question-time';
import { SignatureQuestion } from './../../providers/question-signature';



import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from "rxjs/Rx";




// @IonicPage()
@Component({
  selector: 'page-d-form',
  templateUrl: 'd-form.html',
  providers: [QuestionService]
})



export class DFormPage implements OnInit, OnChanges {

  //@Input() questions: Observable<any>[]=[];

  questions: QuestionBase<any>[] = [];

  questions1$: QuestionBase<any>[] = [];

  private _questions = new BehaviorSubject<QuestionBase<any>[]>([]);

  //questions: BehaviorSubject<QuestionBase<any>[]> = new BehaviorSubject([]);
  //public questions: QuestionBase<any>[] = [];

  //@Input() questions: Observable<QuestionBase<any>[]>;

  form: FormGroup;
  payLoad = '';
  parameter1: any;
  questions$: Observable<any>;
  formName: any;
  formKey = '';
  options: { key: string, value: string }[] = [];
  @Input()
  set data(value) {
    // set the latest value for _data BehaviorSubject
    this._questions.next(value);
  };

  get data() {
    // get the latest value from _data BehaviorSubject
    return this._questions.getValue();
  }


  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public af: AngularFireDatabase, public navParams: NavParams, private qcs: QuestionService) {

    this.parameter1 = navParams.get('param1');
    this.formName = this.parameter1.displaytext;
    this.formKey = this.parameter1.$key;

  }



  ngOnInit() {

    console.log("Form Name:" + this.formName);

    this.getQuestionsAsync(this.parameter1.$key);

  }


  getQuestions(FormKey: string): Observable<QuestionBase<any>[]> {

    return this.af.list('/elements', {
      query: {
        limitToLast: 200,
        orderByChild: 'formid',
        equalTo: FormKey
      }
    }).map(snapshots => {
      const questions: QuestionBase<any>[] = [];

      snapshots.forEach(elementData => {
        questions.push(this.FilterControls(elementData))
        // questions.push(new TextboxQuestion({
        //     key: elementData.elementname,
        //     label: elementData.displaytext,
        //     value: elementData.elementvalue,
        //     required: false,
        //     order: elementData.sortorder
        // }))
      })

      return questions;
    })
  }






  getQuestionsAsync(FormKey: string) {
    console.log("Async Function entered");
    console.log(FormKey);


    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });

    loading.present();

    const dbQuestions$ = this.af.list('/elements', {
      query: {
        limitToLast: 200,
        orderByChild: 'formid',
        equalTo: FormKey
      }
    });

    this.questions$ = dbQuestions$.map(snapshots =>
      snapshots.map(data =>
        this.FilterControls(data)
        // new TextboxQuestion({
        //   key: data.elementname,
        //   label: data.displaytext,
        //   value: data.elementvalue,
        //   required: false,
        //   order: data.sortorder
        // })

      ));

    this.questions$.subscribe(() => loading.dismiss());

  }


  ngOnChanges(data) {

    //this.questions = data;

  }


  FilterControls(elementData: any): QuestionBase<any> {
    console.log("Inside FilterControls");
    console.log(elementData.elementtype);

    switch (elementData.elementtype) {
      case "Textbox":

        return new TextboxQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: elementData.elementvalue,
          required: elementData.required ? elementData.required : false,
          order: elementData.sortorder
        });



      case 'Dropdown':

        console.log(elementData.options);

        if (elementData.options == undefined) {
          return new DropdownQuestion({
            key: elementData.elementname,
            label: elementData.displaytext,
            value: '',
            required: elementData.required ? elementData.required : false,
            order: elementData.sortorder,
            options: [] //this.options   //elementData.options  //optionsData

          });

        } else {
          return new DropdownQuestion({
            key: elementData.elementname,
            label: elementData.displaytext,
            value: '',
            required: elementData.required ? elementData.required : false,
            order: elementData.sortorder,
            options: Object.keys(elementData.options).map(e => elementData.options[e]) //this.options   //elementData.options  //optionsData

          });
        }

      case 'PickList':
        console.log("==========dropdown data=======" + elementData.options);

        if (elementData.options == undefined) {
          return new PickListQuestion({
            key: elementData.elementname,
            label: elementData.displaytext,
            value: elementData.elementvalue,
            required: elementData.required ? elementData.required : false,
            options: [],//elementData.options,
            order: elementData.sortorder
          });

        } else {
          return new PickListQuestion({
            key: elementData.elementname,
            label: elementData.displaytext,
            value: elementData.elementvalue,
            options: Object.keys(elementData.options).map(e => elementData.options[e]),//elementData.options,
            order: elementData.sortorder,
            required: elementData.required ? elementData.required : false
          });
        }

      case 'Multi-Select':

        if (elementData.options == undefined) {
          return new MultiSelectQuestion({
            key: elementData.elementname,
            label: elementData.displaytext,
            value: elementData.elementvalue,
            options: [],//elementData.options,
            order: elementData.sortorder,
            required: elementData.required ? elementData.required : false
          });
        } else {
          return new MultiSelectQuestion({
            key: elementData.elementname,
            label: elementData.displaytext,
            value: elementData.elementvalue,
            required: elementData.required ? elementData.required : false,
            options: Object.keys(elementData.options).map(e => elementData.options[e]),//elementData.options,
            order: elementData.sortorder
          });

        }



      case 'TextArea':

        return new TextAreaQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: elementData.elementvalue,
          required: elementData.required ? elementData.required : false,
          order: elementData.sortorder

        });


      case 'CheckBox':

        return new CheckboxQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: elementData.elementvalue,
          required: elementData.required ? elementData.required : false,
          order: elementData.sortorder

        });

      case 'Scanner':

        return new ScannerQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: '',
          required: elementData.required ? elementData.required : false,
          order: elementData.sortorder
        });

      case 'Gps':
        console.log("========================GPS=====================");
        return new GpsQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: '',
          required: elementData.required ? elementData.required : false,
          order: elementData.sortorder

        });


      case 'Signature':

        return new SignatureQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: '',
          required: elementData.required ? elementData.required : false,
          order: elementData.sortorder

        });




      case 'Segment':
        console.log("========================SEGMENT=====================");
        if (elementData.options == undefined) {
          return new SegmentQuestion({
            key: elementData.elementname,
            label: elementData.displaytext,
            options: [],
            order: elementData.sortorder,
            required: elementData.required ? elementData.required : false
          });
        } else {
          return new SegmentQuestion({
            key: elementData.elementname,
            label: elementData.displaytext,
            options: elementData.options,
            order: elementData.sortorder,
            required: elementData.required ? elementData.required : false
          });
        }


      case 'YesNo':

        return new SegmentQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          options: [
            { key: 'Yes', value: 'Yes' },
            { key: 'No', value: 'No' },
            { key: 'N/A', value: 'N/A' }
          ],
          order: elementData.sortorder,
          required: elementData.required ? elementData.required : false
        });


      case 'Gender':

        return new SegmentQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          options: [
            { key: 'male', value: 'Male' },
            { key: 'female', value: 'Female' },
            { key: 'unknown', value: 'Unknown' }
          ],
          order: elementData.sortorder,
          required: elementData.required ? elementData.required : false
        });


      case 'Time':

        return new TimeQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: elementData.value,
          required: elementData.required ? elementData.required : false,
          order: elementData.sortorder


        });

      case 'Date':

        return new DateQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: new Date().toISOString(),  //elementData.value,
          required: elementData.required ? elementData.required : false,
          order: elementData.sortorder

        });

      case 'Photo':
        return new PictureQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: elementData.value,
          required: elementData.required ? elementData.required : false,
          order: elementData.sortorder

        });

      default:
        return new TextboxQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: elementData.elementvalue,
          required: elementData.required ? elementData.required : false,
          order: elementData.sortorder
        });


    }







  }


  getQuestionsData(): QuestionBase<any>[] {

    console.log("getQuestionsData Executed");

    this.af.list('/elements/').subscribe(
      res => {
        res.map((elementData: any) => {
          console.log(elementData.elementtype);


          switch (elementData.elementtype) {
            case "Textbox":

              this.questions.push(new TextboxQuestion({
                key: elementData.elementname,
                label: elementData.displaytext,
                value: elementData.elementvalue,
                required: false,
                order: elementData.sortorder
              }))

              break;

            case 'Dropdown':

              console.log(elementData.options);
              // var optionsData:any[];
              var optionsData: { key: string, value: string }[] = [];


              this.questions.push(new DropdownQuestion({
                key: elementData.elementname,
                label: elementData.displaytext,
                value: elementData.elementvalue,
                required: false,
                order: elementData.sortorder,
                options: optionsData //elementData.options

              }))
              break;

            case 'PickList':
              this.questions.push(new PickListQuestion({
                key: elementData.elementname,
                label: elementData.displaytext,
                value: elementData.elementvalue,
                options: elementData.options,
                order: elementData.sortorder
              }))
              break;
            case 'TextArea':

              this.questions.push(new TextAreaQuestion({
                key: elementData.elementname,
                label: elementData.displaytext,
                value: elementData.elementvalue,
                required: false,
                order: elementData.sortorder

              }))
              break;
            case 'CheckBox':

              this.questions.push(new CheckboxQuestion({
                key: elementData.elementname,
                label: elementData.displaytext,
                value: elementData.elementvalue,
                required: false,
                order: elementData.sortorder

              }))
              break;

          }




        })

        console.log("Elements with subscribe");
        //console.log(res.values);


      },
      err => console.log("Error retrieving Todos")


    );

    return this.questions;


  }



}

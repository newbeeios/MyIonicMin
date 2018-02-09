import { Injectable } from '@angular/core';
import { DropdownQuestion } from './question-dropdown';
import { QuestionBase } from './question-base';
import { TextboxQuestion } from './question-textbox';
import { TextAreaQuestion } from './question-textarea';
import { SegmentQuestion } from './question-segment';
import { MultiSelectQuestion } from './question-multiselect';
import { ScannerQuestion } from './question-scanner';
import { GpsQuestion } from './question-gps';
import { PictureQuestion } from './question-picture';
import { CheckboxQuestion } from './question-checkbox';
import { PickListQuestion } from './question-picklist';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
//import {BehaviorSubject} from "rxjs/Rx";


@Injectable()
export class QuestionService {

  //public questions: QuestionBase<any>[] = [];

  public questions: QuestionBase<any>[] = [];

  questions$: QuestionBase<any>[]=[];
  //public questions: Observable<QuestionBase<any>[]>;
  pageData: any;

  constructor(public af: AngularFireDatabase, private http: Http) {

  }


  getQuestionsAsync(FormKey: string) {
    


        const dbQuestions$ = this.af.list('/elements', {
          query: {
            limitToLast: 200,
            orderByChild: 'formid',
            equalTo: FormKey
          }
        });
    
        return dbQuestions$.map(snapshots => 
          snapshots.map(data => new TextboxQuestion({
            key: data.elementname,
            label: data.displaytext,
            value: data.elementvalue,
            required: false,
            order: data.sortorder
          })));
      
    }




  getQuestions$() {
    const url ='https://api.myjson.com/bins/d0srd'; //'https://minute-forms.firebaseio.com/elements.json'; 
   





   // console.log('getQuestions Triggered');

   return this.af.list('/elements/').map((items)=>{
    items.map(questionMetadata => this.metadataToQuestions(questionMetadata))
    //.map(questions=>questions)
    
    //.sort((a, b) => a.order - b.order)
    //.map(questions => questions.sort((a, b) => a.order - b.order))
   });
    


  //  var testConnection = this.af.list('/elements/')
  //  .map((items) => { //first map
  //    console.log(items);
  //    return items.map(item => { //second map
  //      console.log(items);
  //      console.log(item);
  //    })
  //  })


    // return this.http.get(url)
    // .map(response => response.json())
    // .map(questionMetadata => this.metadataToQuestions(questionMetadata))
    // .map(questions => questions.sort((a, b) => a.order - b.order))
   
   
    // return this.http.get(url)
    //   .map(response => response.json())
    //   .map(questionMetadata => this.metadataToQuestions(questionMetadata))
    //   .map(questions => questions.sort((a, b) => a.order - b.order))





  }




  //questions: FirebaseListObservable<QuestionBase<any>[]>;


  // getQuestions(FormKey: string): Observable<QuestionBase<any>[]> {
  getQuestions(FormKey: string) //: QuestionBase<any>[] 
  {

    var dbQuestions = this.af.object('/elements/', { preserveSnapshot: true }).take(100);

    this.af.object('/elements/', { preserveSnapshot: true }).take(1).forEach(function (child) {

      var key = child.key;
      //var elementData = child.val();
      console.log("=======================Inside Foreach ==========================");


      child.forEach(function (elementsData) {

        var elementData = elementsData.val();

    
        console.log("value inside child data: "+elementData);

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
            this.questions.push(new DropdownQuestion({
              key: elementData.elementname,
              label: elementData.displaytext,
              value: elementData.elementvalue,
              required: false,
              order: elementData.sortorder,
              options: elementData.options

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

        ;
      });

    });

    //return this.questions;

  }


  private metadataToQuestions(questionMetadata) {
  console.log(questionMetadata);

  this.questions.push(this.toQuestion(questionMetadata));
  //return questionMetadata.map(this.toQuestion);
   return this.toQuestion(questionMetadata);
    //return questionMetadata.questions.map(this.toQuestion)
  }


  private toQuestion(elementData) {

    console.log("inside toQuestion function");

    if(elementData.elementtype=='Textbox') {
     
   console.log("This element is a Textbox");

      return new TextboxQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: elementData.elementvalue,
          required: false,
          order: elementData.sortorder
        })
      }else if(elementData.elementtype=='Dropdown')
      {
        new DropdownQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: elementData.elementvalue,
          required: false,
          order: elementData.sortorder,
          options: elementData.options

        })
      }else if(elementData.elementtype=='PickList')
      {
        new PickListQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: elementData.elementvalue,
          options: elementData.options,
          order: elementData.sortorder
        })

      }else if(elementData.elementtype=='TextArea')
      {
        new TextAreaQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: elementData.elementvalue,
          required: false,
          order: elementData.sortorder

        })


      }
      else if(elementData.elementtype=='CheckBox')
        {
          new CheckboxQuestion({
            key: elementData.elementname,
            label: elementData.displaytext,
            value: elementData.elementvalue,
            required: false,
            order: elementData.sortorder
  
          })
  
  
        }else{

          return new TextboxQuestion({
            key: elementData.elementname,
            label: elementData.displaytext,
            value: elementData.elementvalue,
            required: false,
            order: elementData.sortorder
          })

        }


    }




  


  public createElement(elementData: any) {


    console.log("==============Create element executed===============");

    debugger;
    switch (elementData.elementtype) {
      case 'Textbox':
        this.questions.push(new TextboxQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: elementData.elementvalue,
          required: false,
          order: elementData.sortorder
        }))

        break;

      case 'Dropdown':
        this.questions.push(new DropdownQuestion({
          key: elementData.elementname,
          label: elementData.displaytext,
          value: elementData.elementvalue,
          required: false,
          order: elementData.sortorder,
          options: elementData.options

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


  }




}




    // let questions1: QuestionBase<any>[] = [


    //   new MultiSelectQuestion({
    //     key: 'role',
    //     label: 'Roles',
    //     options: [
    //       { key: 'developer', value: 'Developer' },
    //       { key: 'manager', value: 'Manager' },
    //       { key: 'hr', value: 'HR' },
    //       { key: 'sales', value: 'Sales' }

    //     ],
    //     order: 1
    //   }),
    //   new SegmentQuestion({
    //     key: 'gender',
    //     label: 'Gender',
    //     options: [
    //       { key: 'male', value: 'Male' },
    //       { key: 'female', value: 'Female' },
    //       { key: 'unknown', value: 'Unknown' }

    //     ],
    //     order: 1
    //   }),

    //   new TextboxQuestion({
    //     key: 'firstName',
    //     label: 'First name',
    //     value: 'Bombasto',
    //     required: true,
    //     order: 2
    //   }),
    //   new ScannerQuestion({
    //     key: 'scan',
    //     label: 'Scan barcode',
    //     value: '',
    //     required: false,
    //     order: 2
    //   }),

    //   new TextboxQuestion({
    //     key: 'lastname',
    //     label: 'Last Name',
    //     value: '',
    //     required: false,
    //     order: 3
    //   }),

    //   new TextboxQuestion({
    //     key: 'emailAddress',
    //     label: 'Email',
    //     value: '',
    //     type: 'email',
    //     order: 4
    //   }),

    //   new TextboxQuestion({
    //     key: 'Zip',
    //     label: 'Zip Code',
    //     value: '',
    //     required: true,
    //     order: 5
    //   }),

    //   new TextAreaQuestion({
    //     key: 'Comments',
    //     label: 'Comments',
    //     value: '',
    //     required: true,
    //     order: 6

    //   }),
    //   new GpsQuestion({
    //     key: 'GpsPoints',
    //     label: 'Location Coordinates',
    //     value: '',
    //     required: false,
    //     order: 7

    //   }),
    //   new PictureQuestion({
    //     key: 'pictures',
    //     label: 'Capture Photo',
    //     source: '',
    //     required: false,
    //     order: 8

    //   }),
    //   new CheckboxQuestion({
    //     key: 'local',
    //     label: 'Are you local?',
    //     value: false,
    //     required: false,
    //     order: 9

    //   }),
    //   new PickListQuestion({
    //     key: 'city',
    //     label: 'City',
    //     options: [
    //       { key: 'Greensboro', value: 'Greensboro' },
    //       { key: 'Raleigh', value: 'Raleigh' },
    //       { key: 'Charlotte', value: 'Charlotte' },
    //       { key: 'Morrisville', value: 'Morrisville' }

    //     ],
    //     order: 10
    //   }),
    //   new DropdownQuestion({
    //     key: 'satisfy',
    //     label: 'How do you rate this form?',
    //     options: [
    //       { key: 'ok', value: 'Ok' },
    //       { key: 'average', value: 'Average' },
    //       { key: 'awesome', value: 'Awesome' }

    //     ],
    //     order: 1
    //   }),

    // ];
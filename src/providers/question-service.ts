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



  public questions: QuestionBase<any>[] = [];

  questions$: QuestionBase<any>[]=[];

  pageData: any;

  constructor(public af: AngularFireDatabase) {

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
   
   return this.af.list('/elements/').map((items)=>{
    items.map(questionMetadata => this.metadataToQuestions(questionMetadata))
    
   });
    




   





  }




  getQuestions(FormKey: string) 
  {

    var dbQuestions = this.af.object('/elements/', { preserveSnapshot: true }).take(100);

    this.af.object('/elements/', { preserveSnapshot: true }).take(1).forEach(function (child) {

    
      
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

    

  }


  private metadataToQuestions(questionMetadata) {
  console.log(questionMetadata);

  this.questions.push(this.toQuestion(questionMetadata));
  
   return this.toQuestion(questionMetadata);
    
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




    
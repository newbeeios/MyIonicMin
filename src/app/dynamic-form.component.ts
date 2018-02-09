import { Component, Input, OnChanges }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';
import { QuestionBase }              from './question-base';
import { QuestionControlService }    from './question-control.service';
import { AngularFireDatabase,FirebaseListObservable } from 'angularfire2/database';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ QuestionControlService ]
})
export class DynamicFormComponent implements OnChanges {

  //@Input() questions: QuestionBase<any>[] = [];
  form: FormGroup;
  //@Input() questions: Observable<QuestionBase<any>[]>;
  //form: Observable<FormGroup>;
  payLoad = '';
  data: FirebaseListObservable<any[]>;

  private _questions = [];
  @Input() 
  set questions(value: any[]) {
    this._questions = value || [];
  }
  get questions(): any[] {
    return this._questions;
  }


   constructor(private qcs: QuestionControlService,private af:AngularFireDatabase) { 
  
    this.data = af.list('/data', {
      query: {
          limitToLast: 50
      }
  });

    console.log("DynamicFormComponent constructor triggered");

   }

  // ngOnInit() {  

  //   console.log("DynamicFormComponent ngOnInit triggered");
  //   console.log(this.questions);
  //   this.form = this.qcs.toFormGroup(this.questions);

  // }




ngOnChanges(){

  this.form = this.qcs.toFormGroup(this.questions);

}



  // ngOnChanges(changes: any) {
  //   this.form = this.qcs.toFormGroup(changes.questions);
  // }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
    this.data.push(this.form.value);
  }
 
  
}


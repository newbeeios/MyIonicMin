import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//import { QuestionBase } from './../../providers/firebase/question-base';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

 formelements: FirebaseListObservable<any[]>;

  constructor(public afd: AngularFireDatabase) { }
 
  getShoppingItems() {
    return this.afd.list('/forms/');
  }
 
  addItem(name) {
    this.afd.list('/forms/').push(name);
  }
 
  removeItem(id) {
    this.afd.list('/forms/').remove(id);
  }

  getQuestions(formKey)
  {
    // let questions: QuestionBase<any>[];

     this.formelements =this.afd.list('/elements/');


    console.log(this.formelements);

   return this.afd.list('/elements/');

  }

// getQuestions1() {

//     let questions: QuestionBase<any>[] = [

//       new DropdownQuestion({
//         key: 'brave',
//         label: 'Bravery Rating',
//         options: [
//           {key: 'solid',  value: 'Solid'},
//           {key: 'great',  value: 'Great'},
//           {key: 'good',   value: 'Good'},
//           {key: 'unproven', value: 'Unproven'}
//         ],
//         order: 3
//       }),

//       new TextboxQuestion({
//         key: 'firstName',
//         label: 'First name',
//         value: 'Bombasto',
//         required: true,
//         order: 1
//       }),

//       new TextboxQuestion({
//         key: 'emailAddress',
//         label: 'Email',
//         type: 'email',
//         order: 2
//       })
//     ];

//     return questions.sort((a, b) => a.order - b.order);
//   }





}

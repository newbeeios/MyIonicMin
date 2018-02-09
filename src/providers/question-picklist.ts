import { QuestionBase } from './question-base';

export class PickListQuestion extends QuestionBase<string> {
  controlType = 'picklist';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
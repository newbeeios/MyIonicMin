import { QuestionBase } from './question-base';

export class LabelQuestion extends QuestionBase<string> {
  controlType = 'label';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}



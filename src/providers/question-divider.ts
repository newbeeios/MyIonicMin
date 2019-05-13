import { QuestionBase } from './question-base';

export class DividerQuestion extends QuestionBase<string> {
  controlType = 'divider';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}



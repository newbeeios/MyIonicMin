import { QuestionBase } from './question-base';

export class SignatureQuestion extends QuestionBase<string> {
  controlType = 'sign';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}



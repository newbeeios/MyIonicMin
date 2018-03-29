import { QuestionBase } from './question-base';

export class PictureQuestion extends QuestionBase<string> {
  controlType = 'picture';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}



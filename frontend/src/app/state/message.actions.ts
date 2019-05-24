import { MessageData } from '../message.model';

export class AddMessages {
  static readonly type = '[Message] Add Messages';
  constructor(public data: MessageData) {}
}

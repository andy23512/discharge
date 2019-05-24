import { MessageData, Group } from '../message.model';

export class AddMessages {
  static readonly type = '[Message] Add Messages';
  constructor(public data: MessageData) {}
}

export class SelectGroup {
  static readonly type = '[Message] Select Group';
  constructor(public group: Group) {}
}

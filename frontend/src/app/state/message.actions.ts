export class MessageAction {
  static readonly type = '[Message] Add item';
  constructor(public payload: string) { }
}

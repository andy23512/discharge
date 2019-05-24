import { State, Action, StateContext } from '@ngxs/store';
import { MessageAction } from './message.actions';

export class MessageStateModel {
  public items: string[];
}

@State<MessageStateModel>({
  name: 'message',
  defaults: {
    items: []
  }
})
export class MessageState {
  @Action(MessageAction)
  add(ctx: StateContext<MessageStateModel>, action: MessageAction) {
    const state = ctx.getState();
    ctx.setState({ items: [ ...state.items, action.payload ] });
  }
}

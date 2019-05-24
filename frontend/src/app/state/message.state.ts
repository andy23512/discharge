import { State, Action, StateContext, NgxsOnInit } from '@ngxs/store';
import { AddMessages } from './message.actions';
import { Message, Group, MessageData } from '../message.model';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { filter, map, pipe, pluck, prop, sortBy, split, uniqBy } from 'ramda';
import { parse } from 'ansicolor';
import { DomSanitizer } from '@angular/platform-browser';

export class MessageStateModel {
  public messages: Message[];
  public groups: Group[];
  public selectedGroup: Group;
}

@State<MessageStateModel>({
  name: 'message',
  defaults: {
    messages: [],
    groups: [],
    selectedGroup: null
  }
})
export class MessageState implements NgxsOnInit {
  private socket$: WebSocketSubject<MessageData>;

  constructor(private sanitizer: DomSanitizer) {}

  ngxsOnInit(ctx: StateContext<MessageStateModel>) {
    this.socket$ = webSocket('ws://localhost:8999');
    this.socket$.subscribe(data => ctx.dispatch(new AddMessages(data)));
  }

  @Action(AddMessages)
  AddMessages(ctx: StateContext<MessageStateModel>, { data }: AddMessages) {
    const { messages, groups } = ctx.getState();
    const newMessages = pipe<
      MessageData,
      string,
      string[],
      string[],
      Message[]
    >(
      prop('message'),
      split('\n'),
      filter<string>(log => log.length > 0),
      map(rawMessage => {
        const parsedMessage = parse(rawMessage);
        const groupMatch = parsedMessage.spans[0].text.match(
          /^(\S+)-container\s*\|$/
        );
        const group = groupMatch
          ? {
              name: groupMatch[1],
              css: this.sanitizer.bypassSecurityTrustStyle(
                parsedMessage.spans[0].css
              )
            }
          : null;
        return {
          group,
          chunks: parsedMessage.spans.map(chunk => ({
            ...chunk,
            css: this.sanitizer.bypassSecurityTrustStyle(chunk.css)
          }))
        };
      })
    )(data);
    const newGroups = pipe<Message[], Group[], Group[], Group[]>(
      pluck('group'),
      filter<Group>(Boolean),
      uniqBy(prop('name'))
    )(newMessages);
    ctx.patchState({
      messages: [...messages, ...newMessages],
      groups: sortBy(prop('name'))([...groups, ...newGroups])
    });
  }
}

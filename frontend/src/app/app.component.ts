import { Component } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { Group, Message } from './message.model';
import { SelectGroup } from './state/message.actions';
import { filter } from 'ramda';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  @Select(state => state.message.messages) private messages$: Observable<
    Message[]
  >;
  @Select(state => state.message.groups) public groups$: Observable<Group[]>;
  @Select(state => state.message.selectedGroup)
  public selectedGroup$: Observable<Group>;
  public shownMessages$: Observable<Message[]>;

  constructor(private store: Store) {
    this.shownMessages$ = combineLatest(
      this.messages$,
      this.selectedGroup$
    ).pipe(
      map(([messages, group]) => {
        if (group === null) {
          return messages;
        } else {
          return filter<Message>(
            message => message.group && message.group.name === group.name
          )(messages);
        }
      })
    );
  }

  public groupName(group: Group) {
    return group.name;
  }

  public selectGroup(group: Group) {
    this.store.dispatch(new SelectGroup(group));
  }
}

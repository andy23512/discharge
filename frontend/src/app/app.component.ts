import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Group, Message } from './message.model';
import { SelectGroup } from './state/message.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'frontend';
  @Select(state => state.message.messages) messages$: Observable<Message[]>;
  @Select(state => state.message.groups) groups$: Observable<Group[]>;
  @Select(state => state.message.selectedGroup) selectedGroup$: Observable<
    Group
  >;

  constructor(private store: Store) {}

  public groupName(group: Group) {
    return group.name;
  }

  public selectGroup(group: Group) {
    this.store.dispatch(new SelectGroup(group));
  }
}

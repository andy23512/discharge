import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { Group, Message } from './message.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'frontend';
  @Select(state => state.message.messages) messages$: Observable<Message[]>;
  @Select(state => state.message.groups) groups$: Observable<Group[]>;

  public groupName(group: Group) {
    return group.name;
  }
}

import { Component } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { parse } from 'ansicolor';
import { Observable } from 'rxjs';
import { map as streamMap } from 'rxjs/operators';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { uniqBy, pluck, prop, sortBy, pipe, split, filter, map } from 'ramda';

interface Data {
  message: string;
}

interface Chunk {
  css: SafeStyle;
  text: string;
}

interface Group {
  name: string;
  css: SafeStyle;
}

interface Message {
  group: Group;
  chunks: Chunk[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'frontend';
  private socket$: WebSocketSubject<Data>;
  messages$: Observable<Message[]>;
  groups$: Observable<Group[]>;

  constructor(private sanitizer: DomSanitizer) {
    this.socket$ = webSocket('ws://localhost:8999');
    this.messages$ = this.socket$.pipe(
      streamMap(
        pipe<Data, string, string[], string[], Message[]>(
          prop('message'),
          split('\n'),
          filter<string>(log => log.length > 0),
          map(rawMessage => {
            const parsedMessage = parse(rawMessage);
            const groupMatch = parsedMessage.spans[0].text.match(/^(\S+) \|$/);
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
        )
      )
    );
    this.groups$ = this.messages$.pipe(
      streamMap(
        pipe<Message[], Group[], Group[], Group[], Group[]>(
          pluck('group'),
          filter<Group>(Boolean),
          uniqBy(prop('name')),
          sortBy(prop('name'))
        )
      )
    );
  }

  public groupName(group: Group) {
    return group.name;
  }
}

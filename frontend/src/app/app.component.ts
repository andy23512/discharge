import { Component } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { parse } from 'ansicolor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

interface Data {
  message: string;
}

interface Chunk {
  css: SafeStyle;
  text: string;
}

interface Message {
  group: string;
  chunks: Chunk[];
}

interface Group {
  name: string;
  css: string;
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
      map(data =>
        data.message
          .split('\n')
          .filter(log => log.length > 0)
          .map(rawMessage => {
            const parsedMessage = parse(rawMessage);
            const groupMatch = parsedMessage.spans[0].text.match(/^(\S+) \|$/);
            const group = groupMatch ? groupMatch[1] : null;
            const groupCss = groupMatch ? parsedMessage.spans[0].css : null;
            return {
              group,
              groupCss,
              chunks: parsedMessage.spans.map(chunk => ({
                ...chunk,
                css: this.sanitizer.bypassSecurityTrustStyle(chunk.css)
              }))
            };
          })
      )
    );
    this.groups$ = this.messages$.pipe(
      map(messages =>
        Array.from(new Set(messages.map(message => message.group))).sort()
      )
    );
  }
}

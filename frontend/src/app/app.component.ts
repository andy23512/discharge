import { Component } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

interface Message {
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'frontend';
  private socket$: WebSocketSubject<Message>;

  constructor() {
    this.socket$ = webSocket('ws://localhost:8999');
    this.socket$.subscribe(
      message => console.log(message),
      err => console.error(err),
      () => console.warn('Completed!')
    );
  }
}

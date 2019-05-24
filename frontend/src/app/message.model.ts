import { SafeStyle } from '@angular/platform-browser';

export interface MessageData {
  message: string;
}

export interface Chunk {
  css: SafeStyle;
  text: string;
}

export interface Group {
  name: string;
  css: SafeStyle;
}

export interface Message {
  group: Group;
  chunks: Chunk[];
}

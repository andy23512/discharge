import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSidenavModule, MatListModule } from '@angular/material';
import { NgxsModule } from '@ngxs/store';
import { MessageState } from './state/message.state';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ScrollingModule,
    MatSidenavModule,
    MatListModule,
    NgxsModule.forRoot([MessageState])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

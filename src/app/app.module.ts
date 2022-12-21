import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MeetingRoomPageComponent } from './meeting-room-page/meeting-room-page.component';
import { HeaderComponent } from './shared/components/header/header.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoginPageModule} from "./login-page/login-page.module";
import {HttpClientModule} from "@angular/common/http";
import { MeetingComponent } from './meeting-room-page/shared/components/meeting/meeting.component';

@NgModule({
  declarations: [
    AppComponent,
    MeetingRoomPageComponent,
    HeaderComponent,
    MeetingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoginPageModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

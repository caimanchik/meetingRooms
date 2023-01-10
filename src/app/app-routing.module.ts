import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPageComponent} from "./login-page/login-page.component";
import {MeetingRoomPageComponent} from "./meeting-room-page/meeting-room-page.component";
import {MeetGuard} from "./shared/guards/meet.guard";

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginPageComponent},
  {path: 'meeting-room', component: MeetingRoomPageComponent, canActivate: [MeetGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

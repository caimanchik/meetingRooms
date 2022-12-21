import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginPageComponent} from "./login-page.component";
import { AuthFormComponent } from './shared/components/auth-form/auth-form.component';
import { DecorComponent } from './shared/components/decor/decor.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    LoginPageComponent,
    AuthFormComponent,
    DecorComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class LoginPageModule { }

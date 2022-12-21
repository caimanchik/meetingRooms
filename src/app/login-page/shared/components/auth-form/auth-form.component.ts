import { Component, OnInit } from '@angular/core';
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacityTransitionAnim} from "../../../../shared/animations/opacityTransitionAnim";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../shared/services/auth-service";
import {Router} from "@angular/router";
import {User} from "../../../../shared/interfaces";

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  animations: [
    trigger('pass', [
      transition(':enter', useAnimation(opacityTransitionAnim, {
        params: {
          transformStart: 'scale(0.8)',
          transformEnd: 'scale(1)',
          timing: '0.5s ease'
        }
      }))
    ])
  ]
})
export class AuthFormComponent implements OnInit {

  form!: FormGroup
  public visible: boolean = false
  errorEmail = false
  errorPass = false

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.email,
        Validators.required
      ]),
      password: new FormControl(null, Validators.required)
    })
  }

  submit() {
    if (this.form.invalid)
      return

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
    }

    this.auth.login(user)
      .subscribe({
        next: () => {
          this.form.reset()
          this.router.navigate(['meeting-room'])
        },
        error: (error) => {
          let message = error.error.error.message

          this.errorEmail = message === 'INVALID_EMAIL' || message === 'EMAIL_NOT_FOUND'
          this.errorPass = message === 'INVALID_PASSWORD' || message === 'EMAIL_NOT_FOUND'
        }
      })
  }

}

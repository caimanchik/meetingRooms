import { Component, OnInit } from '@angular/core';
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacityTransitionAnim} from "../../../../shared/animations/opacityTransitionAnim";
import {AuthService} from "../../../../shared/services/auth-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  animations: [
    trigger('pass', [
      transition(':enter', useAnimation(opacityTransitionAnim, {
        params: {
          transformStart: 'scale(0.9)',
          transformEnd: 'scale(1)',
          timing: '0.5s ease'
        }
      }))
    ])
  ]
})
export class AuthFormComponent implements OnInit {

  public visible: boolean = false
  public code: string = ''
  public link: string = ''

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let sub = this.auth.login().subscribe(value => {
        if (!value.hasToken) {
            this.visible = true
            this.code = value.code
            this.link = value.link
        }
         else {
            this.router.navigate(['meeting-room'])
            sub.unsubscribe()
        }
    })
  }
}

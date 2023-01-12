import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger, useAnimation} from "@angular/animations";
import {opacityTransitionAnim} from "../../../../shared/animations/opacityTransitionAnim";
import {AuthService} from "../../../../shared/services/auth-service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

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
    ]),
    trigger('copy', [
      state('invisible', style({
        transform: 'translateY(100px)'
      })),
      state('visible', style({
        transform: 'translateY(0px)',
        opacity: 1
      })),
      transition('invisible <-> visible', [
        animate('0.3s ease')
      ])
    ]),
    trigger('copyBg', [
      state('dark', style({
        backgroundColor: '#e7e7e7'
      })),
      state('light', style({
        transform: '#F5F5F5',
      })),
      transition('dark <-> light', [
        animate('0.1s ease')
      ])
    ])
  ]
})
export class AuthFormComponent implements OnInit, OnDestroy {
  public visible: boolean = false
  public code: string = ''
  public link: string = ''
  public copied: boolean = false
  public dark: boolean = false

  private t!: NodeJS.Timeout

  private loginSub!: Subscription

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginSub = this.auth.login().subscribe(value => {
        if (!value.hasToken) {
            this.visible = true
            this.code = value.code
            this.link = value.link
        }
         else {
            this.router.navigate(['meeting-room'])
            this.loginSub.unsubscribe()
        }
    })
  }

  copyCode() {
    navigator.clipboard.writeText(this.code)
      .then(() => {
        this.copied = true
        clearTimeout(this.t)
        this.dark = true
        setTimeout(() => this.dark = false, 100)
        this.t = setTimeout(() => this.copied = false, 1500)
      })
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe()
  }
}

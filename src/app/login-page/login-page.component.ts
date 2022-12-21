import { Component, OnInit } from '@angular/core';
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacityTransitionAnim} from "../shared/animations/opacityTransitionAnim";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  animations: [
    trigger('up', [
      transition(
        'void => *',
        useAnimation(opacityTransitionAnim, {
          params: {
            transformStart: 'translateY(5px)',
            transformEnd: 'translateY(0px)',
            timing: '0.5s ease',
          }
        }))
    ])
  ]
})
export class LoginPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

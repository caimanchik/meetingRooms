import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger, useAnimation} from "@angular/animations";
import {opacityTransitionAnim} from "../../animations/opacityTransitionAnim";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('animLeft', [
      transition(
        ':enter',
        useAnimation(opacityTransitionAnim, {
          params: {
            transformStart: 'translateX(-4px)',
            transformEnd: 'translateX(0px)',
            timing: '0.5s ease',
          }
        }))
    ]),
    trigger('animRight', [
      transition(
        ':enter',
        useAnimation(opacityTransitionAnim, {
          params: {
            transformStart: 'translateX(4px)',
            transformEnd: 'translateX(0px)',
            timing: '0.5s ease',
          }
        }))
    ]),
    trigger('animOpacity', [
      transition(
        ':enter',
        useAnimation(opacityTransitionAnim, {
          params: {
            transformStart: '',
            transformEnd: '',
            timing: '0.6s ease',
          }
        }))
    ])
  ]
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}

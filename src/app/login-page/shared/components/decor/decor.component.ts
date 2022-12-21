import { Component, OnInit } from '@angular/core';
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacityTransitionAnim} from "../../../../shared/animations/opacityTransitionAnim";

@Component({
  selector: 'app-decor',
  templateUrl: './decor.component.html',
  styleUrls: ['./decor.component.scss'],
  animations: [
    trigger('left', [
      transition(
        'void => *',
        useAnimation(opacityTransitionAnim, {
        params: {
          transformStart: 'translateX(5px)',
          transformEnd: 'translateX(0px)',
          timing: '0.5s ease',
        }
      }))
    ]),
    trigger('right', [
      transition(
        'void => *',
        useAnimation(opacityTransitionAnim, {
          params: {
            transformStart: 'translateX(-5px)',
            transformEnd: 'translateX(0px)',
            timing: '0.5s ease',
          }
        }))
    ]),
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
export class DecorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

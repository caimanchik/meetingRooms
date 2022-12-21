import {animate, animation, style} from "@angular/animations";

export const opacityTransitionAnim = animation([
  style({
    opacity: 0,
    transform: '{{transformStart}}'
  }),
  animate('{{timing}}', style({
    opacity: 1,
    transform: '{{transformEnd}}'
  }))
])

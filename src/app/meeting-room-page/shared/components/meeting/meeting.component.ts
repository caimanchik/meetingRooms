import {
  OnDestroy,
  Component,
  OnInit,
} from '@angular/core';
import {Meeting} from "../../../../shared/interfaces";
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacityTransitionAnim} from "../../../../shared/animations/opacityTransitionAnim";
import {CalendarService} from "../../services/calendar.service";

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
  animations: [
    trigger('opacity', [
      transition(':enter', useAnimation(opacityTransitionAnim, {
        params: {
          transformStart: '',
          transformEnd: '',
          timing: '.5s ease'
        }
      }))
    ])
  ]
})
export class MeetingComponent implements OnInit, OnDestroy{
  meetings!: Meeting[]
  state!: string
  states: string[] = []
  selected!: number

  constructor(
    private calendarService: CalendarService,
  ) {
    this.calendarService.meetings$.subscribe(m => {
      this.meetings = m
    })
    this.calendarService.meetStates$.subscribe(value => {
      this.states = value
    })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }
}

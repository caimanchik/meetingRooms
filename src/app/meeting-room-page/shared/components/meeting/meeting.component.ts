import {
  OnDestroy,
  Component,
} from '@angular/core';
import {Meeting} from "../../../../shared/interfaces";
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacityTransitionAnim} from "../../../../shared/animations/opacityTransitionAnim";
import {CalendarService} from "../../services/calendar.service";
import {Subscription} from "rxjs";

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
export class MeetingComponent implements OnDestroy{
  public meetings!: Meeting[]
  public states: string[] = []

  private meetingsSub!: Subscription
  private meetingsStatesSub!: Subscription

  constructor(
    private calendarService: CalendarService
  ) {
    this.meetingsSub = this.calendarService.meetings$.subscribe(m => {
      this.meetings = m
    })
    this.meetingsStatesSub = this.calendarService.meetStates$.subscribe(value => {
      this.states = value
    })
  }

  ngOnDestroy(): void {
    this.meetingsSub.unsubscribe()
    this.meetingsStatesSub.unsubscribe()
  }
}

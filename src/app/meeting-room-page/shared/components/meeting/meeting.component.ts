import {
  AfterContentInit,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Meeting} from "../../../../shared/interfaces";
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacityTransitionAnim} from "../../../../shared/animations/opacityTransitionAnim";

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
export class MeetingComponent implements OnInit, OnChanges{
  @Input() meetings!: Meeting[]
  @Input() state!: string
  @Output() onBusy = new EventEmitter<number>()

  states: string[] = []

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.states = this.getStates()
    console.log(this.states)
  }

  private getStates(): string[] {
    let result: string[] = []

    if (this.state === 'previous') {
      this.meetings.forEach(() => {
        result.push('previous')
      })
      return result
    }

    if (this.state === 'future') {
      this.meetings.forEach(() => {
        result.push('future')
      })
      return result
    }

    let now = new Date()
    let startDate = new Date()
    let endDate = new Date()

    this.meetings.forEach((e: Meeting, i) => {
      let hoursStart = parseInt(e.start.substring(0, 2))
      let minStart = parseInt(e.start.substring(3, 5))
      let hoursEnd = parseInt(e.end.substring(0, 2))
      let minEnd = parseInt(e.end.substring(3, 5))

      startDate.setHours(hoursStart)
      startDate.setMinutes(minStart)

      endDate.setHours(hoursEnd)
      endDate.setMinutes(minEnd)

      if (now < startDate)
        result.push('future')
      else if (now > endDate)
        result.push('previous')
      else {
        result.push('now')
        this.onBusy.emit(i)
      }

    })

    return result
  }

}

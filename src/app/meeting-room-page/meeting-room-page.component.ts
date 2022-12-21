import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MeetingService} from "../shared/services/meeting.service";
import {Day, Meeting, Room} from "../shared/interfaces";
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacityTransitionAnim} from "../shared/animations/opacityTransitionAnim";

@Component({
  selector: 'app-meeting-room-page',
  templateUrl: './meeting-room-page.component.html',
  styleUrls: ['./meeting-room-page.component.scss'],
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
export class MeetingRoomPageComponent implements OnInit {

  daysNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
  received = false
  room!: Room
  days: Date[] = []
  meetings: Meeting[] = []
  states: string[] = []
  selected!: number
  busy: boolean = false
  meeting!: Meeting

  constructor(
    private meetService: MeetingService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.meetService.getMeetings()
      .subscribe((room: Room) => {
        this.parseRoom(room)
        this.received = true
      })
  }

  parseRoom(room: Room): void {
    this.room = room
    this.days = this.room.calendar.map((day: Day) => new Date(day.date))
    this.initStates()
  }

  initStates(): void {
    let now = new Date()

    this.meetings = []
    this.selected = 0

    this.room.calendar.forEach((e: Day, i) => {
      let day = new Date(e.date)
      if (now.getDate() == day.getDate()
        && now.getMonth() == day.getMonth()
      ) {
        this.selected = i
        this.meetings = e.meetings
      }
    })

    this.states = this.days.map(e => {
      return this.getState(e, now)
    })
  }

  private getState(current: Date, now: Date): string {

    if (now.getMonth() > current.getMonth())
      return 'previous'

    if (now.getMonth() < current.getMonth()) {
      return 'future'
    }

    if (now.getDate() === current.getDate())
      return 'today'
    else if (now.getDate() > current.getDate())
      return 'previous'
    else
      return 'future'
  }

  changeMeetings(i: number) {
    this.meetings = this.room.calendar[i].meetings
    this.selected = i
  }

  updateRoomState($event: number) {
    this.busy = true
    this.meeting = this.meetings[$event]
    this.cdRef.detectChanges()

  }
}

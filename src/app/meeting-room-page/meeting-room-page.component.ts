import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MeetingService} from "../shared/services/meeting.service";
import {Day, Meeting, Room} from "../shared/interfaces";
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacityTransitionAnim} from "../shared/animations/opacityTransitionAnim";
import {CalendarService} from "./shared/services/calendar.service";
import {Subscription} from "rxjs";

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
export class MeetingRoomPageComponent implements OnInit, OnDestroy {

  daysNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
  received = false
  room!: Room
  days: Date[] = []
  meetings: Meeting[] = []
  states: string[] = []
  selected!: number
  busy: boolean = false
  meeting!: Meeting
  opened = false
  roomSub!: Subscription

  constructor(
    private meetService: MeetingService,
    private cdRef: ChangeDetectorRef,
    private calendarService: CalendarService
  ) {
    this.calendarService.busy$.subscribe(s => this.busy = s)
    this.calendarService.meetingIndex$.subscribe(i => this.meeting = this.meetings[i])
  }

  ngOnInit(): void {
    this.roomSub = this.meetService.getMeetings('orange')
      .subscribe((room: Room) => {
        this.parseRoom(room)
        this.received = true
      })
  }

  private parseRoom(room: Room): void {
    if (this.room != undefined && this.sameRooms(room))
      return

    this.room = room
    this.days = this.room.calendar.map((day: Day) => new Date(day.date))
    this.initStates()
  }

  private sameRooms(room: Room): boolean {
    if (this.room.name !== room.name)
      return false

    let flag = true

    room.calendar.forEach((value, index) => {
      if (value.meetings.length != this.room.calendar[index].meetings.length) {
        flag = false
        return
      }
    })

    return flag
  }

  private initStates(): void {
    let now = new Date()

    this.meetings = []
    this.selected = 0

    this.room.calendar.forEach((e: Day, i) => {
      let day = new Date(e.date)
      if (now.getDate() == day.getDate()
        && now.getMonth() == day.getMonth()
      ) {
        this.selected = i
        this.calendarService.changeMeetings(e.meetings)
        this.meetings = e.meetings
      }
    })

    if (this.selected === 0) {
      this.calendarService.changeMeetings(this.room.calendar[0].meetings)
      this.meetings = this.room.calendar[0].meetings
    }

    this.states = this.days.map(e => {
      return this.getState(e, now)
    })

    this.calendarService.changeState(this.states[this.selected])
  }

  private getState(current: Date, now: Date): string {

    if (now.getFullYear() > current.getFullYear())
      return 'previous'

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
    this.calendarService.changeMeetings(this.room.calendar[i].meetings)
    this.meetings = this.room.calendar[i].meetings
    this.selected = i
    this.calendarService.changeState(this.states[this.selected])
  }

  selectRoom($event: MouseEvent) {
    $event.preventDefault()

    if (!this.opened)
    {
      this.opened = true
      return
    }

    let prev: Element
    let links = document.querySelectorAll('.name__link')
    links.forEach((e) => {
      if (e.classList.contains('selected'))
        prev = e
      if (e !== $event.target) {
        e.classList.remove('selected')
        // @ts-ignore
        e.parentNode.classList.remove('selected')
        return
      }

      e.classList.add('selected')
      // @ts-ignore
      setTimeout(() => e.parentNode.classList.add('selected'), 500)

      if (prev === e)
        return

      this.received = false
      this.states = []
      this.selected = -1

      this.roomSub.unsubscribe()
      // @ts-ignore
      this.roomSub = this.meetService.getMeetings($event.target.id)
        .subscribe(room => {
          this.calendarService.changeBusy(false)
          this.parseRoom(room)
          this.received = true
        })
    })

    this.opened = false
  }

    ngOnDestroy(): void {
      this.roomSub.unsubscribe()
    }
}

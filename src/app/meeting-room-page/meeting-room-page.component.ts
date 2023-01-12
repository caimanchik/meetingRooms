import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MeetingService} from "../shared/services/meeting.service";
import {Day, Meeting, Room, RoomState} from "../shared/interfaces";
import {transition, trigger, useAnimation} from "@angular/animations";
import {opacityTransitionAnim} from "../shared/animations/opacityTransitionAnim";
import {CalendarService} from "./shared/services/calendar.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

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
  meeting!: Meeting
  opened = false
  roomSub!: Subscription
  roomState: RoomState = {occupied: false}

  constructor(
    private meetService: MeetingService,
    private cdRef: ChangeDetectorRef,
    private calendarService: CalendarService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.calendarService.canShow$.subscribe(value => this.received = value)
    this.roomSub = this.meetService.getMeetings('orange')
      .subscribe({
        next: (room: Room) => {
          this.calendarService.changeRoom(room)
          this.parseRoom2(room)
        },
        error: () => {
          this.router.navigate([''])
        }
      })

    this.calendarService.dateStates$.subscribe(states => {
      this.states = states
    })
    this.calendarService.dates$.subscribe(value => this.days = value)
    this.calendarService.roomState$.subscribe(value => this.roomState = value)

    document.addEventListener('click', () => {
      this.opened = false
    })
  }

  private parseRoom2(room: Room): void {
    if (this.room != undefined) {
      if (this.room.name !== room.name)
        this.selected = 0
      else if (!this.sameMeets(room))
        return
    } else
      this.selected = 0

    this.room = room

    let now = new Date()

    this.room.calendar.forEach((e: Day, i) => {
      let day = new Date(e.date)
      if (now.getDate() == day.getDate()
        && now.getMonth() == day.getMonth()
        && now.getFullYear() == day.getFullYear()
      ) {
        this.selected = i
      }
    })

    this.calendarService.changeSelected(this.selected)
  }

  private sameMeets(room: Room): boolean {
    let flag = true

    room.calendar.forEach((value, index) => {
      let nowMeets = this.room.calendar[index].meetings
      if (!flag)
        return
      value.meetings.forEach((e, j) => {
        if (!flag)
          return

        if (
          !(e.start === nowMeets[j].start
          && e.start === nowMeets[j].end
          && e.phone === nowMeets[j].phone
          && e.name === nowMeets[j].name)
        )
          flag = false
      })
    })

    return flag
  }

  changeMeetings(i: number) {
    this.selected = i
    this.calendarService.changeSelected(i)
  }

  selectRoom($event: MouseEvent) {
    $event.preventDefault()
    $event.stopPropagation()

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
      this.calendarService.changeMeetings([])

      this.roomSub.unsubscribe()
      // @ts-ignore
      this.roomSub = this.meetService.getMeetings($event.target.id)
        .subscribe({
          next: room => {
            this.calendarService.changeRoom(room)
            this.parseRoom2(room)
          },
          error: () => {
            this.router.navigate([''])
          }
        }
    )
    })

    this.opened = false
  }

    ngOnDestroy(): void {
      this.roomSub.unsubscribe()
    }
}

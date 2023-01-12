import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Day, Meeting, Room, RoomState} from "../../../shared/interfaces";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  meetings$ = new Subject<Meeting[]>()
  dateStates$: Subject<string[]> = new Subject<string[]>()
  dates$: Subject<Date[]> = new Subject<Date[]>()
  canShow$: Subject<boolean> = new Subject<boolean>()
  meetStates$: Subject<string[]> = new Subject<string[]>()
  roomState$: Subject<RoomState> = new Subject<RoomState>()

  statesInt!: NodeJS.Timer
  update!: Observable<any>
  selected: number = -1

  private room!: Room
  private dates!: Date[]

  constructor() {
    this.dates$.subscribe(value => this.dates = value)
  }

  changeMeetings(meetings: Meeting[]) {
    this.meetings$.next(meetings)
  }

  changeRoom(room: Room) {
    this.room = room
    this.dates$.next(this.room.calendar.map((day: Day) => new Date(day.date)))
    this.roomState$.next({occupied: false})
    this.updateStates()
    clearInterval(this.statesInt)
    this.statesInt = setInterval(() => this.updateStates(), 2000)
  }

  private updateStates() {
    let now = new Date()

    let dateStates = this.dates.map(e => {
      return this.getState(e, now)
    })

    this.dateStates$.next(dateStates)

    let startDate = new Date()
    let endDate = new Date()
    this.room.calendar.forEach((day, i) => {
      if (dateStates[i] === 'previous' || dateStates[i] === 'future') {
        if (i === this.selected) {
          let a = []
          for (let j = 0; j < day.meetings.length; j++)
            a.push(dateStates[i])
          this.meetStates$.next(a)
        }
        return
      }

      let result: string[] = []
      let roomState: RoomState = {occupied: false}

      day.meetings.forEach((e) => {
        let hoursStart = parseInt(e.start.substring(0, 2))
        let minStart = parseInt(e.start.substring(3, 5))
        let hoursEnd = parseInt(e.end.substring(0, 2))
        let minEnd = parseInt(e.end.substring(3, 5))

        startDate.setHours(hoursStart)
        startDate.setMinutes(minStart)

        endDate.setHours(hoursEnd)
        endDate.setMinutes(minEnd)

        endDate = new Date(endDate.getTime() - 1000 * 60)

        if (now < startDate) {
          result.push('future')
        }
        else if (now > endDate) {
          result.push('previous')
        }
        else {
          result.push('now')
          roomState = {
            occupied: true,
            name: e.name,
            start: e.start,
            end: e.end,
            phone: e.phone
          }
        }
      })

      this.roomState$.next(roomState)
      if (i === this.selected)
        this.meetStates$.next(result)
    })
  }

  changeSelected(i: number) {
    this.meetings$.next(this.room.calendar[i].meetings)
    this.selected = i
    this.updateStates()
    this.canShow$.next(true)
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
}

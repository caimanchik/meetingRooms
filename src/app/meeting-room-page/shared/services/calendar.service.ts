import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {Meeting} from "../../../shared/interfaces";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  meetings$ = new Subject<Meeting[]>()
  state$ = new Subject<string>()
  busy$ = new Subject<boolean>()
  meetingIndex$ = new Subject<number>()

  constructor() { }

  changeMeetings(meetings: Meeting[]) {
    this.meetings$.next(meetings)
  }

  changeState(state: string) {
    this.state$.next(state)
  }

  changeBusy(busy: boolean) {
    this.busy$.next(busy)
  }

  changeMeeting(i: number) {
    this.meetingIndex$.next(i)
  }
}

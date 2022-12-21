import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {delay, Observable} from "rxjs";
import {Room} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  constructor(
    private http: HttpClient
  ) { }

  getMeetings(roomName: string): Observable<Room> {
    return this.http.get<Room>(`${environment.fbUrl}/${roomName}.json`)
      .pipe(
        // delay(2000)
      )
  }
}

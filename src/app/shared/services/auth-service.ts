import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Login} from "../interfaces";
import {Observable, repeat} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }

  login(): Observable<Login> {
    return this.http.get<Login>(`${environment.djangoUrl}login/`)
        .pipe(
            repeat({delay: 2000})
        )
  }
}

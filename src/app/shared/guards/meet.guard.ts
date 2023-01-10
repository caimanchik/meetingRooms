import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable} from 'rxjs';
import {AuthService} from "../services/auth-service";

@Injectable({
  providedIn: 'root'
})
export class MeetGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private router: Router
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.auth.login()
            .pipe(
                map(value => {
                    if (!value.hasToken)
                        this.router.navigate([''])

                    return value.hasToken
                })
        )
    }
  
}

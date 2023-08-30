import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable, map, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PublicGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    private checkAuthStatus(): Observable<boolean> | boolean {
        return this.authService.checkAuthentication().pipe(
            tap(isAuthenticated => console.log(isAuthenticated)),
            tap(isAuthenticated => {
                if (isAuthenticated) {
                    this.router.navigate(['./'])
                }
            }),
            map(isAuthenticated => !isAuthenticated)

        )

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.checkAuthStatus()
    }

    canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
        return this.checkAuthStatus()
    }

}
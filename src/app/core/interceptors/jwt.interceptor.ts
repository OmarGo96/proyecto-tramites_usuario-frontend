import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {UsersService} from "../../services/users.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private usersService: UsersService,
        private router: Router
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.usersService.getToken();

        if (!token){
            return next.handle(req);
        }

        const headers = req.clone({
            headers: req.headers.set('Authorization', `${token}`)
        });

        return next.handle(headers).pipe(tap((value: HttpEvent<any>) => {
        }), catchError((err: HttpErrorResponse) => {
            if (err.status === 403 && this.router.routerState.snapshot.url !== '/login') {
                this.usersService.logout();
            } else if (err.status === 401) {
                this.usersService.logout();
            }
            return throwError(err);
        }));
    }
}

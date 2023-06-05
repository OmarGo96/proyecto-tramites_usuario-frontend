import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Router} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    public token: any;

    constructor(
        private router: Router
    ) {

    }

    canActivate() {
        return this.checkToken();
    }

    canActivateChild() {
        return this.checkToken();
    }

    private checkToken() {
        this.token = sessionStorage.getItem('token');

        if (this.token === null) {
            this.router.navigate(['login']);
            return false;
        } else {
            return true;
        }
    }
}

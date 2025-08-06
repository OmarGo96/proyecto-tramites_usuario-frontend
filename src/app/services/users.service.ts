import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    public urlApi: string = environment.urlApi;
    public headers = new HttpHeaders().set('Content-Type', 'application/json');
    public token: any;

    constructor(
        private httpClient: HttpClient,
        private router: Router
    ) {
        this.token = this.getToken();
        this.headers = new HttpHeaders().set('Authorization', this.token);
    }

    public register(data: any): Observable<any> {
        return this.httpClient.post(`${this.urlApi}/contribuyente`, data);
    }

    public login(data: any): Observable<any> {
        return this.httpClient.post(`${this.urlApi}/session/contribuyente`, data);
    }

    public getContribuyente(token: any): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.httpClient.get(`${this.urlApi}/contribuyente`, {headers});
    }

    public updateRecord(uuid: any, data: any): Observable<any> {
        return this.httpClient.put(`${this.urlApi}/contribuyente/${uuid}`, data, {headers: this.headers});
    }

    public deleteRecord(uuid: any): Observable<any> {
        return this.httpClient.delete(`${this.urlApi}/contribuyente/${uuid}`, {headers: this.headers});
    }

    public activarCuenta(codigo: any) {
        return this.httpClient.get(`${this.urlApi}/activar_cuenta/${codigo}`);
    }

    public requestRestorePassword(contribuyente: any): Observable<any> {
        return this.httpClient.post(`${this.urlApi}/solicitud_restauracion`, contribuyente);
    }

    public restorePassword(data: any): Observable<any> {
        return this.httpClient.post(`${this.urlApi}/restaurar_cuenta`, data);
    }

    public resendActivationLink(data: any): Observable<any> {
        return this.httpClient.post(`${this.urlApi}/reenvio_activacion`, data);
    }

    public changeInformation(contribuyenteUuid: string, data: any): Observable<any> {
        return this.httpClient.put(`${this.urlApi}/contribuyente/completar_informacion/${contribuyenteUuid}`, data, {headers: this.headers});
    }

    public getToken() {
        let token: any;
        const tokenFromSessionStorage = sessionStorage.getItem('token');

        if (tokenFromSessionStorage !== null) {
            token = tokenFromSessionStorage;
        } else {
            token = false;
        }

        return token;
    }

    public getIdentity() {
        let identity: any;
        const identityFromSessionStorage = sessionStorage.getItem('identity');

        if (identityFromSessionStorage !== null) {
            identity = JSON.parse(identityFromSessionStorage);
        } else {
            identity = false;
        }

        return identity;
    }

    public getRol() {
        let rol: any;
        const rolFromSessionStorage = localStorage.getItem('rol');

        if (rolFromSessionStorage !== null) {
            rol = rolFromSessionStorage;
        } else {
            rol = false;
        }

        return rol;
    }

    logout() {
        sessionStorage.clear();
        this.router.navigate(['login']);
    }
}

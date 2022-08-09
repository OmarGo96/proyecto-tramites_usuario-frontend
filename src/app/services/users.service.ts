import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    public urlApi: string = environment.urlApi;
    public headers = new HttpHeaders().set('Content-Type', 'application/json');
    public token: any;

    constructor(
        private httpClient: HttpClient
    ) {
        this.token = this.getToken();
        this.headers = new HttpHeaders().set('Authorization', this.token);
    }

    public register(data: any): Observable<any> {
        return this.httpClient.post(`${this.urlApi}/contribuyentes`, data);
    }

    public login(data: any): Observable<any> {
        return this.httpClient.post(`${this.urlApi}/session/contribuyente`, data);
    }

    public getContribuyente(token: any): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.httpClient.get(`${this.urlApi}/contribuyentes`, {headers});
    }

    public updateRecord(uuid: any, data: any): Observable<any> {
        return this.httpClient.put(`${this.urlApi}/contribuyentes/${uuid}`, data, {headers: this.headers});
    }

    public deleteRecord(uuid: any): Observable<any> {
        return this.httpClient.get(`${this.urlApi}/contribuyentes/${uuid}`, {headers: this.headers});
    }

    public activarCuenta(codigo: any) {
        return this.httpClient.get(`${this.urlApi}/activar_cuenta/${codigo}`);
    }

    public requestRestorePassword(contribuyente: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/solicitud_restauracion`, contribuyente);
    }

    public restorePassword(data: any): Observable <any>{
        return this.httpClient.post(`${this.urlApi}/restaurar_cuenta`, data);
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
}

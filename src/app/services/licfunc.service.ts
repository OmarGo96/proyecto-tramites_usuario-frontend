import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {UsersService} from "./users.service";

@Injectable({
    providedIn: 'root'
})
export class LicfuncService {
    public urlApi: string = environment.urlApi;
    public headers: any;
    public token: any;
    constructor(
        private httpClient: HttpClient,
        private usersService: UsersService
    ) {
        this.token = this.usersService.getToken();
        this.headers = new HttpHeaders().set('Authorization', this.token);
    }

    public getRecords(): Observable<any> {
        return this.httpClient.get(`${this.urlApi}/licencia-funcionamiento`, {headers: this.headers});
    }

    public createRecords(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/licencia-funcionamiento`, data, { headers: this.headers });
    }

    public getEstadoCuenta(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/licencia-funcionamiento-estado-de-cuenta`, data, { headers: this.headers});
    }

    public generarPaseCaja(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/licencia-pase-caja`, data, { headers: this.headers });
    }

    public realizarPago(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/licencia-pago-en-linea`, data, { headers: this.headers });
    }

    public generarLicencia(constanciaUuid: string): Observable <any> {
        return this.httpClient.get(`${this.urlApi}/licencia-funcionamiento/constancia/${constanciaUuid}`, {headers: this.headers,  responseType: 'blob' });
    }

    public validarLicencia(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/licencia-funcionamiento/check`, data, { headers: this.headers });
    }
}

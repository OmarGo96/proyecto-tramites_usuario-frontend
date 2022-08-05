import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {UsersService} from "./users.service";

@Injectable({
    providedIn: 'root'
})
export class PredialService {

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
        return this.httpClient.get(`${this.urlApi}/claves`, {headers: this.headers});
    }

    public createRecords(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/claves`, data, { headers: this.headers });
    }

    public getEstadoCuenta(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/estado_cuenta`, data, { headers: this.headers});
    }

    public deleteClave(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/deslindar_clave`, data, { headers: this.headers });
    }

    public generarPaseCaja(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/pase_caja`, data, { headers: this.headers });
    }

    public realizarPago(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/pago_banco`, data, { headers: this.headers });
    }
}

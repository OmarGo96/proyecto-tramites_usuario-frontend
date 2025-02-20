import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {UsersService} from "./users.service";

@Injectable({
    providedIn: 'root'
})
export class RequestService {

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

    public getRecords(): Observable <any> {
        return this.httpClient.get(`${this.urlApi}/solicitudes`, {headers: this.headers});
    }

    public getRecord(id: any): Observable <any> {
        return this.httpClient.get(`${this.urlApi}/solicitud/${id}`, {headers: this.headers});
    }

    public createRecords(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/solicitudes`, data, { headers: this.headers });
    }

    public createPredialRequest(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/solicitud-predial`, data, { headers: this.headers });
    }

    public updateRecord(data: any, solicitudId: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/cambiar_solicitud_estatus/${solicitudId}`, data, { headers: this.headers });
    }

    public getHistory(id: any): Observable <any> {
        return this.httpClient.get(`${this.urlApi}/solicitud/history/${id}`, {headers: this.headers});
    }

    public getMessages(id: any): Observable <any> {
        return this.httpClient.get(`${this.urlApi}/solicitud/messages/${id}`, {headers: this.headers});
    }

    public generateCheckout(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/solicitud/pase_caja`, data, { headers: this.headers });
    }

    public obtenerPaseCaja(requestId: any): Observable <any> {
        return this.httpClient.get(`${this.urlApi}/solicitud/pase-caja/${requestId}`, { headers: this.headers, responseType: "blob"});
    }

    public paymentLink(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/solicitud/pago_online`, data, { headers: this.headers });
    }

    public validatePaoRenew(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/solicitud/check-expediente-pao`, data, { headers: this.headers });
    }

    public addExpedienteInfo(data: any): Observable <any> {
        return this.httpClient.post(`${this.urlApi}/solicitud/add-expediente-information`, data, { headers: this.headers });
    }
}

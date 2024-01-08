import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {UsersService} from "./users.service";

@Injectable({
    providedIn: 'root'
})
export class DocumentsService {
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

    public createRecord(data: any): Observable<any> {
        return this.httpClient.post(`${this.urlApi}/documentacion`, data, {headers: this.headers})
    }

    public deleteDocument(documentId: any,): Observable<any> {
        const data ={
            id: ''
        }
        return this.httpClient.post(`${this.urlApi}/documentacion/${documentId}`, data,{headers: this.headers})
    }

    public getRecords(): Observable <any> {
        return this.httpClient.get(`${this.urlApi}/documentacion`, {headers: this.headers});
    }

    public getExpedienteUnico(uuid: any): Observable <any> {
        return this.httpClient.get(`${this.urlApi}/documentacion/expediente/${uuid}`, {headers: this.headers});
    }

    public getDocument(uuid: any): Observable<any> {
        return this.httpClient.get(`${this.urlApi}/documento_servicios/${uuid}`, { responseType: 'blob' });
    }

    public getUserDocument(id: any): Observable<any> {
        return this.httpClient.get(`${this.urlApi}/archivo_documentacion/${id}`, { responseType: 'blob' });
    }

    public createDocumentoSolicitud(data: any): Observable<any>{
        return this.httpClient.post(`${this.urlApi}/documentos-solcicitud`, data, {headers: this.headers})
    }

    public deleteDocumentoSolicitud(documentacionId: any): Observable<any>{
        return this.httpClient.put(`${this.urlApi}/eliminar-documentacion/${documentacionId}`,null,{headers: this.headers})
    }

    public createDocumentoPago(data: any): Observable<any>{
        return this.httpClient.post(`${this.urlApi}/documentacion-pago`, data, {headers: this.headers})
    }

    public createDocumentoAnuencia(data: any): Observable<any>{
        return this.httpClient.post(`${this.urlApi}/documento-anuencia`, data, {headers: this.headers})
    }

    public createDocumentoGiro(data: any): Observable<any>{
        return this.httpClient.post(`${this.urlApi}/documento-licencia-comercial`, data, {headers: this.headers})
    }

    public deleteDocumentoAnuencia(documentacionId: any): Observable<any>{
        return this.httpClient.put(`${this.urlApi}/eliminar-documentacion-anuencia/${documentacionId}`,null,{headers: this.headers})
    }

    public deleteDocumentoGiro(documentacionId: any): Observable<any>{
        return this.httpClient.put(`${this.urlApi}/eliminar-documentacion-licencia-comercial/${documentacionId}`,null,{headers: this.headers})
    }

    public createComplementaryDocument(data: any): Observable<any>{
        return this.httpClient.post(`${this.urlApi}/documento-complementaria`, data, {headers: this.headers})
    }

    public deleteComplementaryDocument(documentacionId: any): Observable<any>{
        return this.httpClient.put(`${this.urlApi}/eliminar-documento-complementario/${documentacionId}`,null,{headers: this.headers})
    }

    public updateDocumentoPago(data: any, documentId: any): Observable<any>{
        return this.httpClient.put(`${this.urlApi}/documentacion-pago/${documentId}`, data, {headers: this.headers})
    }

    public deleteDocumentoPago(documentacionId: any): Observable<any>{
        return this.httpClient.put(`${this.urlApi}/eliminar_documentacion_pago/${documentacionId}`,null,{headers: this.headers})
    }

    public updateDocumentoAnuencia(data: any, documentId: any): Observable<any>{
        return this.httpClient.put(`${this.urlApi}/documento-anuencia/${documentId}`, data, {headers: this.headers})
    }

    public updateDocumentoGiro(data: any, documentId: any): Observable<any>{
        return this.httpClient.put(`${this.urlApi}/documento-licencia-comercial/${documentId}`, data, {headers: this.headers})
    }

    public updateDocumentoComplementario(data: any, documentId: any): Observable<any>{
        return this.httpClient.put(`${this.urlApi}/documento-complementaria/${documentId}`, data, {headers: this.headers})
    }

    public deleteDocumentoComplementario(documentacionId: any): Observable<any>{
        return this.httpClient.put(`${this.urlApi}/eliminar-documento-complementario/${documentacionId}`,null,{headers: this.headers})
    }

    public updateDocumentSolicitudRequisito(id: any, data: any): Observable<any>{
        return this.httpClient.put(`${this.urlApi}/documentos-solicitud-requisito/${id}`, data, {headers: this.headers})
    }



    public getRequestDocument(requestId: any): Observable<any> {
        return this.httpClient.get(`${this.urlApi}/solicitud/documento-digital/${requestId}'`, { headers: this.headers, responseType: "blob" });
    }

    public anuenciaDocument(requestId: any, data: any): Observable<any> {
        return this.httpClient.post(`${this.urlApi}/solicitud/documento-anuencia/${requestId}`, data, {headers: this.headers})
    }


}

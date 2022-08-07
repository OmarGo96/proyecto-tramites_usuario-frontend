import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {UsersService} from "./users.service";


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
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

    public getServices(uuid: any): Observable <any> {
        return this.httpClient.get(`${this.urlApi}/servicios/${uuid}`);
    }

    public getRecord(uuid: any): Observable<any> {
        return this.httpClient.get(`${this.urlApi}/servicio/${uuid}`);
    }

    public getPublicServices(): Observable <any> {
        return this.httpClient.get(`${this.urlApi}/servicios`);
    }
}

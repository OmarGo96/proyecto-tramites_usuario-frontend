import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {UsersService} from "./users.service";

@Injectable({
    providedIn: 'root'
})
export class RequirementsService {
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

    public getRecords(serviceUuid: any): Observable <any> {
        return this.httpClient.get(`${this.urlApi}/requerimientos/${serviceUuid}`);
    }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class UserService {
    apiUrl: string = environment.apiUrl;

    constructor(private httpClient: HttpClient) {

    }

    getUsersList(): Observable<any> {
        return this.httpClient.get<any>(this.apiUrl + '/auth/users-list');
    }
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ParamsLogin } from "./login.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class LoginService {
    apiUrl: string = environment.apiUrl;
    private dataLogged = new BehaviorSubject<any>(false);
    currentData = this.dataLogged.asObservable();

    constructor(
        private httpClient: HttpClient
    ) { }

    onLogged(data: boolean) {
        this.dataLogged.next(data);
    }

    /**
     * Login
     * @param params 
     * @returns 
     */
    login(params: ParamsLogin): Promise<any> {
        return this.to(this.httpClient.post<any>(this.apiUrl + '/auth/login', params));
    }

    fetchUser(): Observable<any> {
        return this.httpClient.get<any>(this.apiUrl + '/auth/fetch-user');
    }

    /**
     * 
     * @param obs Http Observable 
     * @returns Promise<any>
     */
    to(obs: Observable<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            const subscriber: any = obs.subscribe(
                complete => resolve(this.handleData(complete)),
                error => reject(error),
                () => subscriber.unsubscribe()
            );
        });
    }

    /**
    * Handle data from response
    * @param data Http Response
    */
    private handleData(data: any) {
        return data;
    }
}
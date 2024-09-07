import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class MenuService {
    apiUrl: string = environment.apiUrl;

    constructor(
        private httpClient: HttpClient
    ) { }

    logout(params: any): Observable<any> {
        return this.httpClient.post<any>(this.apiUrl + '/auth/logout', params);
    }


    // to(obs: Observable<any>): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         const subcribers: any = obs.subscribe(
    //             complete => resolve(this.handleData(complete)),
    //             error => reject(error),
    //             () => subcribers.unsubscribe()
    //         )
    //     })
    // }

    // handleData(data: any) {
    //     return data;
    // }
}
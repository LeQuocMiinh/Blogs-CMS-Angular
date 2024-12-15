import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ParamGetDataViewsByPostId, ParamGetPostMostViews } from "./dashboard.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DashboardService {
    apiUrl: string = environment.apiUrl;

    constructor(
        private httpClient: HttpClient
    ) {

    }

    /**
     * Lấy các bài viết có nhiều lượt xem nhất
     * @param params 
     */
    getPostsMostViews(params: ParamGetPostMostViews) {
        return this.to(this.httpClient.post<any>(this.apiUrl + '/posts/get-recent-posts', params));
    }

    /**
     * Lấy dữ liệu lượt xem theo ID bài viết
     * @param params 
     * @returns 
     */
    getDataViewsByPostId(params: ParamGetDataViewsByPostId) {
        return this.to(this.httpClient.post<any>(this.apiUrl + '/posts/get-views', params));
    }

    getStorageMedia() {
        return this.to(this.httpClient.get<any>(this.apiUrl + '/media/get-caculator-storage'));
    }


    /**
     * Chuyển đổi observable sang promise 
     * @param obs 
     * @returns 
     */
    to(obs: Observable<any>) {
        return new Promise((resolve, reject) => {
            const subscriber: any = obs.subscribe(
                complete => resolve(this.handleData(complete)),
                error => reject(error),
                () => subscriber.unsubscribe()
            )
        })
    }

    handleData(data: any) {
        return data;
    }
}
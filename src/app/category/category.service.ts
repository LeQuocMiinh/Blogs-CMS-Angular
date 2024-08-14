import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ParamCreateCategory } from "./category.model";


@Injectable({
    providedIn: 'root'
})

export class CategoryService {
    apiUrl: string = environment.apiUrl;

    constructor(
        private httpClient: HttpClient
    ) {
    }

    getAllCategories() {
        return this.to(this.httpClient.get<any>(this.apiUrl + '/category/get-all'));
    }

    getDetailCategory(id: any) {
        return this.to(this.httpClient.get<any>(this.apiUrl + `/category/get-detail/${id}`));
    }

    createCategory(params: FormData) {
        return this.to(this.httpClient.post<any>(this.apiUrl + '/category/create', params));
    }

    trashCategories(ids: Array<any>) {
        return this.to(this.httpClient.put<any>(this.apiUrl + '/category/trash/' + ids.join(), {}));
    }

    restoreCategories(ids: Array<any>) {
        return this.to(this.httpClient.put<any>(this.apiUrl + '/category/restore/' + ids.join(), {}));
    }

    deleteCategories(ids: Array<any>) {
        return this.to(this.httpClient.delete<any>(this.apiUrl + '/category/delete/' + ids.join()));
    }

    to(obs: Observable<any>): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            const subscriber: any = obs.subscribe(
                complete => resolve(this.handleData(complete)),
                error => reject(error),
                () => subscriber.unsubscribe()
            )
        })
    }

    private handleData(data: any) {
        return data;
    }
}
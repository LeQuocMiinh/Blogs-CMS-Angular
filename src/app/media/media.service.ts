import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FileUpload } from "primeng/fileupload";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class MediaService {
    apiUrl: string = environment.apiUrl;
    constructor(
        private httpClient: HttpClient
    ) {

    }

    getAllMedia() {
        return this.to(this.httpClient.get<any>(this.apiUrl + '/media/get-all'));
    }

    uploadMedia(files: FormData) {
        return this.to(this.httpClient.post<any>(this.apiUrl + '/media/upload', files));
    }

    deletedMedia(ids: Array<any>) {
        return this.to(this.httpClient.delete<any>(this.apiUrl + `/media/delete/` + ids.join()));
    }

    /**
    * Chuyển đổi Observable sang Promise
    * @param obs 
    * @returns 
    */
    to(obs: Observable<any>): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            const subscriber: any = obs.subscribe(
                complete => resolve(this.handleData(complete)),
                error => reject(error),
                () => subscriber.unsubscribe()
            )
        })
    }

    /**
     * Xử lý dữ liệu
     * @param data 
     * @returns 
     */
    private handleData(data: any) {
        return data;
    }
}
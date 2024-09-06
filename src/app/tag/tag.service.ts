import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ParamCreateTag } from "./tag.model";

@Injectable({
    providedIn: 'root'
})

export class TagService {
    apiUrl: string = environment.apiUrl;

    constructor(
        private httpClient: HttpClient
    ) {
    }

    /**
     * Lấy tất cả danh mục
     * @returns 
     */
    getAllTags() {
        return this.to(this.httpClient.get<any>(this.apiUrl + '/tag/get-all'));
    }

    /**
     * Lấy chi tiết danh mục
     * @param id 
     * @returns 
     */
    getDetailTag(id: any) {
        return this.to(this.httpClient.get<any>(this.apiUrl + `/tag/get-detail/${id}`));
    }

    /**
     * Tạo danh mục
     * @param params 
     * @returns 
     */
    createTag(params: ParamCreateTag) {
        return this.to(this.httpClient.post<any>(this.apiUrl + '/tag/create', params));
    }

    /**
     * Cập nhật danh mục
     * @param id 
     * @param params 
     * @returns 
     */
    updateTag(id: number, params: ParamCreateTag) {
        return this.to(this.httpClient.put<any>(this.apiUrl + `/tag/update/${id}`, params));
    }

    /**
     * Chuyển vào thùng rác
     * @param ids 
     * @returns 
     */
    trashTags(ids: Array<any>) {
        return this.to(this.httpClient.put<any>(this.apiUrl + '/tag/trash/' + ids.join(), {}));
    }

    /**
     * Khôi phục danh mục từ thùng rác
     * @param ids 
     * @returns 
     */
    restoreTags(ids: Array<any>) {
        return this.to(this.httpClient.put<any>(this.apiUrl + '/tag/restore/' + ids.join(), {}));
    }

    /**
     * Xóa vĩnh viễn danh mục
     * @param ids 
     * @returns 
     */
    deleteTags(ids: Array<any>) {
        return this.to(this.httpClient.delete<any>(this.apiUrl + '/tag/delete/' + ids.join()));
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
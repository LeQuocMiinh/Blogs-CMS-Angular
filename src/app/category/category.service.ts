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

    /**
     * Lấy tất cả danh mục
     * @returns 
     */
    getAllCategories(params: any) {
        return this.to(this.httpClient.post<any>(this.apiUrl + '/category/get-all', params));
    }

    /**
     * Lấy chi tiết danh mục
     * @param id 
     * @returns 
     */
    getDetailCategory(id: any) {
        return this.to(this.httpClient.get<any>(this.apiUrl + `/category/get-detail/${id}`));
    }

    /**
     * Tạo danh mục
     * @param params 
     * @returns 
     */
    createCategory(params: ParamCreateCategory) {
        return this.to(this.httpClient.post<any>(this.apiUrl + '/category/create', params));
    }

    /**
     * Cập nhật danh mục
     * @param id 
     * @param params 
     * @returns 
     */
    updateCategory(id: number, params: ParamCreateCategory) {
        return this.to(this.httpClient.put<any>(this.apiUrl + `/category/update/${id}`, params));
    }

    /**
     * Chuyển vào thùng rác
     * @param ids 
     * @returns 
     */
    trashCategories(ids: Array<any>) {
        return this.to(this.httpClient.put<any>(this.apiUrl + '/category/trash/' + ids.join(), {}));
    }

    /**
     * Khôi phục danh mục từ thùng rác
     * @param ids 
     * @returns 
     */
    restoreCategories(ids: Array<any>) {
        return this.to(this.httpClient.put<any>(this.apiUrl + '/category/restore/' + ids.join(), {}));
    }

    /**
     * Xóa vĩnh viễn danh mục
     * @param ids 
     * @returns 
     */
    deleteCategories(ids: Array<any>) {
        return this.to(this.httpClient.delete<any>(this.apiUrl + '/category/delete/' + ids.join()));
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
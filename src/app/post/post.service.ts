import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ParamCreatePost } from "./post.model";

@Injectable({
    providedIn: 'root'
})

export class PostService {
    apiUrl: string = environment.apiUrl;

    constructor(
        private httpClient: HttpClient
    ) {

    }

    getAllPosts(params: any) {
        return this.to(this.httpClient.post<any>(this.apiUrl + '/posts/get-posts-by-filter', params));
    }

    getPostDetails(id: string) {
        return this.to(this.httpClient.get<any>(this.apiUrl + `/posts/get-detail/${id}`));
    }

    /**
     * Tạo danh mục
     * @param params 
     * @returns 
     */
    createPost(params: ParamCreatePost) {
        return this.to(this.httpClient.post<any>(this.apiUrl + '/posts/create', params));
    }

    /**
     * Cập nhật danh mục
     * @param id 
     * @param params 
     * @returns 
     */
    updatePost(id: string, params: ParamCreatePost) {
        return this.to(this.httpClient.put<any>(this.apiUrl + `/posts/update/${id}`, params));
    }

    /**
     * Chuyển vào thùng rác
     * @param ids 
     * @returns 
     */
    trashPosts(ids: Array<any>) {
        return this.to(this.httpClient.put<any>(this.apiUrl + '/posts/trash/' + ids.join(), {}));
    }

    /**
     * Khôi phục danh mục từ thùng rác
     * @param ids 
     * @returns 
     */
    restorePosts(ids: Array<any>) {
        return this.to(this.httpClient.put<any>(this.apiUrl + '/posts/restore/' + ids.join(), {}));
    }

    /**
     * Xóa vĩnh viễn danh mục
     * @param ids 
     * @returns 
     */
    deletePosts(ids: Array<any>) {
        return this.to(this.httpClient.delete<any>(this.apiUrl + '/posts/delete/' + ids.join()));
    }


    to(obs: Observable<any>) {
        return new Promise((resolve: any, reject: any) => {
            const subscribe: any = obs.subscribe(
                complete => resolve(this.handleData(complete)),
                error => reject(error),
                () => subscribe.unsubscribe()
            );
        }
        )
    }

    handleData(data: any) {
        return data;
    }
}

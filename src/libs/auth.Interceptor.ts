import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppStorage } from './storage';

@Injectable({
    providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {
    storage: AppStorage = new AppStorage();

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.storage.getItem('access_token');
        if (authToken) {
            const authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${authToken}`)
            })
            return next.handle(authReq);
        }
        return next.handle(req)
    }
}
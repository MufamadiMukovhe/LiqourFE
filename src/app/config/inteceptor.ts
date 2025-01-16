import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { HelperService } from '../service/helper';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    constructor(private helper:HelperService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get("skip")) { return next.handle(req); }
        let token = this.helper.getToken();
        if (Object.keys(token).length > 0) {
            token = token.replace(/"/g, "");
        }
        let request = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
            return throwError(error);
        }));
    }
}
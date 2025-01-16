import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, tap, throwError } from "rxjs";
import { headers, headersSecure } from "../../config/constants";
import { _Case, Outlet, Outlets } from "../../model/model";
import { CacheService } from "./cache.service";
import { environment } from "src/environments/environment.prod";


@Injectable({ providedIn: 'root' })
export class OutletService {
    private apiUrl = environment.eclbDomain+"api/outlet";
    constructor(private httpClient: HttpClient, private cacheService: CacheService) { }

    public getOutlets(): Observable<Outlets[]> {
        const cacheKey = `outlets`;
        const cachedData = this.cacheService.get(cacheKey);

        if (cachedData) {
            return new Observable(observer => {
                observer.next(cachedData);
                observer.complete();
            });
        } else {
            return this.httpClient.get<Outlets[]>(this.apiUrl + "/get-outlets", { headers: headersSecure }).pipe(
                tap(data => {
                    this.cacheService.set(cacheKey, data);
                }),
                catchError(error => {
                    return throwError(() => error);
                })
            );
        } 
    }

    
}
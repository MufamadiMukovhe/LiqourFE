import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, throwError } from "rxjs";
import { headersSecure } from "../../config/constants";
import { ReusableRecommend } from "../../model/model";
import { environment } from "src/environments/environment.prod";

@Injectable({ providedIn: 'root' })
export class AppointManagerService {

    private apiUrl =environment.eclbDomain+"api/appointmanager";
    constructor(private httpClient: HttpClient) { }

    private refreshrequired = new Subject<void>();
    get RefreshRequired() { return this.refreshrequired; }

    public saveManagerAppointment(outletId:any,formData:FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/save-appoint-manager/${outletId}`,formData).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public outletInfomation(outletId:any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-outlet-information/${outletId}`).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public outletInfomationByCaseId(caseId:any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-outlet-information-caseid/${caseId}`).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }


    public updateManagerAppointment(id:any,formData:FormData): Observable<any> {
        return this.httpClient.put<any>(`${this.apiUrl}/update-appoint-manager/${id}`,formData).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getManagerAppointment(caseId:any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-appoint-manager/${caseId}`,{headers:headersSecure}).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public verifyManagerAppointment(outletId:any,recommend:ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/verify-manager-appointment/${outletId}`,recommend,{headers:headersSecure}).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public approveManagerAppointment(outletId:any,recommend:ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/approve-manager-appointment/${outletId}`,recommend,{headers: headersSecure}).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    generateCertificate2(caseId: string): Observable<Blob> {
        const headers = new HttpHeaders({
            'Accept': 'application/octet-stream'
        });

        return this.httpClient.post(`${this.apiUrl}/generate-certificate/${caseId}`, {}, {
            headers: headers,
            responseType: 'blob'
        });
    }

    generateLetter(caseId: string): Observable<Blob> {
        const headers = new HttpHeaders({
            'Accept': 'application/octet-stream'
        });

        return this.httpClient.post(`${this.apiUrl}/generate-letter/${caseId}`, {}, {
            headers: headers,
            responseType: 'blob'
        });
    }

    
}
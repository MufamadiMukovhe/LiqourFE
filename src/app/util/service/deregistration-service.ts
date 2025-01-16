import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, Subject, throwError } from "rxjs";
import { headersSecure } from "../../config/constants";
import { ComplianceInspection, DeregisterOutlet, LCSchedule, ReusableRecommend, Section54 } from "../../model/model";
import { environment } from "src/environments/environment.prod";

@Injectable({ providedIn: 'root' })
export class DeregistrationService {

    private apiUrl = environment.eclbDomain+"api/deregistration";
    constructor(private httpClient: HttpClient) { }

    private refreshrequired = new Subject<void>();
    get RefreshRequired() { return this.refreshrequired; }

    public getSection29Recommendation(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-section29-recommendation/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public boardRecommendation(outletId: any, info:FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/initiate-deregistration-board-recommendation/${outletId}`, info).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public initiateDeregistrationSection29(outletId: any, info:FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/initiate-deregistration-section29/${outletId}`, info).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public initiateDeregistrationSection28(outletId: any, info:FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/initiate-deregistration-section28/${outletId}`, info).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public captureDeregistration(outletId: any, formData: FormData,url:any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/${url}/${outletId}`, formData).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public verifyScheduleLc(caseid: any, lc: LCSchedule): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/schedule-lc/${caseid}`, lc).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public verifyCapture(caseId: any, rec: ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/capture-verification/${caseId}`, rec,{headers:headersSecure}).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public section28Submission(caseId: any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/section28-submission/${caseId}`,{headers:headersSecure}).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public section29(caseId: any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/issue-section-29/${caseId}`,{headers:headersSecure}).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public matterToBoard(caseId: any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/refer-board/${caseId}`,{headers:headersSecure}).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public uploadSAPS(caseId: any,uploadCase:any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/upload-saps-case/${caseId}`,{headers:headersSecure}).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public chiefInspector(caseId: any, rec: ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/chief-inspector-recommendation/${caseId}`, rec,{headers:headersSecure}).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }
 
    public recommendationDeregistration(caseId: any, data: ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/save-record-decision/${caseId}`, data, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public ratificationLicense(caseId: any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/ratification/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public deregisterOutlet(outletId: any, info:FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/deregister-outlet/${outletId}`, info).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public saveSelfDeregistration(outletId: any, info:FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/self-deregister-outlet/${outletId}`, info).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }



    getFile(caseid: string): Observable<HttpResponse<Blob>> {

        return this.httpClient.get(`${this.apiUrl}/${caseid}`, { headers: headersSecure, observe: 'response', responseType: 'blob' });
    }

    getFileSection29(caseid: string): Observable<HttpResponse<Blob>> {

        return this.httpClient.get(`${this.apiUrl}/section-29/${caseid}`, { headers: headersSecure, observe: 'response', responseType: 'blob' });
    }

    public reviewSubmission(caseId: any, recommend: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/review-submission/${caseId}`, recommend).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getComplainantDetails(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-complain-details/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getSectionSubmissionData(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-section29-info/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public complianceInspection(caseId: any, compliance: ComplianceInspection): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/compliance-inspection/${caseId}`, compliance, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public section54(caseId: any, section54: any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/save-section54/${caseId}`, section54).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public section54Digital(caseId: any, section54: any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/save-section54-digital/${caseId}`, section54).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }


    


    public getDereg(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-deregistration/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getLC(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/verification/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }
}
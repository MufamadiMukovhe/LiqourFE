import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, Observable, catchError, throwError, tap } from "rxjs";
import { headers, headersSecure } from "../../config/constants";
import {
    Area, AddressDropdown, Inbox, ConfirmProcess, PreInspection, CommitteeRecommendation, SignOff,
    Complaints,
    Address,
    OutcomeVerification,
    ApproveNameChange,
    MunicipalDecision,
    ChangeOfPlanInspection,
    ReusableRecommend,
    Approve,
    ControllingInterest,
    AllocatePayment,
    GISReport,
    UpdateAssignedTask,
    LCSchedule,
    QualityAssuranceInspectionReport,
    ScheduleDate,
    Add
} from "../../model/model";
import { CacheService } from "./cache.service";
import { environment } from "src/environments/environment.prod";

@Injectable({ providedIn: 'root' })
export class GeneralService {

    private apiUrl = environment.eclbDomain+"api/general";
    constructor(private httpClient: HttpClient, private cacheService: CacheService) { }

    private refreshrequired = new Subject<void>();
    get RefreshRequired() { return this.refreshrequired; }

    public saveDescriptionPremises(formData: FormData,caseId:any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/save-description-premises/${caseId}`,formData).pipe(
            tap(() => this.RefreshRequired.next()),
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getComments(caseId:any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-commets/${caseId}`, { headers:headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getOutletInfoPostReg(outletId:any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/outlet-info/${outletId}`, { headers:headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public submitForLC(formData: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/submit-forlc`,formData).pipe(
            tap(() => this.RefreshRequired.next()),
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public postAddress(add:Add): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/postaddress`,add).pipe(
            tap(() => this.RefreshRequired.next()),
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public updateCaptureAndDocuments(caseId: any, formData: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/update-capture/${caseId}`, formData, { responseType: 'text' as 'json' }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public recordOutcome(caseId: any, recommend: ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/record-outcome/${caseId}`, recommend, { headers:headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public pre(caseId: any, rec: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/pre-reg-compliance/${caseId}`, rec).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public cancelApplication(caseId: any,recommendation:ConfirmProcess): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/cancellation/${caseId}`, recommendation, { headers:headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public scheduleHearingObjection(caseId: any,schedule:ScheduleDate): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/schedule-hearing-objection/${caseId}`, schedule, { headers:headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public lcRecommendationImplementation(caseId: any,refusal:CommitteeRecommendation): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/lcrecommendation-implementation/${caseId}`, refusal, { headers:headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getSummons(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-summons/${caseId}`, { headers:headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getLcList(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/lc-list`, { headers:headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }
    
    public getFiles(caseid: any): Observable<any> {
        const cacheKey = `files-${caseid}`;
        const cachedData = this.cacheService.get(cacheKey);

        if (cachedData) {
            return new Observable(observer => {
                observer.next(cachedData);
                observer.complete();
            });
        } else {
            return this.httpClient.get<any>(`${this.apiUrl}/get-files/${caseid}`).pipe(
                tap(data => {
                    this.cacheService.set(cacheKey, data);
                }),
                catchError(error => {
                    return throwError(() => error);
                })
            );
        }

    }

    public getImages(caseid: any): Observable<any> {
        const cacheKey = `images-${caseid}`;
        const cachedData = this.cacheService.get(cacheKey);

        if (cachedData) {
            return new Observable(observer => {
                observer.next(cachedData);
                observer.complete();
            });
        } else {
            return this.httpClient.get<any>(`${this.apiUrl}/get-images/${caseid}`).pipe(
                tap(data => {
                    this.cacheService.set(cacheKey, data);
                }),
                catchError(error => {
                    return throwError(() => error);
                })
            );
        }

    }

    public getFiles1(outletid: any): Observable<any> {

        return this.httpClient.get<any>(`${this.apiUrl}/get-files1/${outletid}`).pipe(

            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    public getDropdowns(): Observable<AddressDropdown> {
        return this.httpClient.get<AddressDropdown>(`${this.apiUrl}/get-area`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getChecklist(caseId:any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-checklist/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getChangePlan(caseId:any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-changeplan/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getMunicipalities(): Observable<Area> {
        return this.httpClient.get<Area>(`${this.apiUrl}/get-district-municipalities`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getLocalMunicipalities(district: any): Observable<boolean> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-local-municipalities?districtId=${district}`);
    }

    public getTowns(local: any): Observable<boolean> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-towns?localId=${local}`);
    }


    public getLocationPostal(municipal: string): Observable<boolean> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-locations?municipal=${municipal}`);
    }

    public getInbox(): Observable<any> {
        return this.httpClient.get<Inbox[]>(`${this.apiUrl}/get-inbox`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public scanAttach(caseId: any, scan: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/scan-documents/${caseId}`, scan, { responseType: 'text' as 'json' }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getApplicationInformation(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-application/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getApplicationInformation1(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-application1/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getGazettiing(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-gazetting`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public verifyApplicationForRegistration(caseId: any, form:FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/verify-application/${caseId}`,form, { responseType: 'text' as 'json' }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getRecommendation(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-recommendation/${caseId}`, { responseType: 'text' as 'json' }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public changeOfPlanInspection(caseId: any, changeOfPlanInspection: ChangeOfPlanInspection): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/change-plan-inspection/${caseId}`, changeOfPlanInspection, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public qaOfPlanInspection(caseId: any, qa: ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/qa-change-plan-inspection/${caseId}`, qa, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public gazetteApplication(caseId: any, gazette: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/gazette-application/${caseId}`, gazette).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public wcReport(caseId: any, wardCommitee: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/wc-report/${caseId}`, wardCommitee).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public preRegistrationInspection(caseId: any, inspection: PreInspection): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/pre-registration-inspection/${caseId}`, inspection, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public completeInspectionReport(caseId: any, inspection: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/complete-inspection-report/${caseId}`, inspection).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public updateCompleteInspectionReport(caseId: any, inspection: FormData): Observable<any> {
        return this.httpClient.put<any>(`${this.apiUrl}/update-complete-inspection-report//${caseId}`, inspection).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public qaInspectionAssurance(caseId: any, formData:FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/qa-inspection-report/${caseId}`, formData).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public approvechangeOfPlan(caseId: any, approve: Approve): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/approve-change-plan/${caseId}`, approve, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public qaChangePlanInspectionAssurance(caseId: any, approve: ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/change-plan-qa/${caseId}`, approve, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getInspectionInspection(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-inspection/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public updateTaskAssigned(user: UpdateAssignedTask): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/assign-task`, user, { headers: headersSecure }).pipe(
            tap(() => this.RefreshRequired.next()),
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public committeRecomendation2(caseId: any, recomendation: CommitteeRecommendation): Observable<Blob> {
        const headers = new HttpHeaders({
            'Accept': 'application/octet-stream'
        });
        return this.httpClient.post(`${this.apiUrl}/committee-recomendation/${caseId}`, recomendation, {
            headers: headers,
            responseType: 'blob'
        });
    }

    public committeRecomendation(caseId: any, recomendation: CommitteeRecommendation): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/committee-recomendation/${caseId}`, recomendation, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public recordCEORecomendation(caseId:any,recomendation:ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/ceo-recommendation/${caseId}`,recomendation,{headers:headersSecure}).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public committeRecomendation3(caseId: any, recomendation: ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/record-manager-recommendation/${caseId}`, recomendation, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public serviceNotice(caseId: any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/service-notice/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    getFile(caseid: string): Observable<HttpResponse<Blob>> {

        return this.httpClient.get(`${this.apiUrl}/section225/${caseid}`, { headers: headersSecure, observe: 'response', responseType: 'blob' });
    }

    getFile2(caseid: string): Observable<HttpResponse<Blob>> {

        return this.httpClient.get(`${this.apiUrl}/section226/${caseid}`, { headers: headersSecure, observe: 'response', responseType: 'blob' });
    }

    public getLicense(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-license/${caseId}`, { headers: headersSecure, responseType: 'text' as 'json' }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public signOff(caseId: any, signoff: SignOff): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/sign-off/${caseId}`, signoff, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public confirmLCDecision(caseId: any, signoff: SignOff): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/confirm-decision/${caseId}`, signoff, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public approveChangeOfName(caseId: any, signoff: ApproveNameChange): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/approve-change-of-name/${caseId}`, signoff, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public generateCerificate(caseId: any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/generate-certificate/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }


    public generateCeri(caseId: any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/generate-certificate/${caseId}`, { headers: headersSecure, responseType: 'blob' }).pipe(
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

    printSection54Notice(caseId: string): Observable<Blob> {
        const headers = new HttpHeaders({
            'Accept': 'application/octet-stream'
        });

        return this.httpClient.post(`${this.apiUrl}/print-section54-compliance-notice/${caseId}`, {}, {
            headers: headers,
            responseType: 'blob'
        });
    }

    generateLettterForNo(caseId: string): Observable<Blob> {
        const headers = new HttpHeaders({
            'Accept': 'application/octet-stream'
        });

        return this.httpClient.post(`${this.apiUrl}/generat-letter-no/${caseId}`, {}, {
            headers: headers,
            responseType: 'blob'
        });
    }

    generateGazzetting(caseid: any): Observable<Blob> {
        const headers = new HttpHeaders({
            'Accept': 'application/octet-stream'
        });

        return this.httpClient.get(`${this.apiUrl}/download-doc/${caseid}`, {
            headers: headers,
            responseType: 'blob'
        });
    }

    generateRefusalLetter(caseid: any): Observable<Blob> {
        const headers = new HttpHeaders({
            'Accept': 'application/octet-stream'
        });

        return this.httpClient.get(`${this.apiUrl}/print-letter/${caseid}`, {
            headers: headers,
            responseType: 'blob'
        });
    }

    generateCompliance(caseid: any): Observable<Blob> {
        const headers = new HttpHeaders({
            'Accept': 'application/octet-stream'
        });

        return this.httpClient.get(`${this.apiUrl}/print-compliance/${caseid}`, {
            headers: headers,
            responseType: 'blob'
        });
    }

    public generateLetter(caseId: any): Observable<Blob> {
        const headers = new HttpHeaders({
            'Accept': 'application/octet-stream'
        });

        return this.httpClient.post(`${this.apiUrl}/generate-letter/${caseId}`, {}, {
            headers: headers,
            responseType: 'blob'
        });
    }

    public getComplaints(): Observable<Complaints[]> {
        return this.httpClient.get<Complaints[]>(`${this.apiUrl}/get-complaints`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getComplaintsInfo(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-complaints-info`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getComplaintDetails(ref: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-complaint-details/${ref}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getComplaintsAddress(id: any): Observable<Address> {
        return this.httpClient.get<Address>(`${this.apiUrl}/get-outlet-address/${id}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getComplain(ref: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-complain/${ref}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public updateComplain(complain: any): Observable<any> {
        return this.httpClient.put<any>(`${this.apiUrl}/update-complain`, complain, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public municipalDecision(caseId: any, municipalDecision: MunicipalDecision): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/municipal-decision/${caseId}`, municipalDecision, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public changeOfName(outletId: any, formData: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/change-name/${outletId}`, formData).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }
    
    public uploadEnforcementMemo(caseid: any, formData: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/upload-enforcement-memo/${caseid}`, formData).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public issueSection28Notice(caseid: any, formData: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/issue-section28-notice/${caseid}`, formData).pipe(
            catchError((error) => {

                return throwError(() => error);
            })
        )
    }

    public attachSAPSAndBoardReport(caseid: any, formData: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/attach-saps-case-report-to-board/${caseid}`, formData).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public changeOfNameQuery(caseid: any, formData: FormData): Observable<any> {
        return this.httpClient.put<any>(`${this.apiUrl}/change-name-query/${caseid}`, formData).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public outcomeVerification(caseId: any, outcome: OutcomeVerification): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/outcome-verification/${caseId}`, outcome, { headers: headersSecure, responseType: 'text' as 'json' }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public qualityChecks(caseId: any, rec: ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/quality-checks/${caseId}`, rec, { headers: headersSecure, responseType: 'text' as 'json' }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public recordLC(caseId: any, rec: ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/record-lc/${caseId}`, rec, { headers: headersSecure, responseType: 'text' as 'json' }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public outletName(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/outletname/${caseId}`, { headers: headersSecure, responseType: 'text' as 'json' }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getName(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-name/${caseId}`, { headers: headersSecure, responseType: 'text' as 'json' }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    getApplicationStats(fromDate: any, toDate: any): Observable<any> {
        const params = new HttpParams()
          .set('fromDate', fromDate)
          .set('toDate', toDate);
    
        return this.httpClient.get<any>(`${this.apiUrl}/application-stats`, { params });
      }

    public changeOfPlan(outletId: any, changeOfPlan: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/change-plan/${outletId}`, changeOfPlan).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public controllingInterest(outletId: any, controlling: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/controlling-interest/${outletId}`, controlling).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public updateControllingInterest(outletId: any, controlling: FormData): Observable<any> {
        return this.httpClient.put<any>(`${this.apiUrl}/update-controlling-interest/${outletId}`, controlling).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    

    public getControllingInterestData1(outletId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-controlling-interest-data/${outletId}`).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public controllingInterestDocumentation(caseId: any, document: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/controlling-interest-documentation/${caseId}`, document).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public verifyControllingInterestCapture(caseId: any, approve: ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/controlling-interest-verify/${caseId}`, approve, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public confirm(caseId: any, approve: ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/confirm-controlling/${caseId}`, approve, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public recommendControllingInterestCapture(caseId: any, recommend: ReusableRecommend): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/controlling-interest-recommend/${caseId}`, recommend, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public approveControllingInterestCapture(caseId: any, approve: Approve): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/controlling-interest-approve/${caseId}`, approve, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    generate(caseId: string): Observable<Blob> {
        const headers = new HttpHeaders({
            'Accept': 'application/octet-stream'
        });

        return this.httpClient.post(`${this.apiUrl}/generate-controlling/${caseId}`, {}, {
            headers: headers,
            responseType: 'blob'
        });
    }

    public saveCompleteReport(caseId: any, data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/universal-complete-report/${caseId}`, data, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public qaCompleteReport(caseId: any, data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/universal-qa/${caseId}`, data, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getUnallocated(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-unallocated`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getAllocated(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-allocated`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getAccounts(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-accounts`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getUnderOverPayment(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-under-over`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public outlet(value: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/inbusiness-outlet?ref=${value}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public information1(value: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/informatioin1?ref=${value}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getControllingInterest(outletId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-financial-interest/${outletId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getControllingInterestData(caseId: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-controlling-interest/${caseId}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public qualityCheckDocumentation(caseId: any,confirm:ConfirmProcess): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/quality-check-documents/${caseId}`,confirm, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getLCRecommendations(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/lc-recommendations`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public allocatePayment(allocate: AllocatePayment): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/allocate-payment`, allocate, { headers: headersSecure }).pipe(
            tap(() => { this.RefreshRequired.next() }),
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getTransactionDetails(id: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-account/${id}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getOrganisationGLBalances(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-balances`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getNewApplications(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-applications-report`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getAuditTrail(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-audit-trail`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getTransactionReport(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-transactions-report`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getComplaintsReport(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-complaints-report`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getOrganisationDetails(id: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-org/${id}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getGlTransactionReport(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/get-gl-report`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public saveGis(user: GISReport): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/save-gis`, user, { headers: headersSecure }).pipe(
            tap(() => this.RefreshRequired.next()),
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getLC(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/lc-committe`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public getOutletLC(caseid: any): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/outlet-lc-committe/${caseid}`, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public scheduleLc(caseId:any,lcSchedule: LCSchedule): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/schedule-lc/${caseId}`, lcSchedule, { headers: headersSecure }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    checkSwearWord(word: string): Observable<boolean> {
        return this.httpClient.get<boolean>(`${this.apiUrl}/check-swear-word?word=${word}`);
    }

    public saveGISReport(caseid: any, formData: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/save-gis-report/${caseid}`, formData).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    public updateGISReport(caseid: any, formData: FormData): Observable<any> {
        return this.httpClient.put<any>(`${this.apiUrl}/update-gis-report/${caseid}`, formData).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }

    getFile1(caseId: string, filename: any): Observable<Blob> {
        return this.httpClient.get(`${this.apiUrl}/file/${caseId}?filename=${filename}`, { responseType: 'blob' });
    }

    public getPersonOutlets(idNumber: any): Observable<any[]> {
        return this.httpClient.get<any[]>(`${this.apiUrl}/get-outlets-for-persons/${idNumber}`, { headers: headersSecure }).pipe(
            catchError((error) => {
             
              return throwError(() => error);
            })
          );
      }

      public getOutletsByCaseId(idNumber: any): Observable<any[]> {
        return this.httpClient.get<any[]>(`api/outlet/get-outlets-bycase/${idNumber}`, { headers: headersSecure }).pipe(
            catchError((error) => {
             
              return throwError(() => error);
            })
          );
      }

      public getOutletsUsingCaseId(idNumber: any): Observable<any[]> {
        return this.httpClient.get<any[]>(`api/outlet/get-outlet-using-caseid/${idNumber}`, { headers: headersSecure }).pipe(
            catchError((error) => {
             
              return throwError(() => error);
            })
          );
      }
}
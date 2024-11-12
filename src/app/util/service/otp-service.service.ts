import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Auth } from './Auth';
import { headers } from './const';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment.prod';
import { catchError, timeout } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class OtpServiceService {

  private apiUrl = "/api/auth";
  constructor(private httpClient: HttpClient, private auth: Auth) { }

  public getOneTimePin(auth2: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.eclbDomain}api/auth/get-otp`, auth2, { headers: headers }).pipe(
      timeout(25000),
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          console.error('Request timed out after 25 seconds');
          return throwError(() => new Error('The server took too long to respond. Please try again later.'));
        }
        console.error('Error occurred while getting OTP:', JSON.stringify(error));
        return throwError(() => error);
      })
    );
  }

  public validateOTP(auth2:any): Observable<any> {
    return this.httpClient.post<any>(environment.eclbDomain+"api/auth/validate-otp", auth2, { headers: headers }).pipe(
     catchError((error) => {
        console.error('Error occurred while validating OTP:', error); 
        return throwError(() => error);
      })
    );
  }
}

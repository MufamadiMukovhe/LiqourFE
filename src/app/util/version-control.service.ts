import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VersionControlService {

  constructor(private http: HttpClient) {}
  getAppVersion(): Observable<string> {
    return this.http.get<{ version: string }>('package.json').pipe(
       // Log the version
      map((data) => data.version)
    );
  }
}

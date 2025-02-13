import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from './alert.service';
import { environment } from 'src/environments/environment.prod';
import { Network } from '@capacitor/network';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private storageInitialized = false;
  private isSendingReports = new BehaviorSubject<boolean>(false);
  public isSendingReports$ = this.isSendingReports.asObservable();

  constructor(
    private storage: Storage, 
    private http: HttpClient, 
    private alertService: AlertService,
    private router: Router,  
    private spinner: NgxSpinnerService  
  ) {
    this.init();
    this.monitorNetworkStatus();
  }

  async init() {
    try {
      await this.storage.create();
      this.storageInitialized = true;
      console.log('Storage initialized.');
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  monitorNetworkStatus() {
    Network.addListener('networkStatusChange', async status => {
      console.log('Network status changed:', status.connected);
      if (status.connected && this.isUserOnDashboard()) {
        await this.sendPendingReports();
      }
    });

    Network.getStatus().then(async status => {
      console.log('Initial network status:', status.connected);
    }).catch(error => {
      console.error('Error getting initial network status:', error);
    });
  }

  private isUserOnDashboard(): boolean {
    return this.router.url.includes('/dashboard');
  }
  async saveReport(report: FormData, caseNo: string) {
    this.spinner.show();
  
    if (this.storageInitialized) {
      try {
        // Serialize the form data
        const serializedReport = await serializeFormData(report);
  
        let caseReports = await this.storage.get('caseReports') || []; // Get existing or default to an empty array
  
        if (!Array.isArray(caseReports)) {
          caseReports = []; // Ensure it's an array
        }
  
        caseReports.push({ report: serializedReport, caseNo });
  
        // Wait for 7 seconds to simulate a delay for ensuring all data is prepared
        await new Promise(resolve => setTimeout(resolve, 7000));
  
        // Save the data after the delay
        await this.storage.set('caseReports', caseReports);
  
        // Make sure the data is saved by re-fetching and checking
        const savedData = await this.storage.get('caseReports');
        if (savedData && savedData.length > 0) {
          this.spinner.hide();
          this.router.navigate(['/thank-you']);
          console.log('Report saved locally:', savedData);
        } else {
          console.error('Data was not saved correctly.');
          this.spinner.hide();
        }
      } catch (error) {
        console.error('Error saving report:', error);
        this.spinner.hide();
      }
    } else {
      console.error('Storage is not initialized.');
      this.spinner.hide();
    }
  }
  
  

  public async trySendReports() {
    if (this.isUserOnDashboard() && this.isNetworkOnline()) {
      //this.spinner.show();
      await this.sendPendingReports();
     // this.spinner.hide();
    }
  }

  private isNetworkOnline(): boolean {
    return navigator.onLine;
  }

  private async sendPendingReports() {
    if (this.isSendingReports.getValue()) return;

    this.isSendingReports.next(true);

    try {
        // Retrieve all saved reports from storage
        let caseReports = await this.storage.get('caseReports');

        // Ensure caseReports is an array
        if (!Array.isArray(caseReports)) {
            console.log('No reports found or data is not an array.');
            return;
        }

        let remainingReports = [];

        for (const reportData of caseReports) {
            const { report, caseNo } = reportData; // Destructure properly

            if (report && caseNo) {
                try {
                    await this.sendReport(report, caseNo);
                } catch (error) {
                    console.error(`Failed to send report for case ${caseNo}:`, error);
                    remainingReports.push(reportData); // Store failed reports
                }
            }
        }

        // Update local storage with only failed reports
        if (remainingReports.length > 0) {
            await this.storage.set('caseReports', remainingReports);
            console.log(`${remainingReports.length} reports failed and will be retried.`);
        } else {
            await this.storage.remove('caseReports');
            console.log('All pending reports sent successfully.');
        }
    } catch (error) {
        console.error('Error processing pending reports:', error);
    } finally {
        this.isSendingReports.next(false);
    }
}

private async sendReport(report: any, caseId: string) {
    this.spinner.show();

    try {
        const formData = deserializeFormData(report);
        console.log(`Sending report for case ${caseId}`);

        await this.http
            .post(`${environment.eclbDomain}api/general/complete-inspection-report/${caseId}`, formData)
            .toPromise();

        this.alertService.showAlert('Success', 'Inspection Complete.');
        console.log(`Report for case ${caseId} sent.`);
    } catch (error) {
        console.error(`Error sending report for case ${caseId}:`, error);
        this.alertService.showAlert('Error', 'Failed to send report. Please try again.');
        throw error; // Ensure failed reports remain in storage
    } finally {
        this.spinner.hide();
    }
}

  
  
}

// Utility functions for handling FormData
async function serializeFormData(formData: FormData): Promise<any> {
  const obj: any = {};
  
  formData.forEach(async (value, key) => {
    if (value instanceof File) {
      obj[key] = {
        fileName: value.name,
        fileType: value.type,
        fileSize: value.size,
        fileContent: await readFileAsDataURL(value),
      };
    } else {
      obj[key] = value;
    }
  });

  return obj;
}


function deserializeFormData(serializedData: any): FormData {
  const formData = new FormData();
  for (const key in serializedData) {
    if (serializedData[key]?.fileName) {
      const blob = dataURLToBlob(serializedData[key].fileContent);
      const file = new File([blob], serializedData[key].fileName, { type: serializedData[key].fileType });
      formData.append(key, file);
    } else {
      formData.append(key, serializedData[key]);
    }
  }
  return formData;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

function dataURLToBlob(dataURL: string): Blob {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

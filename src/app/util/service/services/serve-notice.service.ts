import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AlertService } from './alert.service';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ServeNoticeService {
  private storageInitialized = false;
  private isSendingNotices = new BehaviorSubject<boolean>(false);
  public isSendingNotices$ = this.isSendingNotices.asObservable();

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
    Network.addListener('networkStatusChange', async (status) => {
      console.log('Network status changed:', status.connected);
      if (status.connected && this.isUserOnDashboard()) {
        await this.sendPendingNotices();
      }
    });

    Network.getStatus()
      .then(async (status) => {
        console.log('Initial network status:', status.connected);
      })
      .catch((error) => {
        console.error('Error getting initial network status:', error);
      });
  }

  private isUserOnDashboard(): boolean {
    return this.router.url.includes('/dashboard');
  }

  async saveNotice(formData: FormData, caseNo: string) {
    this.spinner.show();
  
    if (this.storageInitialized) {
      try {
        // Serialize the notice form data
        const serializedNotice = await serializeFormData(formData);
  
        let storedNotices = (await this.storage.get('notices')) || [];
  
        if (!Array.isArray(storedNotices)) {
          storedNotices = []; // Ensure it's an array
        }
  
        storedNotices.push({ formData: serializedNotice, caseNo });
  
        // Wait for 7 seconds to ensure all data is ready
        await new Promise(resolve => setTimeout(resolve, 7000));
  
        // Save the data after the delay
        await this.storage.set('notices', storedNotices);
  
        // Validate if the data was saved successfully
        const savedData = await this.storage.get('notices');
        if (savedData && savedData.length > 0) {
          this.spinner.hide();
          this.router.navigate(['/offline-thank-you']);
          console.log('Notice saved locally:', savedData);
        } else {
          console.error('Data was not saved correctly.');
          this.spinner.hide();
        }
      } catch (error) {
        console.error('Error saving notice:', error);
        this.spinner.hide();
      }
    } else {
      console.error('Storage is not initialized.');
      this.spinner.hide();
    }
  }
  
  public async clearStoredGis() {
    try {
      await this.storage.remove('notices');
      console.log('Stored GIS data cleared.');
    } catch (error) {
      console.error('Error clearing GIS data:', error);
    }
  }
  public async trySendNotices() {
    if (this.isUserOnDashboard() && this.isNetworkOnline()) {
      this.spinner.show();
      await this.sendPendingNotices();
      this.spinner.hide();
    }
  }

  private isNetworkOnline(): boolean {
    return navigator.onLine;
  }

  private async sendPendingNotices() {
    if (this.isSendingNotices.getValue()) return;

    this.isSendingNotices.next(true);

    try {
      let storedNotices = await this.storage.get('notices');

      if (!Array.isArray(storedNotices)) {
        console.log('No notices found or data is not an array.');
        return;
      }

      for (const noticeData of storedNotices) {
        const { formData, caseNo } = noticeData;
        if (formData && caseNo ) {
          await this.sendNotice(formData, caseNo);
        }
      }

      await this.storage.remove('notices');
      console.log('All pending notices sent successfully.');
    } catch (error) {
      console.error('Error sending pending notices:', error);
    } finally {
      this.isSendingNotices.next(false);
    }
  }

  private async sendNotice(formData: any, caseId: string) {
    this.spinner.show(); // Show spinner before starting
  
    try {
      const formDataObject = deserializeFormData(formData);
      console.log(formDataObject);
      console.log(`Sending notice for case ${caseId}`);
  
      await this.http
        .put(`${environment.eclbDomain}api/general/update-section-notice/${caseId}`, formDataObject)
        .toPromise();
  
      this.alertService.showAlert('Success', 'Notice Submitted.');
      console.log(`Notice for case ${caseId} sent.`);
    } catch (error) {
      console.error(`Error sending notice for case ${caseId}:`, error);
      this.alertService.showAlert('Error', 'Failed to submit notice. Please try again.');
    } finally {
      this.spinner.hide(); // Ensure the spinner hides only once after success or failure
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
    reader.onerror = (error) => reject(error);
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

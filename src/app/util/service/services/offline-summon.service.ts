import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AlertService } from './alert.service';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class OfflineSummonService {
  private storageInitialized = false;
  private isSendingSummons = new BehaviorSubject<boolean>(false);
  public isSendingSummons$ = this.isSendingSummons.asObservable();

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
        await this.sendPendingSummons();
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

  async saveSummon(formData: FormData, caseNo: string,summon:string) {
    this.spinner.show();
  
    if (this.storageInitialized) {
      try {
        // Serialize the Summon form data
        const serializedSummon = await serializeFormData(formData);
  
        let storedSummons = (await this.storage.get('Summons')) || [];
  
        if (!Array.isArray(storedSummons)) {
          storedSummons = []; // Ensure it's an array
        }
  
        storedSummons.push({ formData: serializedSummon, caseNo, summon });
  
        // Wait for 7 seconds to ensure all data is ready
        await new Promise(resolve => setTimeout(resolve, 7000));
  
        // Save the data after the delay
        await this.storage.set('Summons', storedSummons);
  
        // Validate if the data was saved successfully
        const savedData = await this.storage.get('Summons');
        if (savedData && savedData.length > 0) {
          this.spinner.hide();
          this.router.navigate(['/offline-thank-you']);
          console.log('Summon saved locally:', savedData);
        } else {
          console.error('Data was not saved correctly.');
          this.spinner.hide();
        }
      } catch (error) {
        console.error('Error saving Summon:', error);
        this.spinner.hide();
      }
    } else {
      console.error('Storage is not initialized.');
      this.spinner.hide();
    }
  }
  
  public async clearStoredGis() {
    try {
      await this.storage.remove('Summons');
      console.log('Stored GIS data cleared.');
    } catch (error) {
      console.error('Error clearing GIS data:', error);
    }
  }
  public async trySendSummons() {
    if (this.isUserOnDashboard() && this.isNetworkOnline()) {
      //this.spinner.show();
      await this.sendPendingSummons();
      //this.spinner.hide();
    }
  }

  private isNetworkOnline(): boolean {
    return navigator.onLine;
  }

  private async sendPendingSummons() {
    if (this.isSendingSummons.getValue()) return;

    this.isSendingSummons.next(true);

    try {
      let storedSummons = await this.storage.get('Summons');

      if (!Array.isArray(storedSummons)) {
        console.log('No Summons found or data is not an array.');
        return;
      }

      for (const SummonData of storedSummons) {
        const { formData, caseNo, summon } = SummonData;
        if (formData && caseNo && summon ) {
          await this.sendSummon(formData, caseNo, summon);
        }
      }

      await this.storage.remove('Summons');
      console.log('All pending Summons sent successfully.');
    } catch (error) {
      console.error('Error sending pending Summons:', error);
    } finally {
      this.isSendingSummons.next(false);
    }
  }

  private async sendSummon(formData: any, caseId: string,summon: string) {
    this.spinner.show(); // Show spinner before starting
  
    try {
      const formDataObject = deserializeFormData(formData);
      console.log(formDataObject);
      console.log(`Sending Summon for case ${caseId}`);
  
      await this.http
        .put(`${environment.eclbDomain}api/general/update-summons/${caseId}/${summon}`, formDataObject)
        .toPromise();
  
      this.alertService.showAlert('Success', 'Summon Submitted.');
      console.log(`Summon for case ${caseId} sent.`);
    } catch (error) {
      console.error(`Error sending Summon for case ${caseId}:`, error);
      this.alertService.showAlert('Error', 'Failed to submit Summon. Please try again.');
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

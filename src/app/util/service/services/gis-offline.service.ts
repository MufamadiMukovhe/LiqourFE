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
export class GisOfflineService {

  private storageInitialized = false;
  private isUploadingGis = new BehaviorSubject<boolean>(false);
  public isUploadingGis$ = this.isUploadingGis.asObservable();

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
        await this.uploadPendingGis();
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

  async saveGis(gisreport: FormData, gisCaseNo: string) {
    this.spinner.show();
  
    if (this.storageInitialized) {
      try {
        // Serialize the GIS form data
        const serializedGis = await serializeFormData(gisreport);
  
        let storedGis = await this.storage.get('storedGis') || [];
  
        if (!Array.isArray(storedGis)) {
          storedGis = []; // Ensure it's an array
        }
  
        storedGis.push({ gisData: serializedGis, gisCaseNo });
  
        // Wait for 7 seconds to simulate delay for ensuring all data is prepared
        await new Promise(resolve => setTimeout(resolve, 7000));
  
        // Save the data after the delay
        await this.storage.set('storedGis', storedGis);
  
        // Make sure the data is saved by re-fetching and checking
        const savedData = await this.storage.get('storedGis');
        if (savedData && savedData.length > 0) {
          this.spinner.hide();
          this.router.navigate(['/offline-thank-you']);
          console.log('GIS data saved locally:', savedData);
        } else {
          console.error('Data was not saved correctly.');
          this.spinner.hide();
        }
      } catch (error) {
        console.error('Error saving GIS data:', error);
        this.spinner.hide();
      }
    } else {
      console.error('Storage is not initialized.');
      this.spinner.hide();
    }
  }
  
  
  public async tryUploadGis() {
    if (this.isUserOnDashboard() && this.isNetworkOnline()) {
      this.spinner.show();
      await this.uploadPendingGis();
      this.spinner.hide();
    }
  }

  private isNetworkOnline(): boolean {
    return navigator.onLine;
  }

  private async uploadPendingGis() {
    if (this.isUploadingGis.getValue()) return;
  
    this.isUploadingGis.next(true);
  
    try {
      let storedGis = await this.storage.get('storedGis');
      console.log(storedGis)
      if (!Array.isArray(storedGis)) {
        console.log('No GIS data found or data is not an array.');
        return;
      }
  
      for (const gisRecord of storedGis) {
        const { gisData, gisCaseNo } = gisRecord;
        if (gisData && gisCaseNo) {
          await this.uploadGis(gisData, gisCaseNo);
        }
      }
  
      await this.storage.remove('storedGis');
      console.log('All pending GIS data uploaded successfully.');
  
    } catch (error) {
      console.error('Error uploading pending GIS data:', error);
    } finally {
      this.isUploadingGis.next(false);
    }
  }
  
  private async uploadGis(gisreport: any, gisCaseId: string) {
    this.spinner.show();
    try {
      const formData = deserializeFormData(gisreport);
      console.log(`Uploading GIS data for case ${gisCaseId}`);

      await this.http.post(`${environment.eclbDomain}api/general/save-gis-report/${gisCaseId}`, formData).toPromise();
      this.alertService.showAlert('Success', 'GIS Upload Complete.');
      console.log(`GIS data for case ${gisCaseId} uploaded.`);
      this.spinner.hide();
    } catch (error) {
      console.error(`Error uploading GIS data for case ${gisCaseId}:`, error);
      this.spinner.hide();
      throw error;
    } finally {
      this.spinner.hide();
    }
  }


  public async clearStoredGis() {
    try {
      await this.storage.remove('storedGis');
      console.log('Stored GIS data cleared.');
    } catch (error) {
      console.error('Error clearing GIS data:', error);
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


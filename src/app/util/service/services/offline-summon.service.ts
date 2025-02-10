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
  private isSendingsummons = new BehaviorSubject<boolean>(false);
  public isSendingsummons$ = this.isSendingsummons.asObservable();

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private alertController:AlertController
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
        await this.sendPendingsummons();
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

  async savesummon(formData: FormData, caseNo: string, summon: any) {
    this.spinner.show();
  
    if (this.storageInitialized) {
      try {
        // Serialize the summon form data
        const serializedSummon = await serializeFormData(formData);
  
        let storedSummons = (await this.storage.get('summons')) || [];
  
        if (!Array.isArray(storedSummons)) {
          storedSummons = []; // Ensure it's an array
        }
  
        storedSummons.push({ formData: serializedSummon, caseNo, summon });
  
        // Wait for 7 seconds to ensure all data is ready
        await new Promise(resolve => setTimeout(resolve, 7000));
  
        // Save the data after the delay
        await this.storage.set('summons', storedSummons);
  
        // Make sure the data is saved by re-fetching and checking
        const savedData = await this.storage.get('summons');
        if (savedData && savedData.length > 0) {
          this.spinner.hide();
          await this.showAlert('Complete', 'Summon served offline');
          this.router.navigate([`/summons/${caseNo}`]);
          console.log('Summon saved locally:', savedData);
        } else {
          console.error('Data was not saved correctly.');
          this.spinner.hide();
        }
      } catch (error) {
        console.error('Error saving summon:', error);
        this.spinner.hide();
      }
    } else {
      console.error('Storage is not initialized.');
      this.spinner.hide();
    }
  }
  
  public async clearStoredGis() {
    try {
      await this.storage.remove('summons');
      console.log('Stored GIS data cleared.');
    } catch (error) {
      console.error('Error clearing GIS data:', error);
    }
  }
  public async trySendsummons() {
    if (this.isUserOnDashboard() && this.isNetworkOnline()) {
      this.spinner.show();
      await this.sendPendingsummons();
      this.spinner.hide();
    }
  }

  private isNetworkOnline(): boolean {
    return navigator.onLine;
  }

  private async sendPendingsummons() {
    if (this.isSendingsummons.getValue()) return;

    this.isSendingsummons.next(true);

    try {
      let storedsummons = await this.storage.get('summons');

      if (!Array.isArray(storedsummons)) {
        console.log('No summons found or data is not an array.');
        return;
      }

      for (const summonData of storedsummons) {
        const { formData, caseNo , summon} = summonData;
        if (formData && caseNo && summon) {
          await this.sendsummon(formData, caseNo,summon);
        }
      }

      await this.storage.remove('summons');
      console.log('All pending summons sent successfully.');
    } catch (error) {
      console.error('Error sending pending summons:', error);
    } finally {
      this.isSendingsummons.next(false);
    }
  }

  private async sendsummon(formData: any, caseId: string, summon: string) {
    this.spinner.show(); // Show spinner before the process starts
  
    try {
      const formDataObject = deserializeFormData(formData);
      console.log(formDataObject);
      console.log(`Sending summon for case ${caseId}`);
  
      await this.http
        .put(`${environment.eclbDomain}api/general/update-summons/${caseId}/${summon}`, formDataObject)
        .toPromise();
  
      this.alertService.showAlert('Success', 'Summon Submitted.');
      console.log(`Summon for case ${caseId} sent.`);
    } catch (error) {
      console.error(`Error sending summon for case ${caseId}:`, error);
      this.alertService.showAlert('Error', 'Failed to submit summon. Please try again.');
    } finally {
      this.spinner.hide(); // Ensure spinner hides only once after success or failure
    }
  }
  


  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
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
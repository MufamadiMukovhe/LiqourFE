import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/util/service/storage.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ViewImagePage } from '../view-image/view-image.page';
import { environment } from 'src/environments/environment.prod';
import { Geolocation } from '@capacitor/geolocation';
import { NgxSpinnerService } from 'ngx-spinner';
import { OfflineService } from 'src/app/util/service/services/offline.service';
import { GisOfflineService } from 'src/app/util/service/services/gis-offline.service';

@Component({
  selector: 'app-complete-gis-report',
  templateUrl: './complete-gis-report.page.html',
  styleUrls: ['./complete-gis-report.page.scss'],
})
export class CompleteGisReportPage implements OnInit {

  selectedOption: string = '';
  reportFiles: { name: string, size: number }[] = [];
  noticeFiles: { name: string, size: number }[] = [];
  currentForm: string = 'landing';
  selectedRadioValue: string | null = null; 
  inputVisible: boolean = true; 

  
  latitude: any;
  longitude: any;
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  gisReportForm: FormGroup;
  caseId: any;
  caseNo: any;
  imageSources: string[] = [];
  private geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${environment.googleMapsApiKey}`;

  gisReport: any;
  reportDoc: any;
  noticeDoc: any;

  constructor(
    private router: Router,
    private eRef: ElementRef,
    private alertController: AlertController,
    private fb: FormBuilder,
    private storageService: StorageService,
    private aRoute: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private spinner: NgxSpinnerService,
    private offlineService:OfflineService,
    private  gisOffine:GisOfflineService
  ) {
    this.gisReportForm = this.fb.group({
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      schoolIn100m: ['', Validators.required],
      churchIn100m: ['', Validators.required],
      wardBoundriesIn100m: ['', Validators.required],
      //councilorContacted: ['', Validators.required]
      commentsByQa: ['']
    })
  }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.caseNo = param.get('caseId');
      console.log(this.caseNo);
    });

    this.getCurrentPosition();

  }

  //GISReport 
  isGisReport(){
    const areReportFilesPresent = this.reportFiles && this.reportFiles.length > 0;
    return areReportFilesPresent;
  }
    //Gis Form Valid
    isGisFormValid(): boolean {
      const gisFormFields = ['longitude', 'latitude', 'schoolIn100m','churchIn100m','wardBoundriesIn100m'];
      const areFieldsValid = gisFormFields.every(field => this.gisReportForm.get(field)?.valid);
      return areFieldsValid;
    }


  onSubmit() {
    this.spinner.show();
    let token = localStorage.getItem("userToken");
    const newHeader = {
      "Authorization": "Bearer " + token,
      "Accept": "/"
    };

    this.gisReport = this.gisReport || {};
    this.gisReport = Object.assign(this.gisReport, this.gisReportForm.value);

    const formData = new FormData();
    formData.append('gisreport', new Blob([JSON.stringify(this.gisReport)], { type: 'application/json' }));

    this.reportDoc = this.reportFiles[0];

    formData.append('greport', this.report);
    


    let url = environment.eclbDomain+"api/general/save-gis-report/"+this.caseNo;

    this.http.post(url, formData).subscribe(response => {
      console.log(response);
      this.spinner.hide();
      this.router.navigate(['/thank-you3'])
      
    }, error => {
      console.log(error);
      if (navigator.onLine) {
        this.spinner.hide();
        this.showAlert1('failed', 'Something went wrong. Please try again');
      
      } else {
      this.gisOffine.saveGis(formData, this.caseNo);
      }


    });
  }

  saveFormValues() {
    localStorage.setItem('gisReportForm', JSON.stringify(this.gisReportForm.value));
  }

  clearLocalStorageOnLoad() {
    localStorage.removeItem('gisReportForm');
  }

  loadFormValues() {
    const savedForm = localStorage.getItem('gisReportForm');
    if (savedForm) {
      this.gisReportForm.setValue(JSON.parse(savedForm));
    }
  }

  toggleForms(form: string) {
    this.currentForm = form;
    this.saveFormValues();
  }

  triggerFileInput() {
   
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = ".docx, .pdf"; // Adjust as needed for file types
    fileInput.onchange = (event: Event) => this.onFileSelected(event);
    fileInput.click();
  }

  report!: File;
  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.report = file; 
       if (this.reportFiles.length > 0) {
        this.reportFiles.splice(0, 1, { name: file.name, size: file.size });
      } else {
        this.reportFiles.push({ name: file.name, size: file.size });
      }
      this.inputVisible = false; 
    }
  }

  isFileUploaded(fileName: string): boolean {
    return this.reportFiles.some(file => file.name === fileName);
  }

  navigateToBack() {
    this.aRoute.navigate(['complete-inspection']);
  }

  async presentAlertConfirm(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this document?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteItem(index);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
      ]
    });

    await alert.present();
  }

  deleteItem(index: number) {
    this.reportFiles.splice(index, 1);
    if (this.reportFiles.length === 0) {
      this.inputVisible = true;
    }
  }


  isFileUploadedNotice(fileName: string): boolean {
    return this.noticeFiles.some(file => file.name === fileName);
  }

 
  async presentAlertConfirmNotice(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this document?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteItemNotice(index);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
      ]
    });

    await alert.present();
  }

  deleteItemNotice(index: number) {
    this.noticeFiles.splice(index, 1);
    if (this.noticeFiles.length === 0) {
      this.inputVisible = true;
    }
  }



  async getCurrentPosition() {
    if (navigator.geolocation) {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;

          
          console.log('Latitude:', this.latitude);
          console.log('Longitude:', this.longitude);

          
          this.gisReportForm.patchValue({
            latitude: this.latitude,
            longitude: this.longitude,
          });
        },
        async (error: GeolocationPositionError) => {
          console.error('Error getting location', error);

          if (error.code === 1) {
            await this.showAlert1('Permission Denied', 'Location access was denied.');
          } else if (error.code === 2) {
            await this.showAlert1('Position Unavailable', 'Unable to determine location.');
          } else if (error.code === 3) {
            await this.showAlert1('Timeout', 'Location request timed out.');
          } else {
            await this.showAlert1('Error', 'An unexpected error occurred while getting location.');
          }
        },
        options
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      await this.showAlert1('Error', 'Geolocation is not supported by this browser.');
    }
  }
 
  async showAlert1(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}


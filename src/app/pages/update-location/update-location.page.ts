import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { headersSecure } from 'src/app/util/service/const';
import { CompleteGISReport } from 'src/app/util/service/model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-update-location',
  templateUrl: './update-location.page.html',
  styleUrls: ['./update-location.page.scss'],
})
export class UpdateLocationPage implements OnInit {

  latitude?: number;
  longitude?: number;
  
  selectedOption: string = '';
  uploadedFiles: { name: string, size: number }[] = [];
  currentForm: string = 'landing';
  
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  caseId: any;

  reportDoc: any;
  reportFiles: { name: string, size: number }[] = [];
  report2 = new CompleteGISReport();

  gisReportForm: FormGroup;
  gisReport!: { file: File, documentType: string };

  constructor(
    private router: Router,
    private eRef: ElementRef,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { 
    this.gisReportForm = this.formBuilder.group({
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      schoolIn100m: ['', Validators.required],
      churchIn100m: ['', Validators.required],
      wardBoundriesIn100m: ['', Validators.required],
      councilorContacted: ['1', Validators.required]
    });
  }

  ngOnInit() {
    this.loadLastKnownLocation();

    const token = localStorage.getItem("userToken");
    this.activatedRoute.paramMap.subscribe(param => {
      this.caseId = param.get('caseId');
      console.log(this.caseId);
    });
  }

  
  async getCurrentPosition() {
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
  
    // Function to save the last known location using localStorage
    const saveLastKnownLocation = (latitude: number, longitude: number) => {
      localStorage.setItem('lastKnownLatitude', latitude.toString());
      localStorage.setItem('lastKnownLongitude', longitude.toString());
    };
  
    // Function to load the last known location from localStorage
    const loadLastKnownLocation = () => {
      const latitude = localStorage.getItem('lastKnownLatitude');
      const longitude = localStorage.getItem('lastKnownLongitude');
      if (latitude && longitude) {
        this.gisReportForm.patchValue({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        });
      }
    };
  
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
  
          // Check if the coordinates are within the specified bounds
         // if (this.latitude < -31 && this.latitude > -34 && this.longitude > 24 && this.longitude < 34) {
            this.gisReportForm.patchValue({
              latitude: this.latitude,
              longitude: this.longitude
            });
            saveLastKnownLocation(this.latitude, this.longitude);
          //} else {
            // this.gisReportForm.patchValue({
            //   latitude: "Out of bounds",
            //   longitude: "Out of bounds"
            // }
          //);
           // saveLastKnownLocation(0, 0);
         // }
        },
        (error) => {
          console.error('Error getting location', error);
  
          switch (error.code) {
            case 1:
              this.presentAlert('Permission Denied', 'Location access was denied.');
              break;
            case 2:
              this.presentAlert('Position Unavailable', 'Unable to determine location.');
              loadLastKnownLocation();
              break;
            case 3:
              this.presentAlert('Timeout', 'Location request timed out.');
              break;
            default:
              this.presentAlert('Error', 'An unexpected error occurred while getting location.');
              break;
          }
        },
        options
      );
    } catch (error) {
      console.error('An unknown error occurred', error);
    }
  }
  
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  saveLastKnownLocation(lat: number, lon: number) {
    localStorage.setItem('lastKnownLatitude', lat.toString());
    localStorage.setItem('lastKnownLongitude', lon.toString());
  }

  loadLastKnownLocation() {
    const lastLat = localStorage.getItem('lastKnownLatitude');
    const lastLon = localStorage.getItem('lastKnownLongitude');

    if (lastLat && lastLon) {
      this.latitude = parseFloat(lastLat);
      this.longitude = parseFloat(lastLon);
      this.gisReportForm.patchValue({
        latitude: this.latitude.toString(), // Convert number to string
        longitude: this.longitude.toString() // Convert number to string
      });
    }
  }

  toggleForms(form: string) {
    this.currentForm = form;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.gisReport = { file, documentType: 'report' };
      if (this.reportFiles.length > 0) {
        this.reportFiles.splice(0, 1, { name: file.name, size: file.size });
      } else {
        this.reportFiles.push({ name: file.name, size: file.size });
      }
    }
  }

  isFileUploaded(fileName: string): boolean {
    return this.uploadedFiles.some(file => file.name === fileName);
  }

  async presentFileExistsAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Document already uploaded.',
      buttons: ['OK']
    });

    await alert.present();
  }

  navigateToBack() {
    this.router.navigate(['complete-inspection']);
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
        }
      ]
    });
  
    await alert.present();
  }
  
  deleteItem(index: number) {
    if (index > -1) {
      this.reportFiles.splice(index, 1);
    }
  }
  
  selectFileReport(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = ".docx, .pdf";
    fileInput.onchange = (event: Event) => this.onFileSelected(event);
    fileInput.click();
  }

  report = new CompleteGISReport();
  submitGISReport(): void {
    let url = "https://system.eclb.co.za/eclb2/api/general/save-gis-report/";
    if (this.gisReportForm.invalid || !this.gisReport) {
      return;
    }

    this.spinner.show();
    this.report = Object.assign(this.report, this.gisReportForm.value);
    const formData = new FormData();
    formData.append('gisreport', new Blob([JSON.stringify(this.report)], { type: 'application/json' }));

    if (this.gisReport) {
      formData.append('report', this.gisReport.file);
    }


    console.log(this.gisReport.file);
    

    this.http.post(url + this.caseId, formData).subscribe(response => {
      this.spinner.hide();
      console.log("submitted");
      setTimeout(() => {
        this.router.navigate(['/inbox']);
      }, 5000);
    }, error => {

      this.spinner.hide();
      console.error(error);
      console.log(this.gisReportForm);
      console.log(this.gisReport.file)
    });
  }


  

  public getControl(controlName: string): FormControl { 
    return this.gisReportForm.get(controlName) as FormControl; 
  }

  public onGISSelected(event: { file: File, documentType: string }) {
    this.gisReport = event;
  }
}
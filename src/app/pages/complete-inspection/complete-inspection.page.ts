import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { headersSecure } from 'src/app/util/service/const';
import { StorageService } from 'src/app/util/service/storage.service';

@Component({
  selector: 'app-complete-inspection',
  templateUrl: './complete-inspection.page.html',
  styleUrls: ['./complete-inspection.page.scss'],
})
export class CompleteInspectionPage implements OnInit {

  selectedOption: string = '';
  uploadedFiles: { name: string, size: number }[] = [];
  currentForm: string = 'landing';
  selectedRadioValue: string | null = null; // Initialize to null or the default value you want

  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  completeReportForm: FormGroup;
  caseId: any;

  constructor(
    private router: Router,
    private eRef: ElementRef,
    private alertController: AlertController,
    private fb: FormBuilder,
    private storageService: StorageService,
    private aRoute: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.completeReportForm = this.fb.group({
      personContacted: ['', Validators.required],
      inspectionDate: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      appointmentSet: ['', Validators.required],
      personConsulted: ['', [Validators.required]],
      indicatedParticularPerson: ['', [Validators.required]],
      personFoundConfirmed: ['', [Validators.required]],
      rightToOccupy: ['', [Validators.required]],
      formServedToWardCommittee: ['', Validators.required],
      formServedToWardCouncillor: ['', [Validators.required]],
      wardCommitteReport: ['', [Validators.required]],
      communityConsulted: ['', [Validators.required]],
      educationalInstitutionWithin100m: ['', [Validators.required]],
      premisesInIndicatedAddress: ['', [Validators.required]],
      formServedAtEducationalInstitution: ['', [Validators.required]],
      placeOfWorshipWithin100m: ['', [Validators.required]],
      formServedAtPlaceOfWorship: ['', [Validators.required]],
      recommendationForRegistration: ['', Validators.required],
      comments: ['', Validators.required],
      futurePreInspectionDate: ['', Validators.required],
      lease: ['', Validators.required],
      premiseInLineWithPlan: ['', Validators.required],
      premisesSuitedForCategory: ['', Validators.required],
      abulutionFacilityWorking: ['', Validators.required],
      readyToCommenceWithBusiness: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.clearLocalStorageOnLoad();
    this.loadFormValues();
    const url = "/api/general/get-inspection/";
    this.route.paramMap.subscribe(param => {
      this.caseId = param.get('caseId');
      this.http.get<any>(url + this.caseId, { headers: headersSecure }).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  onSubmit() {
    console.log(this.completeReportForm.value);
    // Perform other actions here, like sending the data to the backend
  }

  saveFormValues() {
    localStorage.setItem('completeReportForm', JSON.stringify(this.completeReportForm.value));
  }

  clearLocalStorageOnLoad() {
    localStorage.removeItem('completeReportForm');
  }

  loadFormValues() {
    const savedForm = localStorage.getItem('completeReportForm');
    if (savedForm) {
      this.completeReportForm.setValue(JSON.parse(savedForm));
    }
  }

  toggleForms(form: string) {
    this.currentForm = form;
    this.saveFormValues();
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (this.isFileUploaded(file.name)) {
        await this.presentFileExistsAlert();
      } else {
        this.uploadedFiles.push({ name: file.name, size: file.size });
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
    this.uploadedFiles.splice(index, 1);
  }
}

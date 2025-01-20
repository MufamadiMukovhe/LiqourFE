import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeOfName, Deregistration, FileItem, Message } from 'src/app/model/model';
import { AppointManagerService } from 'src/app/util/service/appoint-manager';
import { DeregistrationService } from 'src/app/util/service/deregistration-service';
import { GeneralService } from 'src/app/util/service/general-service';
import { GeolocationService } from 'src/app/util/service/geolocation.service';

@Component({
  selector: 'app-non-compliance-section29',
  templateUrl: './non-compliance-section29.page.html',
  styleUrls: ['./non-compliance-section29.page.scss'],
})
export class NonComplianceSection29Page implements OnInit {
  inputVisible: boolean = true;
  changeOfPlanForm!: FormGroup;
  reportFiles: { name: string, size: number }[] = [];
  @Input() showFailedCompliance: boolean = false;
  currentForm: string = 'landing';
  registrationForm!: FormGroup;
  recommendationForm!: FormGroup;
  changeOfNameForm!: FormGroup;
  caseId: any;
caseNo: any;
  outletId: any;
  status: any;
  reportDoc: any;
  constructor(
    private fb: FormBuilder,
    private geolocation: GeolocationService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private service: GeneralService,
    private routes: ActivatedRoute,
    private alertController:AlertController,
    private appointmentService: AppointManagerService, 
   
    private deregistrationService: DeregistrationService
  ) {

    this.changeOfPlanForm = this.fb.group({
      inspectionDate:['', Validators.required],
      recommendation: ['', Validators.required],
      ecpNumber:[''],
      municipality:[''],
      outletName:[''],
      ward:[''],

      prefferedNotificationMethod: ['', Validators.required],
      applicationPreparedByType2: ['Natural', Validators.required]
    });
  
}

  ngOnInit() {
    this.routes.params.subscribe(params => {
      this.outletId = params['caseId'];
      this.caseId = this.outletId;
    });

    this.getOutletInformation(this.outletId)
      
  
    this.changeOfNameForm = this.fb.group({
      constructionBuildingWalls: ['',Validators.required],
      constructionRoof: ['',Validators.required],
      constructionWindows: ['',Validators.required],
      constructionDoors: ['',Validators.required],
      constructionFloorCovering: ['',Validators.required],
      constructionAdequateAblutionFacilities: ['',Validators.required],
      
      fixturesBarCounter: ['',Validators.required],
      fixturesDisplayShelving: ['',Validators.required],
      fixturesBarStools: ['',Validators.required],
      fixturesTables: ['',Validators.required],
      fixturesChairs: ['',Validators.required],
      fixturesLightFittings: ['',Validators.required],

      finishingsRoof: ['',Validators.required],
      finishingsCeiling: ['',Validators.required],
      finishingsWindows: ['',Validators.required],
      finishingsDoors: ['',Validators.required],
      finishingsFloorCovering: ['',Validators.required],
      recommendation:['',Validators.required],
      anyRelevantComment: ['',Validators.required]
    });

    
  }
  toggleForms(form: string) {
    this.currentForm = form;
   
  }
  isInspectionReportGeneral():boolean{
    const reportGeneral= ['constructionBuildingWalls', 'finishingsRoof','finishingsCeiling','finishingsWindows','finishingsDoors','finishingsFloorCovering'];
    return true
  }
  isRelevantValid():boolean{
     const relevent =['anyRelevantComment']
    //return relevent.every(field => this.changeOfNameForm.get(field)?.valid);
    return true
  }
  isComplianceValid(): boolean {
   const compliance= ['constructionBuildingWalls','constructionRoof','constructionWindows','constructionDoors','constructionAdequateAblutionFacilities']
   //return  compliance.every(field => this.changeOfNameForm.get(field)?.valid);
   return true
  }
  isRecommendeValid():boolean{
    const recommendation=['recommendation']
   // return recommendation.every(field => this.changeOfNameForm.get(field)?.valid);
   return true
  }
  isFixturesValid(): boolean { 

    const fixtures = ['fixturesBarCounter', 'fixturesDisplayShelving','fixturesBarStools','fixturesTables','fixturesChairs','fixturesLightFittings'];
    //return fixtures.every(field => this.changeOfNameForm.get(field)?.valid);
    return true
  }
  isFormValid():boolean{
    return this.isInspectionReportGeneral() && this.isRelevantValid() && this.isComplianceValid() && this.isRecommendeValid()&& this.isFixturesValid();
  }


  deregistration = new Deregistration()

  submitChangePlan(): void {

    // let message = new Message();
    // message.success = "Application Captured"
    // //message.message = res.message;
    // this.toast.showSuccess(message);
    // setTimeout(() => {
    //   this.router.navigateByUrl('/non-compliance-deregistration-board/' + this.outletId);
    // }, 2000);

    // this.changeOfPlanForm.markAllAsTouched();
    // if (this.changeOfPlanForm.invalid || Object.keys(this.selectedFiles).length == 0) {
    //   this.highlightErrors();
    //   return;
    // }

    
   

    this.spinner.show();

    this.deregistration = Object.assign(this.deregistration, this.changeOfPlanForm.value);

    const formData = new FormData();
    formData.append('dao', new Blob([JSON.stringify(this.deregistration)], { type: 'application/json' }));

    this.reportDoc = this.reportFiles[0];
    formData.append('section29Notice', this.report);

    this.deregistrationService.initiateDeregistrationSection29(this.outletId, formData).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.showAlert('success', 'Application Captured');
      
        setTimeout(() => {
          this.route.navigateByUrl('/my-tasks')
        }, 5000);
      }, error: (err: any) => {
        this.spinner.hide();

      }
    });


  }//END SUBMIT

  navigateToBack() {
    setTimeout(() => {
      this.route.navigate(['/my-tasks']); 
    }, 0);
  }

  fileItems: FileItem[] = [
    { label: 'Upload Section 28 Notice', key: 'section28Notice', file: null },
  ]

  fileItems2: FileItem[] = [
    { label: 'Upload Section 29 Notice', key: 'section29Notice', file: null },
  ]

  viewFile(fileName: any): void {
    this.spinner.show();
    this.service.getFile1(this.caseId, fileName).subscribe({
      next: (response: Blob) => {
        this.spinner.hide();
        if (response instanceof Blob) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const blobUrl = window.URL.createObjectURL(blob);
  
          // Create a temporary link element for downloading
          const downloadLink = document.createElement('a');
          downloadLink.href = blobUrl;
          downloadLink.download = fileName; // Set the desired file name
          document.body.appendChild(downloadLink); // Append link to the body
          downloadLink.click(); // Trigger the download
          document.body.removeChild(downloadLink); // Clean up the DOM
          window.URL.revokeObjectURL(blobUrl); // Revoke the object URL
        } else {
          console.error('Error: Response is not a Blob');
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.error('Error downloading file:', error);
      }
    });
  }
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  selectFileReport(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = ".docx, .pdf"; // Adjust as needed for file types
    fileInput.onchange = (event: Event) => this.onFileSelectedRecommendation2(event);
    fileInput.click();
  }

  report!: File;
  async onFileSelectedRecommendation2(event: any) {
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
  private getOutletInformation(caseId: any): void {
    this.spinner.show()
    this.appointmentService.outletInfomationByCaseId(caseId).subscribe({
      next: (res: any) => {
        this.spinner.hide();
         
        this.changeOfPlanForm.patchValue(res);
      }, error: (err: any) => {
    
        this.spinner.hide();
      }
    });
    
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
    this.reportFiles.splice(index, 1);
    if (this.reportFiles.length === 0) {
      this.inputVisible = true;
    }
  }

  
}

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Deregistration, FileItem } from 'src/app/model/model';
import { AppointManagerService } from 'src/app/util/service/appoint-manager';
import { DeregistrationService } from 'src/app/util/service/deregistration-service';
import { GeneralService } from 'src/app/util/service/general-service';

@Component({
  selector: 'app-initiate-post-registration',
  templateUrl: './initiate-post-registration.page.html',
  styleUrls: ['./initiate-post-registration.page.scss'],
})
export class InitiatePostRegistrationPage implements OnInit {

  inputVisible = true;
  changeOfPlanForm!: FormGroup;
  reportFiles: { name: string, size: number }[] = [];
  @Input() showFailedCompliance = false;
  currentForm = 'landing';
  caseId: any;
  outletId: any;
  deregistration = new Deregistration();
  recommendation: any;
  fileItems: FileItem[] = [
    { label: 'Upload Section 28 Notice', key: 'section28Notice', file: null },
  ];

  fileItems2: FileItem[] = [
    { label: 'Upload Section 29 Notice', key: 'section29Notice', file: null },
  ];

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private spinner: NgxSpinnerService,
    private service: GeneralService,
    private routes: ActivatedRoute,
    private alertController: AlertController,
    private appointmentService: AppointManagerService,
    private deregistrationService: DeregistrationService,
    private loadingCtrl: LoadingController
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.routes.params.subscribe(params => {
      this.outletId = params['caseId'];
      this.caseId = this.outletId;
      this.getOutletInformation(this.outletId);
      
    });
  }

  initializeForm() {
    this.changeOfPlanForm = this.fb.group({
      //inspectionDate: ['', Validators.required],
      //recommendation: ['', Validators.required],
      //period: [''],
      inspectorRecommendation: ['', Validators.required],
      //rightToOccupy: ['', Validators.required],
      referenceNumber: ['', Validators.required],
      municipality: ['', Validators.required],
      outletName: ['', Validators.required],
      town: ['', Validators.required],
      prefferedNotificationMethod: ['', Validators.required],
      applicationPreparedByType2: ['Natural', Validators.required],
    });
  }

  toggleForms(form: string) {
    this.currentForm = form;
   
  }
  
  isInspectionReportGeneral():boolean{
    const reportGeneral= ['referenceNumber', 'municipality','outletName','town'];
     return reportGeneral.every(field => this.changeOfPlanForm.get(field)?.valid);
  }
  isRelevantValid():boolean{
    
    return true
  }
  isComplianceValid(): boolean {
   
   return true
  }
  isRecommendeValid():boolean{
    
   return true
  }
  isFixturesValid(): boolean { 

    
    return true
  }
  isBoardValid():boolean{
    const Board=['inspectorRecommendation']
    return Board.every(field => this.changeOfPlanForm.get(field)?.valid);
  }
  isFormValid():boolean{
    return this.isInspectionReportGeneral() &&this.isBoardValid();
  }

  submitChangePlan(): void {
    if (!this.isFormValid()) {
      this.showAlert('Error', 'Please fill in all required fields.');
      return;
    }

    this.spinner.show();
    const formData = new FormData();
    this.deregistration = Object.assign(this.deregistration, this.changeOfPlanForm.value);

    formData.append(
      'dao',
      new Blob([JSON.stringify(this.deregistration)], { type: 'application/json' })
    );

    this.deregistrationService.initiatePostDeregistration(this.outletId, formData).subscribe({
      next: () => {
        this.spinner.hide();
        this.showAlert('Success', 'Application captured successfully!');

        setTimeout(() => {
          this.route.navigateByUrl('/my-tasks', { skipLocationChange: true }).then(() => {
            this.route.navigate([this.route.url]);
          });
        }, 4000);
      },
      error: () => {
        this.spinner.hide();
        this.showAlert('Error', 'Failed to capture application.');
      },
    });
  }

  navigateToBack() {
    this.route.navigate(['/my-tasks']);
  }


  
  

 
  async saveFileLocally(blob: Blob, filePath: string): Promise<string> {
    
  try {
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/')); // Extract directory path

    // Ensure the directory exists before saving
    await Filesystem.mkdir({
      path: dirPath,
      directory: Directory.Documents,
      recursive: true, // Create parent directories if needed
    }).catch(() => {
      console.log("ℹ️ Directory already exists or could not be created");
    });

    // Convert Blob to Base64
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        // Write the file to storage
        await Filesystem.writeFile({
          path: filePath,
          data: base64Data.split(',')[1], // Remove base64 prefix
          directory: Directory.Documents,
          recursive: true,
        });

        console.log(" File saved at:", filePath);
        resolve(filePath);
      };
      reader.onerror = (error) => reject(error);
    });
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
}

  private getOutletInformation(caseId: any): void {
    this.spinner.show();
    this.appointmentService.outletInfomationByCaseId(caseId).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.changeOfPlanForm.patchValue(res);
      },
      error: () => {
        this.spinner.hide();
        this.showAlert('Error', 'Failed to load outlet information.');
      },
    });
  }

 
 



  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}




import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
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
    private deregistrationService: DeregistrationService,
    private platform: Platform,
     private loadingCtrl: LoadingController
  ) {

    this.changeOfPlanForm = this.fb.group({
      inspectionDate:['', Validators.required],
      recommendation: ['', Validators.required],
      referenceNumber:['', Validators.required],
      municipality:['', Validators.required],
      outletName:['', Validators.required],
      ward:['', Validators.required],

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
      
  
   

    
  }
  toggleForms(form: string) {
    this.currentForm = form;
   
  }
  isInspectionReportGeneral():boolean{
    const reportGeneral= ['referenceNumber', 'municipality','outletName','ward'];
     return reportGeneral.every(field => this.changeOfPlanForm.get(field)?.valid);
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
    const reportGeneral= ['recommendation'];
     return reportGeneral.every(field => this.changeOfPlanForm.get(field)?.valid);
  }
  isFixturesValid(): boolean { 

    const areNoticeFilesPresent = this.reportFiles && this.reportFiles.length > 0;
    return areNoticeFilesPresent;
  }
  isFormValid():boolean{
    return this.isInspectionReportGeneral() && this.isRelevantValid() && this.isComplianceValid() && this.isRecommendeValid()&& this.isFixturesValid();
  }


  deregistration = new Deregistration()

  submitChangePlan(): void {

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
          this.route.navigateByUrl('/my-tasks', { skipLocationChange: true }).then(() => {
            this.route.navigate([this.route.url]);
          });
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

  async viewFile(fileName: string): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Downloading...' });
    //this.spinner.show(); // Show loading spinner
    await loading.present();

    this.service.getFile1(this.caseId, fileName).subscribe({
      next: async (response: Blob) => {
        await loading.dismiss();
  
        if (response instanceof Blob) {
          try {
            // Ensure the file path does not contain duplicate directories
            const filePath = `section28/${fileName}.pdf`;
  
            console.log("✅ Corrected File URI:", filePath); // Debugging output
  
            const fileData = await this.saveFileLocally(response, filePath);
  
            this.showAlert('success', `Document downloaded successfully. To view the document, check the Documents folder, you will find it in the Section28 folder.`);


  
          } catch (error) {
            console.error('Error saving or opening file:', error);
            this.showAlert('Error', 'Failed to open the file.');
          }
        } else {
          console.error('Error: Response is not a Blob');
          this.showAlert('Error', 'Failed to download file.');
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.error('Error downloading file:', error);
        this.showAlert('Error', 'Failed to download file.');
      },
    });
  }
  
  

  // ✅ Function to Convert Blob to Base64
  async convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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

        console.log("✅ File saved at:", filePath);
        resolve(filePath);
      };
      reader.onerror = (error) => reject(error);
    });
  } catch (error) {
    console.error("❌ Error saving file:", error);
    throw error;
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

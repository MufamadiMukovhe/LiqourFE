
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
    selector: 'app-board-consideration-orhearing',
    templateUrl: './board-consideration-orhearing.page.html',
    styleUrls: ['./board-consideration-orhearing.page.scss'],
  })
  export class BoardConsiderationORHearingPage implements OnInit {
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
        this.getSection29Recommendation(this.outletId)
      });
    }
  
    initializeForm() {
      this.changeOfPlanForm = this.fb.group({
        inspectionDate: ['', Validators.required],
        recommendation: ['', Validators.required],
        period: [''],
        boardRecommendation: ['', Validators.required],
        rightToOccupy: ['', Validators.required],
        referenceNumber: ['', Validators.required],
        municipality: ['', Validators.required],
        outletName: ['', Validators.required],
        ward: ['', Validators.required],
        prefferedNotificationMethod: ['', Validators.required],
        applicationPreparedByType2: ['Natural', Validators.required],
      });
    }
  
    toggleForms(form: string) {
      this.currentForm = form;
     
    }
    
    isInspectionReportGeneral():boolean{
      const reportGeneral= ['referenceNumber', 'municipality','outletName','ward'];
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
      const Board=['boardRecommendation']
      return Board.every(field => this.changeOfPlanForm.get(field)?.valid);
    }
    isFormValid():boolean{
      return this.isInspectionReportGeneral() && this.isRelevantValid() && this.isComplianceValid() && this.isRecommendeValid()&& this.isFixturesValid() &&this.isBoardValid();
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
  
      this.deregistrationService.boardRecommendation(this.outletId, formData).subscribe({
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
              const filePath = `section29/${fileName}.pdf`;
    
              console.log("✅ Corrected File URI:", filePath); // Debugging output
    
              const fileData = await this.saveFileLocally(response, filePath);
    
              this.showAlert('success', `Document downloaded successfully. To view the document, check the Documents folder, you will find it in the Section29 folder.`);
  
  
    
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

    private getSection29Recommendation(caseId: any): void {
     
      this.deregistrationService.getSection29Recommendation(caseId).subscribe({
        next: (res: any) => {
         
           this.recommendation = res.recommendation;
          this.changeOfPlanForm.patchValue(res);
        }, error: (err: any) => {
        
         ;
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
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      });
  
      await alert.present();
    }
  
    deleteItemNotice(index: number) {
      this.reportFiles.splice(index, 1);
      if (this.reportFiles.length === 0) {
        this.inputVisible = true;
      }
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
  
  


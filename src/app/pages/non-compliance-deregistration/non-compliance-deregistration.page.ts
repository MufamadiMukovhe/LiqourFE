import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeOfName } from 'src/app/model/model';
import { AppointManagerService } from 'src/app/util/service/appoint-manager';
import { DeregistrationService } from 'src/app/util/service/deregistration-service';

@Component({
  selector: 'app-non-compliance-deregistration',
  templateUrl: './non-compliance-deregistration.page.html',
  styleUrls: ['./non-compliance-deregistration.page.scss'],
})
export class NonComplianceDeregistrationPage implements OnInit {
  currentForm: string = 'landing';
  noticeFiles: { name: string, size: number }[] = [];
  inputVisible: boolean = true;
  status:any;
  changeOfPlanForm!: FormGroup;
  outletId: any;
  noticeDoc: any;
  fileItems: { label: string; key: string }[] = []; // Array for managing file items
  constructor(
    private alertController: AlertController,
    private routes: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private appointmentService: AppointManagerService, 
    private spinner: NgxSpinnerService,
    private service: DeregistrationService
  ) { 

    this.changeOfPlanForm = this.formBuilder.group({
      inspectionDate:['', Validators.required],
      
      ecpNumber:[''],
      municipality:[''],
      outletName:[''],
      ward:[''],

      prefferedNotificationMethod: ['', Validators.required],
      applicationPreparedByType2: ['Natural', Validators.required]
    });
    this.route.params.subscribe(params => {
      this.outletId = +params['caseId'];
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.outletId = params['caseId'];
    });
    this.route.queryParams.subscribe(params => {
      const status = params['status'];
      this.status = status;
    });

    this.getOutletInformation(this.outletId);//when using outletID
  }
  notice!: File;
  async onFileSelectedRecommendation(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.notice = file;
      if (this.noticeFiles.length > 0) {
        this.noticeFiles.splice(0, 1, { name: file.name, size: file.size });
      } else {
        this.noticeFiles.push({ name: file.name, size: file.size });
      }
     
      this.inputVisible = false; 
        // Add the file to the fileItems array for rendering
        this.fileItems = [
          {
            label: file.name,
            key: URL.createObjectURL(file) // Create a URL for previewing the file
          }
        ];
    }
    
  }
  deleteItemNotice(index: number) {
    this.noticeFiles.splice(index, 1);
    if (this.noticeFiles.length === 0) {
      this.inputVisible = true;
    }
  }
  selectFileNotice(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = ".docx, .pdf"; // Adjust as needed for file types
    fileInput.onchange = (event: Event) => this.onFileSelectedRecommendation(event);
    fileInput.click();
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


  isInspectionReportGeneral():boolean{
    const reportGeneral= ['ecpNumber', 'municipality','outletName','ward'];
     return reportGeneral.every(field => this.changeOfPlanForm.get(field)?.valid);
  }

  isComplianceValid(): boolean {

    const areNoticeFilesPresent = this.noticeFiles && this.noticeFiles.length > 0;
    return areNoticeFilesPresent;
  
  }

  isFormValid(): boolean { 

    return this.isComplianceValid() && this.isInspectionReportGeneral()
    
  }
  toggleForms(form: string) {
    this.currentForm = form;
   
  }
  private getOutletInformation(caseId: any): void {
    this.spinner.show()

    if(this.status === 'Complete'){//BY CASE ID
      this.appointmentService.outletInfomationByCaseId(caseId).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          
          this.changeOfPlanForm.patchValue(res);
        }, error: (err: any) => {
        
          this.spinner.hide();
        }
      });
    }
    else{//BY OUTLET ID
      this.appointmentService.outletInfomation(caseId).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          
          this.changeOfPlanForm.patchValue(res);
        }, error: (err: any) => {
        
          this.spinner.hide();
        }
      });
    }

   
    
  }
  changeOfPlan = new ChangeOfName()
  submitChangePlan(): void {
  this.spinner.show();

    console.log("JSON.stringify(this.changeOfPlan)=" + JSON.stringify(this.changeOfPlan));

    const formData = new FormData();
    formData.append('nonComplianceDeregistration', new Blob([JSON.stringify(this.changeOfPlan)], { type: 'application/json' }));
    this.noticeDoc = this.noticeFiles[0];
    formData.append('section28Notice', this.notice);

    this.service.initiateDeregistrationSection28(this.outletId, formData).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.showAlert('success', 'Application Captured');
      
        setTimeout(() => {
          this.routes.navigateByUrl('/my-tasks', { skipLocationChange: true }).then(() => {
            this.routes.navigate([this.routes.url]);
          });
        }, 4000);
      }, error: (err: any) => {
        this.showAlert('success', err);
      }
    });

  }//END SUBMIT


  navigateToBack() {
    setTimeout(() => {
      this.routes.navigate(['/outlets']); 
    }, 0);
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

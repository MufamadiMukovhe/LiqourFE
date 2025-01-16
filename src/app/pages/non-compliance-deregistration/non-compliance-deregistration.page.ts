import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppointManagerService } from 'src/app/util/service/appoint-manager';

@Component({
  selector: 'app-non-compliance-deregistration',
  templateUrl: './non-compliance-deregistration.page.html',
  styleUrls: ['./non-compliance-deregistration.page.scss'],
})
export class NonComplianceDeregistrationPage implements OnInit {
  currentForm: string = 'landing';
  noticeFiles: { name: string, size: number }[] = [];
  inputVisible: boolean = true;
  
  changeOfPlanForm!: FormGroup;
  constructor(
    private alertController: AlertController,
    private routes: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private appointmentService: AppointManagerService, 
    private spinner: NgxSpinnerService,
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
  }

  ngOnInit() {
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
    const reportGeneral= ['ecpNumber','municipality','outletName'];
    return reportGeneral.every(field => this.changeOfPlanForm.get(field)?.valid);
    
  }

  isComplianceValid(): boolean {

    const complianceValid = ['questions'];
    return false
  
  }

  isRecommendationValid(): boolean { 

    const recommendationFields = ['recommendation', 'comments'];
    return false
  }
  toggleForms(form: string) {
    this.currentForm = form;
   
  }
  private getOutletInformation(caseId: any): void {
    this.spinner.show()

    if( true){//BY CASE ID
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
  navigateToBack() {
    setTimeout(() => {
      this.routes.navigate(['/outlets']); 
    }, 0);
  }
}

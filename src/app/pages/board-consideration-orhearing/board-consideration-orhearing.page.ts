
  import { Component, Input, OnInit } from '@angular/core';
  import { FormGroup, FormBuilder, Validators } from '@angular/forms';
  import { Router, ActivatedRoute } from '@angular/router';
  import { AlertController } from '@ionic/angular';
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
      private deregistrationService: DeregistrationService
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
          this.route.navigate(['/my-tasks'], { queryParams: { refresh: new Date().getTime() } });

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
  
    viewFile(fileName: string): void {
      this.spinner.show();
      this.service.getFile1(this.caseId, fileName).subscribe({
        next: (response: Blob) => {
          this.spinner.hide();
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error: () => {
          this.spinner.hide();
          this.showAlert('Error', 'Failed to download file.');
        },
      });
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
      this.spinner.show()
      this.deregistrationService.getSection29Recommendation(caseId).subscribe({
        next: (res: any) => {
          this.spinner.hide();
           this.recommendation = res.recommendation;
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
  
  


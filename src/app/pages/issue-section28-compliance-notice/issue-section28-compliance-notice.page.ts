import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeOfName } from 'src/app/model/model';
import { GeneralService } from 'src/app/util/service/general-service';
import { Toast } from 'src/app/util/service/services/toast';

@Component({
  selector: 'app-issue-section28-compliance-notice',
  templateUrl: './issue-section28-compliance-notice.page.html',
  styleUrls: ['./issue-section28-compliance-notice.page.scss'],
})
export class IssueSection28ComplianceNoticePage implements OnInit {

  outletId: any;
    action: any;
    caseId: any;
    noticeDoc: any;
    noticeFiles: { name: string, size: number }[] = [];
    reportFiles: { name: string, size: number }[] = [];
    inputVisible: boolean = true;
    changeOfNameForm!: FormGroup;
    invalidLabels: string[] = [];
    reportDoc:any;
    
    constructor(
      private alertController: AlertController,private router:Router,
      private formBuilder: FormBuilder, private service: GeneralService, private route: ActivatedRoute
      , private spinner: NgxSpinnerService, private toast: Toast,
    ) {
      this.changeOfNameForm = this.formBuilder.group({
        newName: ['', Validators.required],
      })
     }
  
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.outletId = params['outletid'];
        this.caseId = params['caseId'];
      });
  
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
  
    selectFileReport(): void {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = ".docx, .pdf"; // Adjust as needed for file types
      fileInput.onchange = (event: Event) => this.onFileSelectedRecommendation2(event);
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
  
    navigateToBack() {
      setTimeout(() => {
        this.router.navigate(['/my-tasks']); 
      }, 0);
    }
    changeName = new ChangeOfName()
    submit(): void {
  
       this.spinner.show()
  
      this.changeName = Object.assign(this.changeName, this.changeOfNameForm.value);
  
      const formData = new FormData();
      formData.append('comment', new Blob([JSON.stringify(this.changeName)], { type: 'application/json' }));
  
      this.noticeDoc = this.noticeFiles[0];
      formData.append('section28Notice', this.notice);
  
  
    
        this.service.issueSection28Notice(this.caseId, formData).subscribe({
          next: (res: any) => {
            this.spinner.hide();
            console.log(res)
            this.showAlert('success', 'Section 28 Notice Uploaded');
          
            setTimeout(() => {
              this.router.navigateByUrl('/my-tasks', { skipLocationChange: true }).then(() => {
                this.router.navigate([this.route.url]);
              });
            }, 5000);
      
          }, error: (err: any) => {
            this.spinner.hide()
            console.log(err)
           
          }
        })
    
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
  
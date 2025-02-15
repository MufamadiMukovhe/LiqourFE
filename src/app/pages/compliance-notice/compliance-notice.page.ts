import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppointManagerService } from 'src/app/util/service/appoint-manager';
import { DeregistrationService } from 'src/app/util/service/deregistration-service';
import {  Section54 } from '../../model/model';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-compliance-notice',
  templateUrl: './compliance-notice.page.html',
  styleUrls: ['./compliance-notice.page.scss'],
})
export class ComplianceNoticePage implements OnInit {
  currentForm: string = 'landing';
  registrationForm!: FormGroup;
  form!: FormGroup;
  recommendationForm!: FormGroup;
  deregistrationForm!: FormGroup;
  section54Form!: FormGroup

  caseId:any;
  constructor(private title: Title, private route: Router, private formBuilder: FormBuilder, private service: DeregistrationService,
    private spinner: NgxSpinnerService, private routes: ActivatedRoute, private appointmentService: AppointManagerService, private alertController:AlertController) {

      this.recommendationForm = this.formBuilder.group({
        comments: [''], recommendation: ['', Validators.required]
      })

    this.section54Form = this.formBuilder.group({
      comments: ['']
    })

    this.deregistrationForm = this.formBuilder.group({
      submissionTitle: ['', Validators.required],
      discussion: ['', Validators.required],
      recommendation: ['', Validators.required],
      background: ['', Validators.required],
      purpose: ['', Validators.required],

      natureOfComplaint: ['', Validators.required],
    });
    this.healthCheckForm = this.formBuilder.group({
      questions: this.formBuilder.array(this.questions.map(() => this.createQuestionGroup()))
    });
  }

    get questionControls() {
      return (this.healthCheckForm.get('questions') as FormArray).controls;
    }
  
    createQuestionGroup(): FormGroup {
      return this.formBuilder.group({
        questionstr: [''] ,
        answer: ['', Validators.required] // Control for radio button
      });
    }
  
    get questionsArray(): FormArray {
      return this.healthCheckForm.get('questions') as FormArray;
    }

  healthCheckForm!: FormGroup;

  questions = [
    { no: '(a)', question: 'Is the valid registration visible display?' },//index = 0
    { no: '(b)', question: 'Is the drinking area clearly demarcated?' },//index = 1
    { no: '(c)', question: 'Is there any person/s under the age of 18 years in the drinking area?' },//index = 2
    { no: '(d)', question: 'Is there sale of liquor to persons under the age of 18? Section 38 of the Act' },//index = 3
    { no: '(e)', question: 'Is there a separate entrance to the liquor trading area from the dwelling?' },//index = 4
    { no: '(f)', question: 'Are there separate toilets for males and females?' },//index = 5
    { no: '(g)', question: 'Are the toilets hygienic and in good working order?' },//index = 6
    { no: '(h)', question: 'Are trading hours adhered to? Educate the registrant in line with the applicable municipal Bylaws' },//index = 7
    { no: '(i)', question: 'Is music played audible beyond boundary perimeter of the premises?' },//index = 8
    { no: '(j)', question: 'Are the speakers or audio equipment placed inside the premises?' },//index = 9
    { no: '(k)', question: 'Is there loud noise by patrons?' },//index = 10
    { no: '(l)', question: 'Does drinking taking place in demarcated drinking area?' },//index = 11
    { no: '(m)', question: 'Are cars parked not obstructing entry to the neighbour’s driveways?' },//index = 12
    { no: '(n)', question: 'Are people sitting in motor vehicles outside the premises?' },//index = 13
    { no: '(o)', question: 'Is there security in and around the outlet?' },//index = 14
    { no: '(p)', question: 'Does the registrant ensure that no firearms and/or any kind of weapon may find their way into the registered outlet?' },//index = 15
    { no: '(q)', question: 'Is there a manager appointed in terms of Section 40 of the Act?' },//index = 16
    { no: '(r)', question: 'Does the registrant comply with municipal Health and Safety Regulations?' },//index = 17
    { no: '(s)', question: 'Are the registered premises being rented?' },//index = 18
  ];


  ngOnInit(): void {
    this.routes.params.subscribe(params => {
      this.caseId = params['caseId'];
      console.log("this.caseId=" + this.caseId);
    });
    this.spinner.show()
    this.form = this.formBuilder.group({
      
      //outletName,registeredOwner,referenceNumber,address,contactDetails

      outletName:['',Validators.required],
      registeredOwner:['',Validators.required],
      referenceNumber:['',Validators.required],
      address:['',Validators.required],
      contactDetails:['',Validators.required],

    });

    this.title.setTitle('Section 54 Notice');

    this.appointmentService.outletInfomationByCaseId(this.caseId).subscribe({
      
      next: (res: any) => {
        console.log('res='+ res);
        this.spinner.hide();
         
        this.form.patchValue(res);
      }, error: (err: any) => {
        
        this.spinner.hide();
      }
    });

  }

  toggleForms(form: string) {
    this.currentForm = form;
   
  }

 
  isGeneralValid():boolean{
    const reportGeneral= ['outletName','registeredOwner','referenceNumber','address','contactDetails'];
    return reportGeneral.every(field => this.form.get(field)?.valid);
  }
  isLiquorValid():boolean{
    const complianceValid = ['questions'];
    return complianceValid.every(field => this.healthCheckForm.get(field)?.valid);
  }
  
  isFormValid():boolean{
    return this.isGeneralValid() && this.isLiquorValid()
  }

  
  section = new Section54();
  saveSection54(): void {
    this.spinner.show()
   
    this.section = Object.assign(this.section, this.healthCheckForm.value);

    for (const field in this.healthCheckForm.controls) { // 'field' is a string
      console.log(this.healthCheckForm.controls[field].value);
    }

    const formData = new FormData();
    formData.append('section54', new Blob([JSON.stringify(this.section)], { type: 'application/json' }));
    formData.append('form', new Blob([JSON.stringify(this.form.value)], { type: 'application/json' })); 

   
    this.service.section54Digital(this.caseId, formData).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        console.log("sucesss");
        this.showAlert('success', 'Description of Premises Captured');
        setTimeout(() => {
          this.route.navigateByUrl('/my-tasks', { skipLocationChange: true }).then(() => {
            this.route.navigate([this.route.url]);
     
          });
        }, 5000);
      }, error: (err: any) => {
        console.log("error");
        //this.toast.showError(err);
        this.spinner.hide();
        this.showAlert('success', 'Description of Premises Captured');
        setTimeout(() => {

          this.route.navigateByUrl('/my-tasks', { skipLocationChange: true }).then(() => {
            this.route.navigate([this.route.url]);
            
          });
        }, 5000);
      }
    });
  }


  navigateToBack() {
    setTimeout(() => {
      this.route.navigate(['/my-tasks']); 
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

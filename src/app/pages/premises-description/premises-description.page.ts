import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeOfName } from 'src/app/model/model';
import { GeneralService } from 'src/app/util/service/general-service';
import { GeolocationService } from 'src/app/util/service/geolocation.service';

@Component({
  selector: 'app-premises-description',
  templateUrl: './premises-description.page.html',
  styleUrls: ['./premises-description.page.scss'],
})
export class PremisesDescriptionPage implements OnInit {

  @Input() showFailedCompliance: boolean = false;
  currentForm: string = 'landing';
  registrationForm!: FormGroup;
  recommendationForm!: FormGroup;
  changeOfNameForm!: FormGroup;
  caseId: any;
caseNo: any;
  constructor(
    private fb: FormBuilder,
    private geolocation: GeolocationService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private service: GeneralService,
    private routes: ActivatedRoute,
    private alertController:AlertController
  ) {


  
}

  ngOnInit() {
    this.routes.paramMap.subscribe(param => {
      this.caseId = param.get('caseId');

        

        console.log("caseId=" + this.caseId);
      
    })
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
    return reportGeneral.every(field => this.changeOfNameForm.get(field)?.valid);
  }
  isRelevantValid():boolean{
     const relevent =['anyRelevantComment']
    return relevent.every(field => this.changeOfNameForm.get(field)?.valid);
  }
  isComplianceValid(): boolean {
   const compliance= ['constructionBuildingWalls','constructionRoof','constructionWindows','constructionDoors','constructionAdequateAblutionFacilities']
   return  compliance.every(field => this.changeOfNameForm.get(field)?.valid);
  
  }
  isRecommendeValid():boolean{
    const recommendation=['recommendation']
    return recommendation.every(field => this.changeOfNameForm.get(field)?.valid);
  }
  isFixturesValid(): boolean { 

    const fixtures = ['fixturesBarCounter', 'fixturesDisplayShelving','fixturesBarStools','fixturesTables','fixturesChairs','fixturesLightFittings'];
    return fixtures.every(field => this.changeOfNameForm.get(field)?.valid);
  }
  isFormValid():boolean{
    return this.isInspectionReportGeneral() && this.isRelevantValid() && this.isComplianceValid() && this.isRecommendeValid()&& this.isFixturesValid();
  }


  changeName = new ChangeOfName()
  submitChangeOfName(): void {
    this.spinner.show();
    // if (this.changeOfNameForm.invalid) {
    //   this.toast.incompleteForm();
    //   return;
    // }
    //  this.spinner.show()

    this.changeName = Object.assign(this.changeName, this.changeOfNameForm.value);

    const formData = new FormData();
    formData.append('descriptionPremises', new Blob([JSON.stringify(this.changeName)], { type: 'application/json' }));
    console.log("this.caseId=" + this.caseId)
    console.log("change=" +  new Blob([JSON.stringify(this.changeName)]));
  
    this.service.saveDescriptionPremises(formData, this.caseId).subscribe({
    next: (res: any) => {
      this.spinner.hide();
     
      console.log("Description of Premises Captured")
      this.showAlert('success', 'Description of Premises Captured');
      setTimeout(() => {
        this.route.navigateByUrl('/my-tasks')
      }, 5000);
    }, error: (err: any) => {
      this.spinner.hide()
      this.showAlert('error',err);
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


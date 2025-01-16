import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  constructor(
    private fb: FormBuilder,
    private geolocation: GeolocationService,
    private route:Router
  ) { this.healthCheckForm = this.fb.group({
    questions: this.fb.array(this.questions.map(() => this.createQuestionGroup()))
  }); 
  this.recommendationForm = this.fb.group({
    comments: [''], recommendation: ['', Validators.required]
  })


  
}

  ngOnInit() {

    this.geolocation.getCurrentLocation()
    .then(position => {
      const spatialData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      this.registrationForm.get('spatialDataCoordinates')?.patchValue(spatialData);
    })
    this.registrationForm = this.fb.group({
      date: ['', Validators.required],
      cityTown: ['', Validators.required],
      ecpNumber: ['', Validators.required],
      registrationCategory: ['', Validators.required],
      businessName: ['', Validators.required],
      registeredPerson: ['', Validators.required],
      telephoneNumber: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]], // Email validation
      businessAddress: this.fb.group({
        streetNumber: ['', Validators.required],
        streetName: ['', Validators.required],
        villageSuburb: ['', Validators.required]
      }),
      spatialDataCoordinates: this.fb.group({
        latitude: ['', Validators.required],
        longitude: ['', Validators.required]
      }),
      localMunicipality: ['', Validators.required],
      districtMunicipality: ['', Validators.required],
      typeOfRegisteredPerson: ['', Validators.required],
      section40ManagerAppointed: this.fb.group({
        name: ['', Validators.required],
        idNumber: ['', Validators.required]
      })
    });
    
  }
  toggleForms(form: string) {
    this.currentForm = form;
   
  }
  isInspectionReportGeneral():boolean{
    const reportGeneral= ['date', 'cityTown','ecpNumber','registrationCategory','businessName','registeredPerson','telephoneNumber','emailAddress','businessAddress','businessAddress','spatialDataCoordinates','localMunicipality','districtMunicipality','typeOfRegisteredPerson','section40ManagerAppointed'];
    return reportGeneral.every(field => this.registrationForm.get(field)?.valid);
  }

  isComplianceValid(): boolean {

    const complianceValid = ['questions'];
    return complianceValid.every(field => this.healthCheckForm.get(field)?.valid);
  
  }

  isRecommendationValid(): boolean { 

    const recommendationFields = ['recommendation', 'comments'];
    return recommendationFields.every(field => this.recommendationForm.get(field)?.valid);
  }

  

  healthCheckForm!: FormGroup;
  questions = [
    { no: 1, check: 'Documentation', reference: 'Registration', question: 'Does the premises have a valid certificate/renewal?' },
    { no: 2, check: 'Documentation', reference: 'Registration', question: 'Does the registrant have the title deed or letter of consent from the owner of the premises?' },
    { no: 3, check: 'Practice', reference: 'Registration', question: `Has the registrant made any structural changes to the licensed premises without the Board's` },
    { no: 4, check: 'Practice', reference: 'Controlling interest', question: 'Has the registrant sold a controlling interest in the business without the approval of the Board?' },
    { no: 5, check: 'Practice', reference: 'Storage and display of liquor', question: 'Is the liquor for sale displayed and stored in only the portion of the premises agreed to on the plan?' },
    { no: 6, check: 'Practice', reference: 'Business Management', question: 'Has the registrant appointed a manager to run the business?' },
    { no: 7, check: 'Practice', reference: 'Other business on the premises', question: 'Is the sale of liquor the primary business on the premises with the exception of general dealers, theatres, restaurants and sleeping accommodation?' },
    { no: 8, check: 'Practice', reference: 'Prohibition on sale of liquor to certain persons', question: 'Does the registrant understand that he/she may not sell liquor to any person who is under the age of 18 or allow a person under the age of 18 to be in any restricted part of the premises?  A person under 18 may enter the outlet ' },
    { no: 9, check: 'Training & Education', reference: 'Secondary supply of liquor to a minor', question: 'Does the outlet owner/manager understand that it is an offence for any person to buy liquor for and behalf of a person under the age of 18?' },
    { no: 10, check: 'Training & Education', reference: 'Trading hours', question: 'Does the registrant understand that he/she may trade liquor on any day of the week but within the times stipulated in the municipality bylaws?' },
    { no: 11, check: 'Training & Education', reference: 'Limitations on employers', question: 'Does the registrant understand that he/she cannot employ a person under the age of 18 in connection with the sale or supply of liquor unless the person is above the age of 16 and undergoing training or is an apprentice?' },
    { no: 12, check: 'Training & Education', reference: 'Duty to produce documents', question: 'Does the registrant understand that any person who is in possession of a document relevant to the inspection must produce it on request?' },
    { no: 13, check: 'Training & Education', reference: 'Closing of registered premises', question: 'Does the registrant understand that an inspector or chairperson of the Board may order the owner/manager to close the licensed premises if there is any riots, public disturbance, or threatening actions close to or at the licensed premises?' },
    { no: 14, check: 'Training & Education', reference: 'Prohibited concoctions and drink', question: 'Does the registrant understand that he/she must not sell any prohibited drinks and concoctions? (by the fermentation of treacle, sugar or other substances and known as isishimiyana, hopana, qediviki, skokiaan, uhali or Barberton, but excluding indigenous qhilika)' },
    { no: 15, check: 'Training & Education', reference: 'Offences regarding the trading in liquor', question: 'Does the registrant understand that no manufacturer or wholesaler may give or lend any money to a retailer for equipping, maintaining or conducting the registered premises?' },
    { no: 16, check: 'Training & Education', reference: 'General offences', question: 'Does the registrant understand that it is an offence to supply liquor to an employee as wages?' },
    { no: 17, check: 'Training & Education', reference: 'Responsibility of registered persons for other persons', question: 'Does the registrant understand that drug trafficking and prostitution on the registered premises is an offence?' },
    { no: 18, check: 'Training & Education', reference: 'Liquor premises should be Weapon free', question: 'Does the outlet owner/manager understand that no weapons or sharp objects must be allowed inside the premises?' },
    { no: 19, check: 'Training & Education', reference: 'Foetal Alcohol Syndrom', question: 'Does the outlet owner understand the dangers of serving alcohol to pregnant women? (Physical and mental damage in a child due to alcohol exposure while in the womb).' },
    { no: 20, check: 'Training & Education', reference: 'Patron Behavior', question: 'Does the registrant/manager understand that patrons must not park such that they obstruct the neighbours? ' },
    { no: 21, check: 'Premises', reference: 'Structural changes', question: 'The premises are still as indicated in the plan submitted to the board?' },
    { no: 22, check: 'Premises', reference: 'Hygienic conditions', question: 'Ablution facilities are hygienically clean and fully functional' },
  ];


  createQuestionGroup(): FormGroup {
    return this.fb.group({
      answer: ['', Validators.required] // Control for radio button
    });
  }

  goToLink(url: string) {
    

    //http://localhost:8089
    //http://172.16.190.54:8089
    window.open("http://172.16.190.54:8089/downloadtnc/" +  "_blank");//TODO move URL to properties file

  }

  navigateToBack() {
    setTimeout(() => {
      this.route.navigate(['/outlets']); 
    }, 0);
  }
}


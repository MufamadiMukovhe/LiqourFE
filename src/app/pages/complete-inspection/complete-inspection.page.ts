
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, HostListener, OnDestroy, Input, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, PopoverController } from '@ionic/angular';
import { StorageService } from 'src/app/util/service/storage.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ViewImagePage } from '../view-image/view-image.page';
import { environment } from 'src/environments/environment.prod';
import { Geolocation } from '@capacitor/geolocation';
import { NgxSpinnerService } from 'ngx-spinner';
import { OfflineService } from 'src/app/util/service/services/offline.service';
import { GeolocationService } from 'src/app/util/service/geolocation.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { DatabaseSQLiteService } from 'src/app/util/service/database-sqlite.service';
import { Location } from '@angular/common';







@Component({
  selector: 'app-complete-inspection',
  templateUrl: './complete-inspection.page.html',
  styleUrls: ['./complete-inspection.page.scss'],
})
export class CompleteInspectionPage implements OnInit {

  selectedOption: string = '';
  reportFiles: { name: string, size: number }[] = [];
  noticeFiles: { name: string, size: number }[] = [];
  currentForm: string = 'landing';
  selectedRadioValue: string | null = null; 
  inputVisible: boolean = true; 
  isNetworkConnected: boolean = true; // Flag to track network status
  dateFormatPlaceholder: string = "YYYY-MM-DD";
  isPhotoAvailable:boolean=false;
  test: String = '';
  isHidden: boolean = true;

  selectedSections: any[] = [];

  imageSources: { src: string, description: string }[] = [];
  dropdownVisible: { [index: string]: boolean } = {};

  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  completeReportForm: FormGroup;
  caseId: any;
  caseNo: any;

  
  private geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?key=${environment.googleMapsApiKey}";

  inspectionReport: any;
  reportDoc: any;
  noticeDoc: any;

  constructor(
    private router: Router,
    private eRef: ElementRef,
    private alertController: AlertController,
    private fb: FormBuilder,
    private storageService: StorageService,
    private aRoute: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private spinner: NgxSpinnerService,
    private offlineService: OfflineService,
    private popoverController: PopoverController,
    private geolocationService: GeolocationService,
    private imageStorageService: StorageService,
    private location: Location,
    
    
  ) {
    this.completeReportForm = this.fb.group({
      contactPerson: ['', Validators.required],
      sections:[[]],
      //inspectionDate: ['', Validators.required],
      appointmentSet: ['', Validators.required],
      consultedOrFound: ['', Validators.required],
      applicantIndicatedPersonAtPremises: ['', Validators.required],
      canPersonBeFound: [Validators.required],
      interestInLiquorTrade: ['', Validators.required],
      issuedComplience: ['', Validators.required],
      complaintsReceived: ['', Validators.required],
      rightToOccupy: ['', Validators.required],
      leaseAttached: ['', Validators.required],
      situatedInRightAddress: ['', Validators.required],
      inLineWithSubmittedApplication: ['', Validators.required],
      premisesSuitable: ['', Validators.required],
      latitude:['',Validators.required, ],
      longitude:['',Validators.required, ],
      ablutionFacilityInOrder: ['', Validators.required],
      readyForBusiness: ['', Validators.required],
      formServedToCorrectWardCommittee: ['', Validators.required],
      confirmedByCouncillor: ['', Validators.required],
      wardCommiteeReport: ['', Validators.required],
      communityConsultation: ['', Validators.required],
      educationalInstitution: ['', Validators.required],
      formServedAtEducationInstitution: ['', Validators.required],
      placeOfWorship: ['', Validators.required],
      formServedAtPlaceOfWorship: ['', Validators.required],
      recommendation: ['', Validators.required],
      comments: ['', Validators.required],
      //comments1:['', Validators.required],
      formObjectionsInspection:['', Validators.required],
      formObjectionsReceived:['', Validators.required],
      formApplicantRespondedToObjections:['', Validators.required],
      complianceSectionC:['', Validators.required],
      complianceSectionB:['', Validators.required],
      complianceSectionA:['', Validators.required],
      ablutionFacilities:['', Validators.required],
      storageRoom:['', Validators.required],
      demarcatedDrinkingArea:['', Validators.required],
      displayAreaShelves:['', Validators.required],
      counterPointOfSake:['', Validators.required],
      buildingStructureAndMeansOfCommunication:['', Validators.required],
      rightToOccupyPremises:['', Validators.required],
      applicant:['', Validators.required],
        /**Comments */
        formApplicantRespondedToObjectionsComment:[''],
        formObjectionsReceivedComment:[''],
        formObjectionsInspectionComment:[''],
        formServedAtPlaceOfWorshipComment:[''],
        placeOfWorshipComment:[''],
        formServedAtEducationInstitutionComment:[''],
        educationalInstitutionComment:[''],
        communityConsultationComment:[''],
        wardCommiteeReportComment:[''],
        confirmedByCouncillorComment:[''],
        formServedToCorrectWardCommitteeComment:[''],
        readyForBusinessComment:[''],
        ablutionFacilityInOrderComment:[''],
        premisesSuitableComment:[''],
        inLineWithSubmittedApplicationComment:[''],
        situatedInRightAddressComment:[''],
        leaseAttachedComment:[''],
        rightToOccupyComment:[''],
        complaintsReceivedComment:[''],issuedComplienceComment:[''],interestInLiquorTradeComment:[''],canPersonBeFoundComment:[''],
        applicantIndicatedPersonAtPremisesComment:[''],consultedOrFoundComment:[''],appointmentSetComment:['']
    })

  
  }
  // ngOnDestroy(): void {
  //   throw new Error('Method not implemented.');
  // }

  ecp:string | null=""
  appType:any
  

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.caseNo = param.get('caseId');
      this.appType = param.get('appType');
  
      if (this.appType === 'ApplicationForSpecialEvent') {
        this.communityConsult();
      }
  
      // Restore saved form data using the caseId as the key
      const savedForm = localStorage.getItem(`completeReportForm_${this.caseNo}`);
      if (savedForm) {
        this.completeReportForm.patchValue(JSON.parse(savedForm));
      }
  
      // Auto-save form on value changes, using caseId as the key
      this.completeReportForm.valueChanges.subscribe(value => {
        localStorage.setItem(`completeReportForm_${this.caseNo}`, JSON.stringify(value));
      });
    });


  
    this.getCurrentPosition();
    this.getCameraPermission;

    //this.loadFileByCaseId();
  }

  async getCameraPermission()
  {
    const permissionStatus = await Camera.requestPermissions();
    console.log(permissionStatus);
    
  }

  sections = [
    {
      name: 'Section 22 (2) (a)',
      description: 'An application for registration contemplated in subsection (1) must be made by submitting to the board-',
      notes: '',
      show: false,
      subsections: [
        {
          name: '(i) the particulars of the applicant which, in the case of-',
          show: false,
          subsubsections: [
            {
              name: '(aa) a natural person, must include his or her full name, identity number and residential address and a statement that he or she is not disqualified for registration in terms of section 21;',
              checked: false
            },
            {
              name: '(bb) a company or close corporation must include its full name, registration number and the address of its registered office;',
              checked: false
            },
            {
              name: '(cc) a company, except for a company which is listed on the Johannesburg Stock Exchange, must include the names, identity numbers and residential addresses of all shareholders and a statement that none of them is disqualified from registration in terms of section 21;',
              checked: false
            },
            {
              name: '(dd) a close corporation, the names, identity numbers and residential addresses of all its members and a statement that none of them is disqualified from registration in terms of section 21;',
              checked: false
            },
            {
              name: '(ee) a trust, must include the names, identity numbers and residential addresses of all its trustees and known beneficiaries, and a statement that none of them is disqualified from registration in terms of section 21;',
              checked: false
            },
            {
              name: '(ff) an association or partnership, must include the names, identity numbers and residential addresses of all its members or partners, and a statement that none of them is disqualified from registration in terms of section 21;',
              checked: false
            }
          ]
        }
      ]
    },
    /*{
      name: 'Section 22 (2) (a)',
      show: false,
      notes: '',
      subsections: [
        {
          name: '(ii) the physical address and the erf, street or farm number and a description of the premises from which the applicant intends to sell liquor, including a plan of the premises?',

          show: false,
          subsubsections: []
        }
      ]

    },
    {
      name: 'Section 22 (2) (a)',
      show: false,
      notes: '',
      subsections: [
        {
          name: '(iii) the category in respect of which registration is being sought?',
          show: false,
          subsubsections: []
        },
        {
          name: '(iii) the category in respect of which registration is being sought?',
          show: false,
          subsubsections: []
        },
        {
          name: '(iv) in respect of the premises from which the applicant intends to sell liquor, whether the premises concerned are',
          show: false,
          subsubsections: [
            {
              name: '(aa) in existence; or',
              checked: false
            },
            {
              name: '(bb) the premises concerned are not yet in existence, in which case the applicant must furnish details of the steps to be taken in the event of the application for registration being approved to construct the premises;',
              checked: false
            }
          ]
        }

      ]

    },
    {
      name: 'Section 22 (2) (a)',
      show: false,
      notes: '',
      subsections: [
        {
          name: '(iv) in respect of the premises from which the applicant intends to sell liquor, whether the premises concerned are',
          show: false,
          subsubsections: [
            {
              name: '(aa) in existence; or',
              checked: false
            },
            {
              name: '(bb) the premises concerned are not yet in existence, in which case the applicant must furnish details of the steps to be taken in the event of the application for registration being approved to construct the premises;',
              checked: false
            }
          ]
        }
      ]
    },*/
    {
      name: 'Section 22 (2) (b) ',
      show: false,
      notes: '',
      subsections: [
        {
          name: 'other information that may be required by the board to enable the board to determine whether or not the applicant meets the requirements of registration?',
          show: false,
          subsubsections: []
        },
      ]
    },
    {
      name: 'Section 22 (2) (d)',
      notes: '',
      description: 'proof of service of the notice contemplated in the prescribed manner on the-',
      subsections: [
        {
          name: '(i) ward committee which must on receipt of the notice consult the community of the area where the premises are situated and simultaneously submit a report to the board and the relevant municipal council',
          subsubsections: []
        },
      ]
    },
    {
      name: 'Section 22 (2)',
      notes: '',
      subsections: [
        {
          name: '(1) Not later than 28 days after the application was lodged with the board, any person may lodge-',
          description: 'Representations or objections',
          subsubsections: [
            {
              name: '(a) written representation in support of; or',
              checked: false
            },
            {
              name: 'written objection to,',
              checked: false
            }
          ]
        },
        {
          name: '(2) Such representation or objection must be lodged in duplicate, be fully motivated and must',
          subsubsections: [
            {
              name: '(a) clearly indicate the name, identity number, residential and postal address and telephone number or e-mail address, if any, and where applicable, its registration number and address of its registered office, of the person making the representations or the objector; and',
              checked: false
            },
            {
              name: 'clearly identify the application concerned',
              checked: false
            }
          ]
        },
      ]
    }
  ];

  
  getNotes(section: any, event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    const selectedSectionIndex = this.selectedSections.findIndex(selectedSection => selectedSection.name === section.name);

    if (section.show) {
      this.selectedSections[selectedSectionIndex].notes = textarea.value;
    } else {
      if (selectedSectionIndex !== -1) {
        const selectedSubsectionIndex = this.selectedSections[selectedSectionIndex].notes === textarea.value;
        if (selectedSubsectionIndex) {
          this.selectedSections[selectedSectionIndex].subsections.splice(selectedSubsectionIndex, 1);
        }
      }
    }

  }

  
  toggleSection(section: any) {
    section.show = !section.show;

    const selectedSectionIndex = this.selectedSections.findIndex(selectedSection => selectedSection.name === section.name);

    if (section.show) {
      if (selectedSectionIndex === -1) {
        const selectedSection = {
          name: section.name,
          subsections: []
        };
        this.selectedSections.push(selectedSection);
      }
    } else {
      if (selectedSectionIndex !== -1) {
        this.selectedSections.splice(selectedSectionIndex, 1);
        section.notes = '';
      }
    }
  }


  // async loadFileByCaseId() {
  //   const file = await this.dbSql.getFileByCaseId(this.caseNo);
  //   if (file) {
  //     this.reportFiles.push(file);
  //     console.log('Loaded file:', file);
  //   } else {
  //     console.log('No file found for caseId:', this.caseNo);
  //   }
  // }




  
  communityConsult(){

    this.completeReportForm.patchValue({
      complianceSectionA:'N/A',
      complianceSectionB:'N/A',
      complianceSectionC:'N/A',
      ablutionFacilities:'N/A',
      storageRoom:'N/A',
      demarcatedDrinkingArea:'N/A',
      displayAreaShelves:'N/A',
      counterPointOfSake:'N/A',
      buildingStructureAndMeansOfCommunication:'N/A',
      rightToOccupyPremises:'N/A',
      applicant:'N/A',
      rightToOccupy:'3',
      leaseAttached:'3',
      situatedInRightAddress:'3',
      inLineWithSubmittedApplication:'3',
      premisesSuitable:'3',
      ablutionFacilityInOrder:'3',
      readyForBusiness:'3',

    })
  }

 
  
  //General Valid
  isGeneralFormValid(): boolean {
    const generalFields = ['contactPerson', 'latitude', 'longitude'];
    return generalFields.every(field => this.completeReportForm.get(field)?.valid);
  }
  //Applicant Valid
  isApplicantFormValid(): boolean {
    const applicantFields = ['appointmentSet', 'consultedOrFound', 'applicantIndicatedPersonAtPremises', 'canPersonBeFound', 'interestInLiquorTrade','issuedComplience', 'complaintsReceived'];
    return applicantFields.every(field => this.completeReportForm.get(field)?.valid);
  }
  //comment Valid
  isCommentForm():boolean {
    const commentsFields= [ 'applicant','rightToOccupyPremises','buildingStructureAndMeansOfCommunication','counterPointOfSake','displayAreaShelves','demarcatedDrinkingArea','storageRoom','ablutionFacilities','complianceSectionA','complianceSectionB','complianceSectionC'];
    return  commentsFields.every(field=>this.completeReportForm.get(field)?.valid);
  }
  //Documentation Valid
  isDocumentationFormValid(): boolean {
    const documentationFields = ['rightToOccupy', 'leaseAttached', 'situatedInRightAddress', 'inLineWithSubmittedApplication', 'premisesSuitable','ablutionFacilityInOrder', 'readyForBusiness'];
    return documentationFields.every(field => this.completeReportForm.get(field)?.valid);
  }

  //Documentation Valid
  isCommunityFormValid(): boolean {
    const communityFields = ['formServedToCorrectWardCommittee', 'confirmedByCouncillor', 'wardCommiteeReport', 'communityConsultation', 'educationalInstitution','formServedAtEducationInstitution', 'placeOfWorship', 'formServedAtPlaceOfWorship'];
    const formObjectionsInspection = this.completeReportForm.get('formObjectionsInspection');  
    return communityFields.every(field => this.completeReportForm.get(field)?.valid);
  }
  
   //Recommendation Valid
   isRecommendationFormValid(): boolean { 
    const recommendationFields = ['recommendation','comments'];
    const areFieldsValid = recommendationFields.every(field => this.completeReportForm.get(field)?.valid);
    const areNoticeFilesPresent = this.noticeFiles && this.noticeFiles.length > 0;
    return areFieldsValid;
  }

  /*InspectionReport 
  isInspectionReport(){
    const areReportFilesPresent = this.reportFiles && this.reportFiles.length > 0;
    return areReportFilesPresent;
  }*/

  //InspectionReport 
  isInspectionReport(){
    const areNoticeFilesPresent = this.noticeFiles && this.noticeFiles.length > 0;
    return areNoticeFilesPresent;
  }
  isFormValid(): boolean {
    // Check if it's a special event
    if (this.appType=="ApplicationForSpecialEvent") {
      // For special event, skip 'documents' and 'comments' validation
      return this.isGeneralFormValid() &&
             this.isApplicantFormValid() &&
             this.isCommunityFormValid() &&
             this.isRecommendationFormValid() &&
             this.isInspectionReport() &&
             this.isPhotoAvailable == true;
    } else {
      // For normal event, include all validations
      return this.isGeneralFormValid() &&
             this.isApplicantFormValid() &&
             this.isCommunityFormValid() &&
             this.isDocumentationFormValid() && // Ensure this is checked when not a special event
             this.isRecommendationFormValid() &&
             this.isInspectionReport() &&
             this.isPhotoAvailable == true;
    }
  }

  applicantForm(event:any)
  {
    if (event.detail.value === '1')
    
      {
        this.completeReportForm.patchValue({
          applicantIndicatedPersonAtPremises: '3',
          canPersonBeFound:'3',
  
        })
      }

  }

  communityChurch(event:any)
  {
    if(event.detail.value ==='2')
    {
      this.completeReportForm.patchValue({
        formServedAtEducationInstitution:"3"
      })
    }
  }

  refusalSectionValidation(event:any)
  {

    if(event.detail.value==='2' || event.detail.value==='3')
    {
      this.completeReportForm.get('comments')?.clearValidators();
      this.completeReportForm.get('comments')?.updateValueAndValidity();

      this.completeReportForm.patchValue({
        comments:'n/a'
      })
    }
    else
    {

      this.completeReportForm.get('comments')?.setValidators([Validators.required]);
      this.completeReportForm.get('comments')?.updateValueAndValidity();


      this.completeReportForm.patchValue({
        comments:''
      })
    }

  }

  communitySchool(event:any)
  {
    if(event.detail.value==='2')
      {
        this.completeReportForm.patchValue({
          formServedAtPlaceOfWorship: "3"
        })
      }
  }
  

  
    

  async onSubmit() {
    this.spinner.show();
    let token = localStorage.getItem("userToken");
    const newHeader = {
      "Authorization": "Bearer " + token,
      "Accept": "/"
    };


    
    

    if(this.completeReportForm.get('educationalInstitution')?.value ==="2")
    {
      this.completeReportForm.patchValue({
        formServedAtEducationInstitution:"3"
      })
    }

    if(this.completeReportForm.get('placeOfWorship')?.value === "2")
    {
      this.completeReportForm.patchValue({
        formServedAtPlaceOfWorship:"3"
      })
    }


    if(this.completeReportForm.get('recommendation')?.value ==='2'  || this.completeReportForm.get('recommendation')?.value ==='3' )
    {
      this.completeReportForm.get('sections')?.setValue(this.selectedSections)

      this.selectedSections.forEach(section => {

        if (!section.notes) {
          //Swal.fire({ icon: 'warning', timer: 5000, text: `Ensure that ${section.name} contain Explanatory Notes`, confirmButtonColor: "#87342E", showConfirmButton: true })
          return;
        }
      });

      if (this.selectedSections.length == 0) {
        //Swal.fire({ icon: 'warning', timer: 5000, text: `Ensure that atleast one Section is Selected`, confirmButtonColor: "#87342E", showConfirmButton: true })
        return;
      }
      
      console.log(this.selectedSections);

     
    }

    console.log(this.completeReportForm.value);
    

    this.inspectionReport = this.inspectionReport || {};
    this.inspectionReport = Object.assign(this.inspectionReport, this.completeReportForm.value);

    const formData = new FormData();
    formData.append('inspection', new Blob([JSON.stringify(this.inspectionReport)], { type: 'application/json' }));

    this.reportDoc = this.reportFiles[0];
    formData.append('report', this.report);

    this.noticeDoc = this.noticeFiles[0];
    formData.append('notice', this.notice);


    

    

  


    // if(this.latitude>=-31 && this.latitude<=-34 && this.longitude>=24 && this.longitude<=34)
    // {

      
      let url = environment.eclbDomain+"api/general/complete-inspection-report/" + this.caseNo;

      this.http.post(url, formData).subscribe(response => {

        this.router.navigate(['/thank-you'])
        this.spinner.hide();
        
      }, error => {


        console.log(error);
        this.spinner.hide();
      
        this.offlineService.saveReport(formData, this.caseNo).then(
          () => {
            // Handle successful response
            console.log('Report saved successfully');
          },
          (error) => {
            // Handle error response
            console.error('Error saving report', error);
          }
        );
      
      }
    
     );//}else
    // {
    //   alert("Your coordinates are not within Eastern Cape")
    // }



  }
  
  

  resendDataIfNeeded() {
    if (this.isNetworkConnected && this.completeReportForm.valid) {
      this.onSubmit();
    }
  }
  formDataToObject(formData: FormData): any {
    const obj: any = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }
  

  saveFormValues() {
    localStorage.setItem('completeReportForm', JSON.stringify(this.completeReportForm.value));
  }

  clearLocalStorageOnLoad() {
    localStorage.removeItem('completeReportForm');
  }

  loadFormValues() {
    const savedForm = localStorage.getItem('completeReportForm');
    if (savedForm) {
      this.completeReportForm.setValue(JSON.parse(savedForm));
    }
  }

  toggleForms(form: string) {
    this.currentForm = form;
    this.saveFormValues();
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  selectFileReport(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = ".docx, .pdf"; // Adjust as needed for file types
    fileInput.onchange = (event: Event) => this.onFileSelected(event);
    fileInput.click();
  }
  selectFileNotice(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = ".docx, .pdf"; // Adjust as needed for file types
    fileInput.onchange = (event: Event) => this.onFileSelectedRecommendation(event);
    fileInput.click();
  }

  report!: File;
  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.report = file;
  
      if (this.reportFiles.length > 0) {
        this.reportFiles.splice(0, 1, { name: file.name, size: file.size });
      } else {
        this.reportFiles.push({ name: file.name, size: file.size });
      }
  
      const reader = new FileReader();
      reader.onload = async () => {
        const base64File = reader.result as string;
  
        // Convert base64 to Blob
        const blobFile = this.base64ToBlob(base64File.split(',')[1], file.type);
  
        // Store the file in the SQLite database
        try {
          //await this.dbSql.insertFile(this.caseNo, file.name, blobFile);
          console.log('File stored in the database:', file.name);
        } catch (error) {
          console.error('Error storing file in the database:', error);
        }
      };
  
      reader.readAsDataURL(file); // Read file as Data URL
      this.inputVisible = false;
    }
  }

  base64ToBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data); // Decode base64 to binary string
    const byteNumbers = new Array(byteCharacters.length);
  
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
  
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }


  fileBase64Data: string | null = null;

  

  getFileSizeFromBase64(base64: string): number {
    const padding = (base64.charAt(base64.length - 2) === '=') ? 2 : (base64.charAt(base64.length - 1) === '=') ? 1 : 0;
    const fileSize = (base64.length * (3 / 4)) - padding;
    return Math.round(fileSize);
  }

  isFileUploaded(fileName: string): boolean {
    return this.reportFiles.some(file => file.name === fileName);
  }

  navigateToBack() {
    this.aRoute.navigate(['complete-inspection']);
  }

  async presentAlertConfirm(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this document?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteItem(index);
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

  deleteItem(index: number) {
    this.reportFiles.splice(index, 1);
    if (this.reportFiles.length === 0) {
      this.inputVisible = true;
    }
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

  isFileUploadedNotice(fileName: string): boolean {
    return this.noticeFiles.some(file => file.name === fileName);
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
    this.noticeFiles.splice(index, 1);
    if (this.noticeFiles.length === 0) {
      this.inputVisible = true;
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        //Commented Out the Photos
        /*{
          text: 'Photos',
          icon: 'image',
          handler: () => {
            this.selectImage(CameraSource.Photos);
          }
        },*/
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.selectImage(CameraSource.Camera);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close'
        }
      ]
    });
    await actionSheet.present();
  }
  compulsoryPhotosCaptured: boolean[] = new Array(12).fill(false);  // Only 2 compulsory photos
  availableDescriptions: string[] = ['Front View', 'Front & Left Side View','Front & Right Side View','Back View','Back & Left Side','Back & Right-side','Drinking Area View','Counter View','Shelves Area view','Storage Area View','Toilet Front View','Toilet Inside View', 'Other'];  

  selectedDescriptions: Set<string> = new Set(); // Use a Set to keep track of selected descriptions

// Function to handle image selection
async selectImage(source: CameraSource) {
  const image = await Camera.getPhoto({
    quality: 50,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: source,
    width: 4000,
    height: 3000,
  });

  if (image.dataUrl) {
    const resizedImage = await this.resizeImage(image.dataUrl, 4000, 3000);
    const description = await this.promptForDescription();

    if (description) {
      if (this.isDuplicateDescription(description)) {
        console.log(`The description "${description}" has already been selected.`);
        await this.showAlert(`"${description}" has already been selected.`);
        return;
      }

      this.imageSources.push({ src: resizedImage, description });
      this.selectedDescriptions.add(description);

      const compulsoryIndex = this.availableDescriptions.indexOf(description);
      if (compulsoryIndex >= 0 && compulsoryIndex < 2) {
        this.compulsoryPhotosCaptured[compulsoryIndex] = true;
      }

      this.isPhotoAvailable = this.compulsoryPhotosCaptured.every(captured => captured);

      console.log("Compulsory Photos Captured Array:", this.compulsoryPhotosCaptured);
      console.log("Is Photo Available:", this.isPhotoAvailable);
    } else {
      console.log("No description selected.");
    }
  }
}

// Resize image function (placeholder for resizing logic)
async resizeImage(dataUrl: string, width: number, height: number): Promise<string> {
  return dataUrl;
}

// Prompt user to select a description, highlighting previously selected items
async promptForDescription(): Promise<string | null> {
  return new Promise(async (resolve) => {
    const alert = await this.alertController.create({
      header: 'Select Description',
      cssClass: 'scrollable-alert', // Custom CSS class to enable scrolling
      inputs: this.availableDescriptions.map((description) => ({
        type: 'radio',
        label: description,
        value: description,
        checked: this.selectedDescriptions.has(description),  // Show checked if already selected
        cssClass: this.selectedDescriptions.has(description) ? 'selected-description' : ''  // Apply custom styling
      })),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => resolve(null)
        },
        {
          text: 'OK',
          handler: async (selectedDescription) => {
            if (selectedDescription === 'Other') {
              const otherDescription = await this.promptForCustomDescription();
              resolve(otherDescription);
            } else {
              resolve(selectedDescription);
            }
          }
        }
      ]
    });

    await alert.present();
  });
}

// Prompt user to enter a custom description if they select "Other"
async promptForCustomDescription(): Promise<string | null> {
  return new Promise(async (resolve) => {
    const alert = await this.alertController.create({
      header: 'Enter Description',
      inputs: [
        {
          name: 'customDescription',
          type: 'text',
          placeholder: 'Enter custom description'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => resolve(null)
        },
        {
          text: 'OK',
          handler: (data) => resolve(data.customDescription || null)
        }
      ]
    });

    await alert.present();
  });
}

// Check if the description is a duplicate
isDuplicateDescription(description: string): boolean {
  return this.selectedDescriptions.has(description);
}

// Show alert if a description is selected multiple times
async showAlert(message: string) {
  const alert = await this.alertController.create({
    header: 'Duplicate Selection',
    message: message,
    buttons: ['OK']
  });
  await alert.present();
}
 


  
   
  toggleDropdown(event: Event, index: number) {
    event.stopPropagation();
    this.dropdownVisible[index] = !this.dropdownVisible[index];
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    Object.keys(this.dropdownVisible).forEach(user => {
      if (this.dropdownVisible[user] && !this.eRef.nativeElement.querySelector('.label').contains(event.target)) {
        this.dropdownVisible[user] = false;
      }
    });
  }

  async deleteImage(imageUrl: string) {
    const alert = await this.createDeleteAlert(imageUrl);
    await alert.present();
  }

  private async createDeleteAlert(imageUrl: string) {
    return this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this image?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary-button',
          handler: () => {
            console.log('Cancel delete');
          }
        },
        {
          text: 'Yes',
          cssClass: 'primary-button',
          handler: () => {
            this.removeImage(imageUrl);
            
            console.log('Confirm delete');
          }
        }
      ]
    });
  }

  private removeImage(imageUrl: string) {
    const index = this.imageSources.findIndex(image => image.src === imageUrl);
    if (index !== -1) {
      this.imageSources.splice(index, 1);
      if (this.imageSources.length==0) {

        this.isPhotoAvailable=false;
      }
      this.dropdownVisible[index] = false;
    }
  }

  async viewImage(image: string) {
    const modal = await this.modalController.create({
      component: ViewImagePage,
      componentProps: { image },
      backdropDismiss: true // This enables clicking outside the modal to dismiss it
    });
    return await modal.present();
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }

  latitude: any;
  longitude: any;

  async getCurrentPosition() {
    if (navigator.geolocation) {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;

          
          console.log('Latitude:', this.latitude);
          console.log('Longitude:', this.longitude);

          
          this.completeReportForm.patchValue({
            latitude: this.latitude,
            longitude: this.longitude,
          });
        },
        async (error: GeolocationPositionError) => {
          console.error('Error getting location', error);

          if (error.code === 1) {
            await this.presentAlert('Permission Denied', 'Location access was denied.');
          } else if (error.code === 2) {
            await this.presentAlert('Position Unavailable', 'Unable to determine location.');
          } else if (error.code === 3) {
            await this.presentAlert('Timeout', 'Location request timed out.');
          } else {
            await this.presentAlert('Error', 'An unexpected error occurred while getting location.');
          }
        },
        options
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      await this.presentAlert('Error', 'Geolocation is not supported by this browser.');
    }
  }



  
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlert2(message: string) {
    const alert = await this.alertController.create({
      message,
      buttons: ['OK']
    });
  
    await alert.present();
  }

  radioClicked(formControlName: string, value: string) {
    this.completeReportForm.patchValue({
      [formControlName]: value
    });
  }

  loadLastKnownLocation() {
    const lastLat = localStorage.getItem('lastKnownLatitude');
    const lastLon = localStorage.getItem('lastKnownLongitude');

    if (lastLat && lastLon) {
      this.latitude = parseFloat(lastLat);
      this.longitude = parseFloat(lastLon);
      this.completeReportForm.patchValue({
        latitude: this.latitude,
        longitude: this.longitude
      });
    }
  }
 
  openDatetimePicker() {
    const button = document.getElementById('open-datetime');
    if (button) {
      button.click();
    }
  }

  dateChanged(event: any) {
    const date = event.detail.value;
    const input = document.getElementById('inspection-date-input') as HTMLInputElement;
    if (input) {
      input.value = date;
    }
    this.completeReportForm.get('futureInspectionDate')?.setValue(date);
  }
  dateChanged1(event: any) {
    const date = event.detail.value;
    const input = document.getElementById('inspection-date-input') as HTMLInputElement;
    if (input) {
      input.value = date;
    }
    this.completeReportForm.get('inspectionDate')?.setValue(date);
  }
  closePopover() {
    this.popoverController.dismiss();
  }

  goBack() {
    this.location.back();
  }
  

  
}
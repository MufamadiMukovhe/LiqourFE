
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, HostListener, OnDestroy, } from '@angular/core';
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
import { Location } from '@angular/common';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { NgxIndexedDBService } from 'ngx-indexed-db';



@Component({
  selector: 'app-complete-inspection',
  templateUrl: './complete-inspection.page.html',
  styleUrls: ['./complete-inspection.page.scss'],
})
export class CompleteInspectionPage implements OnInit, OnDestroy {
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
    private dbService: NgxIndexedDBService
    
  ) {
    this.completeReportForm = this.fb.group({
      contactPerson: ['', Validators.required],
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

  ecp:string | null=""
  appType:any
  

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.caseNo = param.get('caseId');
      this.appType = param.get('appType');
  
      if (this.appType === 'ApplicationForSpecialEvent') {
        this.communityConsult();
      }
      
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
  }
  

  communityConsult()
  {
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

  ngOnDestroy()
  {
    localStorage.setItem(this.caseNo,this.completeReportForm.value)
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
  

  
    

  async onSubmit() {
    this.spinner.show();
    let token = localStorage.getItem("userToken");
    const newHeader = {
      "Authorization": "Bearer " + token,
      "Accept": "/"
    };

    this.inspectionReport = this.inspectionReport || {};
    this.inspectionReport = Object.assign(this.inspectionReport, this.completeReportForm.value);

    const formData = new FormData();
    formData.append('inspection', new Blob([JSON.stringify(this.inspectionReport)], { type: 'application/json' }));

    this.reportDoc = this.reportFiles[0];
    formData.append('report', this.report);

    this.noticeDoc = this.noticeFiles[0];
    formData.append('notice', this.notice);

    this.imageSources.forEach((img, index) => {
      const imgFile= this.convertSrcToFile(img.src, `photo_${index}.jpg`);
      formData.append('files', imgFile);
      formData.append('descriptions', img.description);
    });


   
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
            localStorage.removeItem(this.caseNo);
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
      reader.onload = () => {
      const base64File = reader.result as string;

      
      //this.saveFileToIndexedDB(file.name, base64File);
    };
      reader.readAsDataURL(file);


      this.inputVisible = false; 
    }
  }


  fileBase64Data: string | null = null;

  loadSavedFile(): void {
    this.dbService.getAll(this.caseNo).subscribe(
      (files) => {
        if (files.length > 0) {
          
          const savedFile = files[0] as { fileName: string; fileData: string }; 
  
          
          this.reportFiles.push({ name: savedFile.fileName, size: this.getFileSizeFromBase64(savedFile.fileData) });
  
          
          this.fileBase64Data = savedFile.fileData;
  
          this.inputVisible = false; 
          console.log('File loaded from IndexedDB:', savedFile);
        } else {
          console.log('No file found in IndexedDB.');
        }
      },
      (error) => {
        console.error('Error loading file from IndexedDB:', error);
      }
    );
  }

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
      // Resize the image before prompting for the description
      const resizedImage = await this.resizeImage(image.dataUrl, 4000, 3000); // Adjust width and height as needed
  
      // Prompt for the description after resizing
      const description = await this.promptForDescription();
      const isDuplicate = this.imageSources.some(
        (img) => img.description.toLowerCase() === description?.toLowerCase()
      );
  
      if (!isDuplicate && description) {
        this.imageSources.push({ src: resizedImage, description });
        this.isPhotoAvailable = this.imageSources.length > 0;
  
        console.log(this.imageSources);
      } else {
        // Handle duplicate description
        return;
      }
    }
  }
  
  resizeImage(dataUrl: string, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        let { width, height } = img;
  
        // Calculate aspect ratio to maintain the image proportions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
  
        canvas.width = width;
        canvas.height = height;
  
        ctx?.drawImage(img, 0, 0, width, height);
  
        resolve(canvas.toDataURL('image/jpeg', 0.5)); // Adjust the quality as needed
      };
    });
  }
  

  



  convertSrcToFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    if (arr.length < 2) {
      throw new Error('Invalid data URL');
    }
    
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) {
      throw new Error('Unable to extract MIME type');
    }
    
    const mime = mimeMatch[1];
    
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    
    return new File([u8arr], filename, { type: mime });
  }

  async promptForDescription(): Promise<string | null> {
    return new Promise<string | null>(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Add Description',
        inputs: [
          {
            name: 'description',
            type: 'text',
            placeholder: 'Enter image description'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              resolve(null);
            }
          },
          {
            text: 'Save',
            handler: async (data) => {
              const isDuplicate = this.imageSources.some(img => img.description === data.description);
              if (isDuplicate) {
                await this.presentDuplicateDescriptionAlert(resolve);
              } else {
                resolve(data.description);
              }
            }
          }
        ]
      });
      await alert.present();
    });
  }
  
  async presentDuplicateDescriptionAlert(resolve: (value: string | null) => void) {
    const alert = await this.alertController.create({
      message: 'Description already exists. Please use a different one.',
      buttons: [
        {
          text: 'OK',
          handler: async () => {
            const description = await this.promptForDescription();
            if (description) {
              resolve(description);
            }
          }
        }
      ]
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

  

  

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-non-compliance-section55',
  templateUrl: './non-compliance-section55.page.html',
  styleUrls: ['./non-compliance-section55.page.scss'],
})
export class NonComplianceSection55Page implements OnInit {

  currentForm: string = 'landing';
  noticeFiles: { name: string, size: number }[] = [];
  inputVisible: boolean = true;
  constructor(
    private alertController: AlertController,
    private route:Router
  ) { }

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
    const reportGeneral= ['date', 'cityTown','ecpNumber','registrationCategory','businessName','registeredPerson','telephoneNumber','emailAddress','businessAddress','businessAddress','spatialDataCoordinates','localMunicipality','districtMunicipality','typeOfRegisteredPerson','section40ManagerAppointed'];
    return false
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

  navigateToBack() {
    setTimeout(() => {
      this.route.navigate(['/outlets']); 
    }, 0);
  }
}

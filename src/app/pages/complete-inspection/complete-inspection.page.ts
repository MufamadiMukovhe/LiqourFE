import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-complete-inspection',
  templateUrl: './complete-inspection.page.html',
  styleUrls: ['./complete-inspection.page.scss'],
})
export class CompleteInspectionPage implements OnInit {

  selectedOption: string = '';
  uploadedFiles: { name: string, size: number }[] = [];
  currentForm: string = 'landing';

  
 
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;
  generalForm: FormGroup;



  constructor(private route: Router, private eRef: ElementRef, private alertController: AlertController,private fb: FormBuilder) {
    this.generalForm = this.fb.group({
      personContacted: ['', Validators.required],
      inspectionDate: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]]
    });

  }
  
  ngOnInit() {
 
  }


  toggleForms(form: string) {
    this.currentForm = form;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (this.isFileUploaded(file.name)) {
        await this.presentFileExistsAlert();
      } else {
        this.uploadedFiles.push({ name: file.name, size: file.size });
      }
    }
  }

  isFileUploaded(fileName: string): boolean {
    return this.uploadedFiles.some(file => file.name === fileName);
  }

  async presentFileExistsAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Document already uploaded.',
      buttons: ['OK']
    });

    await alert.present();
  }

  navigateToBack() {
    this.route.navigate(['complete-inspection']);
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
    this.uploadedFiles.splice(index, 1);
  }
}

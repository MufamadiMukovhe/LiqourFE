import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-offline-password',
  templateUrl: './offline-password.page.html',
  styleUrls: ['./offline-password.page.scss'],
})
export class OfflinePasswordPage implements OnInit {

  offlinePassForm: FormGroup;
  alertType!: string;
  alertMessage!: string;
  showAlert!: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
      private spinner: NgxSpinnerService,
  ) {
    this.offlinePassForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  // Method to save the password after creation
  savePassword(): void {
    this.spinner.show();
    if (this.offlinePassForm.invalid) {
      // If the form is invalid, do not proceed.
      return;
    }

    const password = this.offlinePassForm.get('password')?.value;
    const confirmPassword = this.offlinePassForm.get('confirmPassword')?.value;

    // Check if password and confirmPassword match
    if (password === confirmPassword) {
      // Save the password securely (using localStorage for demo purposes)
      localStorage.setItem('offlinePassword', password);
      setTimeout(() => {
        this.spinner.hide(); 
        this.router.navigate(['/dashboard']);
      }, 2000);
      
      
    } else {

      setTimeout(() => {
        this.spinner.hide()
        this.showAlertMessage('error','Passwords do not match.');
      }, 2000);
     

    }
  }


  showAlertMessage(type: string, message: string) {
    this.alertType = type;
    this.alertMessage = message;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000); 
  }
}

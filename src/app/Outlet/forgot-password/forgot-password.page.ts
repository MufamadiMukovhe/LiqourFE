import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  passwordForm: FormGroup;
  email: string | null = '';

  constructor(private fb: FormBuilder, private router: Router, private spinner: NgxSpinnerService) {
    // Get email from localStorage
    this.email = localStorage.getItem('username');

    this.passwordForm = this.fb.group({
      email: [{ value: this.email, disabled: true }, [Validators.required, Validators.email]], // Pre-filled and disabled email
      password: ['', Validators.required], // Minimum password length for security
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.MustMatch('password', 'confirmPassword'),
    });
  }

  ngOnInit() {}

  // Password match validation
  MustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['MustMatch']) {
        return;
      }
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ 'MustMatch': true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  // Submitting the form
  onSubmit() {
    if (this.passwordForm.invalid) {
      alert("Please fill in all fields correctly.");
      return;
    }

    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
      
      // Store new password in localStorage
      localStorage.setItem('offlinePassword', this.passwordForm.get('password')?.value);

      console.log("Password updated successfully");
      
      this.passwordForm.reset();
      // Navigate to login page
      this.router.navigate(['/signin']);

    }, 2000);
  }

  get reset() {
    return this.passwordForm.controls;
  }

}

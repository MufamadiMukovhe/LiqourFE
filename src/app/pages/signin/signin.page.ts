import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { OtpServiceService } from 'src/app/util/service/otp-service.service';
import { HelperService } from 'src/app/util/service/helper.service';
import { Auth } from 'src/app/util/service/Auth';
import { Message } from 'src/app/util/service/Message';
import { DataService } from 'src/app/util/service/data.service';
import { VersionControlService } from 'src/app/util/version-control.service';
import { catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  loginForm: FormGroup;
  otp: any;
  getotp: string = '';
  alertType!: string;
  alertMessage!: string;
  showAlert!: boolean;
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: OtpServiceService,
    private helper: HelperService,
    private auth: Auth,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private verControl: VersionControlService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  appVersion:string | undefined;


  ngOnInit() {
    this.verControl.getAppVersion().subscribe(
      (version) => {
        this.appVersion = version;
        console.log('Version:', this.appVersion); 
      },
      (error) => console.error('Failed loading the version:', error)
    );

   
  }


  checkOffline() {
    if (navigator.onLine) {
      return true;
    } else {
      return false;
    }
  }

  public login(): void {
    this.spinner.show();
    if (this.loginForm.invalid) {
      console.error('Form is invalid');
      return;
    }
  
    this.email = this.loginForm.get('email')?.value;
    this.password = this.loginForm.get('password')?.value;
  
    // Convert email to username (remove @domain if present)
    if (this.email?.includes('@')) {
      let num = this.email.indexOf("@");
      this.email = this.email.substring(0, num);
    }
  
    // Check if the device is offline
if (!navigator.onLine) {
  console.log('Offline mode detected');

    // Retrieve the stored username and password from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('offlinePassword');


  if (storedUsername) {
    console.log('Using stored username:', storedUsername);
  } else {
    console.warn('No stored username found.');
  }
  if (storedUsername && storedPassword) {
    console.log('Using stored username and password:', storedUsername, storedPassword);
   // Check if the stored username and password match the input credentials
   if (this.email === storedUsername && this.password === storedPassword) {
    console.log('Offline login successful');

    setTimeout(() => {
      this.spinner.hide();
      this.router.navigate(['dashboard']); // Navigate to dashboard without OTP
      this.loginForm.reset();
    }, 2000);

    return;
  } else {
        console.error('Offline login failed - Invalid credentials');
        this.showAlertMessage('error', 'Invalid username or password for offline mode.');
        this.spinner.hide();
        return;
      }
    }else {
      console.warn('No stored username or password found.');
      this.showAlertMessage('error', 'No stored credentials found for offline login.');
      this.spinner.hide();
      return;
    }
  }
  
    this.getOpt(); // Request OTP for online login
  }
  

  private getOpt(): void {
    const auth2 = {
      username: this.email,
      otp: this.loginForm.get('enteredOtp')?.value,
    };
  
    this.service.getOneTimePin(auth2).subscribe({
      next: (res: any) => {
        if (this.auth.username == "financial") {
          this.router.navigate(['/outlet-dashboard']);
        } else {
          localStorage.removeItem('isLoggedOut');
  
          let message = new Message();
          message.message = 'We have sent OTP to your email';
          this.otp = res.message;
          this.getotp = res.message;
  
          this.saveData();
  
          localStorage.setItem('username', this.email);
          localStorage.setItem('otp', this.getotp);
  
          setTimeout(() => {
            this.spinner.hide();
            this.router.navigateByUrl('/verify');
            this.loginForm.reset();
          }, 2000);
        }
      },
      error: (error: any) => {
        console.error('Error fetching OTP:', error);
        this.spinner.hide();
  
        let errorMessage;
  
        if (error.message === 'The server took too long to respond.') {
          errorMessage = 'The server is taking too long to respond. Please try again later.';
        } else if (error.status === 0) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = 'Invalid username. Please enter a valid username.';
        }
        this.showAlertMessage('error', errorMessage);
      }
    });
  }

  saveData() {
    this.dataService.setData(this.getotp);
  }

  showAlertMessage(type: string, message: string) {
    this.alertType = type;
    this.alertMessage = message;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000); 
  }
  toRegister() {

    this.spinner.show(); 
  
    setTimeout(() => {
      this.spinner.hide(); 
      this.router.navigate(['register-user']);
    }, 2000);
  }

  toPassword() {
    this.spinner.show(); 
  
    setTimeout(() => {
      this.spinner.hide(); 
      this.router.navigate(['forgot-password']);
    }, 2000);
  }
}
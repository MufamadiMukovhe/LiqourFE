import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OtpServiceService } from 'src/app/util/service/otp-service.service';
import { HelperService } from 'src/app/util/service/helper.service';
import { Auth } from 'src/app/util/service/Auth';
import { Message } from 'src/app/util/service/Message';
import { DataService } from 'src/app/util/service/data.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  loginForm: FormGroup;
  otp: any;

  getotp:string='';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: OtpServiceService,
    private helper: HelperService,
    private auth: Auth,
    private dataService: DataService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  email:string=''
  password:string=''

  public login(): void {
    //console.log('Form Value:', this.loginForm.value);

    if (this.loginForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    this.email = this.loginForm.get('email')?.value;
    this.password = this.loginForm.get('password')?.value;


    if (!this.email) {
      console.error('Email is undefined or empty');
      return;
    }

    this.auth.username =this.email; 
    const encodedPassword = encodeURIComponent(this.password);

    let host = this.helper.getHost();
    localStorage.clear()
    console.log("Start")
    this.getOpt();
    console.log("Finish")
    
  }

  private getOpt(): void {
    //this.auth.otp = this.loginForm.get('enteredOtp')?.value;

    const auth2={
      "username": this.email,
      "otp": this.loginForm.get('enteredOtp')?.value
    }

    this.service.getOneTimePin(auth2).subscribe({
      next: (res: any) => {
        let message = new Message();
        message.message = 'We have sent OTP to your email';
        this.otp = res.message;
        this.getotp=res.message;
       
        this.saveData();
       
        localStorage.setItem('username', this.email)
        localStorage.setItem('otp',this.getotp);
        console.log(this.getotp);
        
        this.router.navigateByUrl('/verify');

      },
      error: (error: any) => {
        // Handle error
      },
    });
  }

  saveData() {
    this.dataService.setData(this.getotp);
  }

  
}

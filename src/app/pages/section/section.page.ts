import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import SignaturePad from 'signature_pad';
import { Route } from '@angular/router';
import { headers, headersSecure } from 'src/app/util/service/const';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-section',
  templateUrl: './section.page.html',
  styleUrls: ['./section.page.scss'],
})
export class SectionPage implements OnInit {

  showAlert!: boolean;
  alertMessage!: string;
  alertType!: string;
  sectionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private aRoute: Router,
  ) {
    this.sectionForm = this.fb.group({
      receivedBy: ['', Validators.required],
      receivingDate: ['', Validators.required],
    });
  }

  ngOnInit() {
  }
  showAlertMessage(type: string, message: string) {
    this.alertType = type;
    this.alertMessage = message;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000); 
  }

  onSubmit() {
    if (this.sectionForm.valid) {
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
    } 
  }
  
  signaturePad!: SignaturePad;
  @ViewChild('canvas')
  canvasEl!: ElementRef;
  signatureImg!: string;
  

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);
  }

  startDrawing(event: Event) {
    console.log(event);
    // works in device not in browser

  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signaturePad.clear();
  }

  async savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    this.showAlertMessage('error', 'Signature Served');
  }

  navigatoToBack()
  {
    this.aRoute.navigate(['my-task'])
  }

}

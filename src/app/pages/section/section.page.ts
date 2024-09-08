import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import SignaturePad from 'signature_pad';
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
  caseid:any
  summons: any;
  summon:any;
  caseNo:any

  constructor(
    private fb: FormBuilder,private router: ActivatedRoute, private spinner: NgxSpinnerService, private http: HttpClient, private aRoute: Router
  ) {
    this.sectionForm = this.fb.group({
      receivedBy: ['', Validators.required],
      inspectionDate: ['', Validators.required],
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



    this.router.paramMap.subscribe(param => {
      this.caseNo = param.get('caseId');

      this.router.paramMap.subscribe(param => {
        this.summon = param.get('summon');
      })

  })
  }

 
  public onSubmit(): void {
    this.spinner.show();
    if(!this.signatureImg && this.sectionForm.invalid){
      this.showAlertMessage('error', 'please enter all fields');
      return;
    }
    this.summons = this.summons || {};
    this.summons = Object.assign(this.summons, this.sectionForm.value);

    const formData = new FormData();
    formData.append('update', new Blob([JSON.stringify(this.summons)], { type: 'application/json' }));

    const imgFile= this.convertSrcToFile(this.signatureImg, `signature.jpg`);
    formData.append('signature', imgFile);

    

    let url = environment.eclbDomain+"api/general/update-section-notice/"+this.caseNo;

    this.http.put(url, formData).subscribe(response => {

      this.aRoute.navigate([`/summons/${this.caseNo}`])
      this.spinner.hide();
      
    }, error => {

      console.log(error);
      this.spinner.hide();
    })

  

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
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


}

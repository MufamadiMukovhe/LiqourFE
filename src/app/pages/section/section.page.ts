import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import SignaturePad from 'signature_pad';
import { Route } from '@angular/router';
import { headers, headersSecure } from 'src/app/util/service/const';
import { environment } from 'src/environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertController } from '@ionic/angular';
import { ServeNoticeService } from 'src/app/util/service/services/serve-notice.service';


@Component({
  selector: 'app-section',
  templateUrl: './section.page.html',
  styleUrls: ['./section.page.scss'],
})
export class SectionPage implements OnInit {

 
  alertMessage!: string;
  alertType!: string;
  sectionForm: FormGroup;
  caseid:any
  summons: any;
  summon:any;
  caseNo:any

  constructor(
    private fb: FormBuilder,private router: ActivatedRoute, private spinner: NgxSpinnerService, private http: HttpClient, private aRoute: Router ,  private alertController: AlertController,
    private serveNotice:ServeNoticeService
  ) {
    this.sectionForm = this.fb.group({
      receivedBy: ['', Validators.required],
      receivingDate: ['', Validators.required],
    });
  }

  ngOnInit() {

  

    this.router.paramMap.subscribe(param => {
      this.caseNo = param.get('caseId');

      this.router.paramMap.subscribe(param => {
        this.summon = param.get('summon');
      })

  })
  }
  
 
  async onSubmit(){
    this.spinner.show();
  
    this.summons = this.summons || {};
    this.summons = Object.assign(this.summons, this.sectionForm.value);

    const formData = new FormData();
    formData.append('update', new Blob([JSON.stringify(this.summons)], { type: 'application/json' }));

    const imgFile= this.convertSrcToFile(this.signatureImg, `signature.jpg`);
    formData.append('signature', imgFile);

    

    let url = environment.eclbDomain+"api/general/update-section-notice/"+this.caseNo;


    this.http.put(url, formData).subscribe(response => {

      
      this.spinner.hide();
      this.showAlert('success', 'Served Notice Complete');
      this.aRoute.navigate([`/my-tasks`])
      
      
    }, error => {
      if (navigator.onLine) {
        this.spinner.hide();
        this.showAlert('failed', 'Something went wrong. Please try again');
        
      } else {
      this.serveNotice.saveNotice( formData,this.caseNo)
      }
    })


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
    await this.showAlert('sucess', 'Signature Saved');
  }

  navigatoToBack()
  {
    this.aRoute.navigate(['my-tasks'])

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

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }


 
}


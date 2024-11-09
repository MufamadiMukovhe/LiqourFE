import { HttpClient } from '@angular/common/http';
import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { headers, headersSecure } from 'src/app/util/service/const';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-edit-complaint',
  templateUrl: './edit-complaint.page.html',
  styleUrls: ['./edit-complaint.page.scss'],
})
export class EditComplaintPage implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private aRoute: Router, private eRef: ElementRef,private spinner: NgxSpinnerService,
    private alertController: AlertController,
    private navController: NavController
  ) {}

  reference: string = "";
  description: string = "";
  strAddress: string = "";
  inspectors: any[] = [];
  complain: any[] = [];
  offOutlet: string = "";
  districMunicipalty: string = "";
  localMunicipality: string = "";
  town: string = "";
  comment: string = "";
  history: string = "";
  selectedInspector:any;
  status:any;
  ecpNo:any;
  complains:string="";
  referenceNo:any;
  collectObj:any;

  ngOnInit() {

    let token = localStorage.getItem("userToken") 
    const newHeader={
      "Authorization":"Bearer "+token, 
      "Accept":"*/*"}
    let urlForInspectors="http://localhost:8081/api/general/get-complaints-info";

    this.http.get(urlForInspectors, { headers: newHeader }).subscribe(
      (response: any) => {
        if (response && response.inspectors) {
          this.inspectors = response.inspectors;
          console.log(this.inspectors);
          
        }
      },
      (error) => {
        console.log(error);
      }
    );



    this.route.paramMap.subscribe(param => {

      this.referenceNo = param.get('referenceNumber');

      let url = "http://localhost:8081/api/general/get-complaint-details/"+this.referenceNo;

      
    const newHeader={
      "Authorization":"Bearer "+token, 
      "Accept":"*/*"
    }
      
      this.http.get<any>(url,{headers: newHeader}).subscribe(response => {
        console.log(response)
        
        //this.collectObj=response;
        
        this.reference=response.referenceNumber;
        //this.description=response.;
        this.strAddress=response.addressOfOutlet;
        this.offOutlet=response.outletName;
        this.town=response.areaOfOutlet;
        this.districMunicipalty=response.regionOfOutlet;
        this.localMunicipality=response.localMunicipality;
        this.comment=response.comment;
        this.history=response.commentHistory;
        this.description=response.descriptionOfComplaint;
        


      }, error => {
        console.log(error)
      });

      let url1 = "http://localhost:8081/api/general/get-complain/"+this.referenceNo;
      this.http.get<any>(url1,{headers: newHeader}).subscribe(response => {
        console.log(response)
        this.complains =response.comments;
        this.ecpNo=response.ecpNumber;
          this.status=response.status;
        console.log(this.complains)
       
     this.history=this.complains

      }, error => {
        console.log(error)
      });
    });

  }
  navigateToBack() {
    this.aRoute.navigate(['complaints']);
  }

  async updateComplaint() {
    this.spinner.show();
    let token = localStorage.getItem("userToken");
    const newHeader = {
      "Authorization": "Bearer " + token,
      "Accept": "*/*"
    };
  
    const form = {
      "referenceNumber": this.referenceNo,
      "offendingOutlet": this.offOutlet,
      "ecpNumber": this.ecpNo,
      "address": this.strAddress,
      "districtName": this.districMunicipalty,
      "localMunicipality": this.localMunicipality,
      "town": this.town,
      "inspector": this.selectedInspector,
      "comment": this.comment,
      "status": this.status,
      "comments": []
    };
  
    let url = environment.eclbDomain+"api/general/update-complain";
    this.http.put(url, form, { headers: newHeader }).subscribe(
      async response => {
        console.log(form);
        console.log(response);
        this.spinner.hide();
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Complaint edited successfully',
          buttons: [  {
            text: 'OK',
            handler: () => {
              this.navController.navigateBack('complaints');
            }
          }]
        });
        await alert.present();
      },
      error => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }
  
}

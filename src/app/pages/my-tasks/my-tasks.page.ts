import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { headers, headersSecure } from 'src/app/util/service/const';
import { HelperService } from 'src/app/util/service/helper.service';
//import * as jwt_decode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment.prod';





@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.page.html',
  styleUrls: ['./my-tasks.page.scss'],
})
export class MyTasksPage implements OnInit {
  collect: any[] = [];
  loading: boolean = true; // Add loading state
  decodedToken:any;
  role:any;
  tok:any;
  constructor(private route: Router, 
    private http: HttpClient,private spinner: NgxSpinnerService, private helper: HelperService) { }

  ngOnInit() {
    this.spinner.show();
    let url = "/api/general/get-inbox";
    let token = localStorage.getItem("userToken") 
    const newHeader={
      "Authorization":"Bearer "+token, 
      "Accept":"*/*"
    }

    this.tok=localStorage.getItem('uToken');
    //this.decodedToken=JSON.parse(this.tok);

    console.log(this.tok);
    
      this.decodedToken=jwtDecode(this.tok)
      
      this.role=this.decodedToken.scope;
      console.log(this.role);
      
      
    
    this.http.get<any[]>(environment.eclbDomain+"api/general/get-inbox", { headers: newHeader }).subscribe(
      response => {

        if(this.role==='INSPECTOR')
          {
<<<<<<< HEAD
            console.log(this.collect)
            this.collect = response.filter(item => item.action === 'Complete Report' || item.action === 'Complete Inspection Report' || item.action === 'Inspector Serve Summons' || item.action === 'Inspector Serve Section 22(5) Notice' || item.action === 'Complete Supplementary Report');
=======
            //this.collect = response;
            this.collect = response.filter(item => item.action === 'Complete Report' || item.action === 'Complete Inspection Report' || item.action === 'Inspector Serve Summons' || item.action === 'Inspector Serve Section 22(5) Notice' || item.action === 'Complete Supplementary Report'|| item.action === 'Complete Report Query');


          
>>>>>>> a4a763a91902783421d8ce121ad63cc52b27cf0d
            this.collect = this.collect.filter(item => item.status!=='Complete')

            console.log(this.collect);
            

          }
          else{
            this.collect = response;
            console.log(this.collect)
          }
        
        
        this.spinner.hide();
      },
      error => {
        console.log(error);
      
        this.spinner.hide();
      }
    );
  }

  navigateToBack() {
    this.route.navigate(['dashboard']);
  }

  navigateToTask(action: any, caseId:any, appType:any)
    {
      
      switch (action) {
        case 'Attach and / or Verify WC Report':
          this.route.navigate(['']);
          break;
        case 'Pre-Registration Inspection':
          this.route.navigate(['']);
          break;
        case 'Complete Report':
          case 'Complete Supplementary Report':
          this.route.navigate([`/complete-inspection/${caseId}/${appType}`]);
          break;
        case 'Verify Application':
          this.route.navigate(['']);
          break;
        case 'Complete GIS Report':
          this.route.navigate([`/complete-gis-report/${caseId}`])
          break;
        case 'Complete Inspection Report':
          this.route.navigate([`/complete-inspection/${caseId}/${appType}`]);
          break;
        case 'Inspector Serve Summons':
          this.route.navigate([`/summons/${caseId}`])
          break;
        case 'Inspector Serve Section 22(5) Notice':
          this.route.navigate([`/section/${caseId}/`])
          break;
          case 'Complete Report':
            case 'Complete Report Query':
            this.route.navigate([`/complete-inspection/${caseId}/${appType}`]);
            break;
       

      }
    }

    
}

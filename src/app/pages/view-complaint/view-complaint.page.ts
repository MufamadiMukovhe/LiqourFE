import { HttpClient } from '@angular/common/http';
import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { headersSecure } from 'src/app/util/service/const';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-view-complaint',
  templateUrl: './view-complaint.page.html',
  styleUrls: ['./view-complaint.page.scss'],
})
export class ViewComplaintPage implements OnInit {
  ecpNumber:string="";
  complains:string="";

  constructor(private aRoute: Router, private eRef: ElementRef, private http:HttpClient, private route: ActivatedRoute) {}

  referenceNo:any;

  collect:any[]=[];

  collectObj:any

  ngOnInit() {
    this.route.paramMap.subscribe(param => {

      let token = localStorage.getItem("userToken") 
    const newHeader={
      "Authorization":"Bearer "+token, 
      "Accept":"*/*"
    }

      this.referenceNo = param.get('referenceNumber');

      let url = environment.eclbDomain+"api/general/get-complaint-details/"+this.referenceNo;
      
      this.http.get<any>(url,{headers: newHeader}).subscribe(response => {
        console.log(response)
        this.collect=response;

        this.collectObj=response;
      }, error => {
        console.log(error)
      });

      let url1 = "http://localhost:8081/api/general/get-complain/"+this.referenceNo;
      this.http.get<any>(url1,{headers: newHeader}).subscribe(response => {
        console.log(response)
        this.complains =response.comments;
        this.ecpNumber=response.ecpNumber;
        
       
        console.log(this.complains)
        console.log(this.ecpNumber);

      }, error => {
        console.log(error)
      });
    });


  }
  extractCommentText(comment: string): string {
    const parts = comment.split(' - ');
    return parts[0] || ''; 
  }
  
  extractTime(comment: string): string {
    const parts = comment.split(' - ');
    return parts[1] || ''; 
  }
  
  extractDate(comment: string): string {
    const parts = comment.split(' - ');
    return parts[2] || ''; 
  }


  

  navigateToBack() {
    this.aRoute.navigate(['complaints']);
  }

  getStatusMessage(status: string | number): string {
    // Convert the status to a number if it’s a string
    const numericStatus = typeof status === 'string' ? parseInt(status, 10) : status;
    
    switch (numericStatus) {
      case 0:
        return 'Open';
      case 1:
        return 'In Progress';
      case 2:
        return 'Cancelled';
      case 3:
        return 'Closed';
      default:
        return 'Unknown Status';
    }
  }
  

}

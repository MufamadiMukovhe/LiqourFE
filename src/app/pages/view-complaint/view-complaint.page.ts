import { HttpClient } from '@angular/common/http';
import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
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
  inspector: string="";

  constructor(private aRoute: Router, private eRef: ElementRef, private http:HttpClient, private route: ActivatedRoute,
    private storage:Storage
    
  ) {}

  referenceNo:any;

  collect:any[]=[];

  collectObj:any

  async ngOnInit() {
    this.route.paramMap.subscribe(async (param) => {
      this.referenceNo = param.get('referenceNumber');
      let token = localStorage.getItem("userToken");
  
      const newHeader = {
        "Authorization": "Bearer " + token,
        "Accept": "*/*"
      };
  
      let url = environment.eclbDomain + "api/general/get-complaint-details/" + this.referenceNo;
      let url1 = environment.eclbDomain + "api/general/get-complain/" + this.referenceNo;
  
      if (navigator.onLine) {
        // User is online, fetch from API
        this.http.get<any>(url, { headers: newHeader }).subscribe(
          async (response) => {
            console.log(response);
            this.collect = response;
            this.collectObj = response;
  
            // Store complaint details in Ionic Storage
            await this.storage.set(`complaintDetails_${this.referenceNo}`, response);
          },
          (error) => {
            console.log(error);
            this.loadOfflineData(); // Load offline data if API fails
          }
        );
  
        this.http.get<any>(url1, { headers: newHeader }).subscribe(
          async (response) => {
            console.log(response);
            this.complains = response.comments;
            this.ecpNumber = response.ecpNumber;
            this.inspector = response.inspector;
  
            // Store complaint comments in Ionic Storage
            await this.storage.set(`complaintComments_${this.referenceNo}`, response);
          },
          (error) => {
            console.log(error);
            this.loadOfflineData(); // Load offline data if API fails
          }
        );
      } else {
        // User is offline, load from storage
        this.loadOfflineData();
      }
    });
  }
  
  // Separate function to handle loading offline data
  async loadOfflineData() {
    console.log("Loading offline data...");
    
    const storedComplaintDetails = await this.storage.get(`complaintDetails_${this.referenceNo}`);
    const storedComplaintComments = await this.storage.get(`complaintComments_${this.referenceNo}`);
  
    if (storedComplaintDetails) {
      this.collect = storedComplaintDetails;
      this.collectObj = storedComplaintDetails;
      console.log("Loaded complaint details from Ionic Storage:", this.collect);
    } else {
      console.log("No offline complaint details found.");
    }
  
    if (storedComplaintComments) {
      this.complains = storedComplaintComments.comments;
      this.ecpNumber = storedComplaintComments.ecpNumber;
      this.inspector = storedComplaintComments.inspector;
      console.log("Loaded complaint comments from Ionic Storage:", this.complains);
    } else {
      console.log("No offline complaint comments found.");
    }
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

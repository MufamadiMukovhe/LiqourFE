// complaints.page.ts
import { Component, HostListener, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { CommunicationService } from 'src/app/util/service/shared/communication.service';
import { environment } from 'src/environments/environment.prod';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.page.html',
  styleUrls: ['./complaints.page.scss'],
})
export class ComplaintsPage implements OnInit, OnDestroy {

  dropdownVisible: { [key: string]: boolean } = {};
  collect: any[] = [];
  filteredCollect: any[] = [];
  searchTerm: string = '';
  loading: boolean = true; // Loading flag
  refNum: string | undefined; // Stores the selected reference number
  private subscription: Subscription;
  referenceNumbers: string[] = []; // Array to hold all reference numbers
  constructor(
    private route: Router,
    private eRef: ElementRef,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private communicationService: CommunicationService ,// Fixed injection
    private storage:Storage
  ) {
    this.subscription = this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/complaints') {
        this.fetchComplaints();
      }
    });
  }

  ngOnInit() {
    this.fetchComplaints();
    this.communicationService.navigateToDashboard$.subscribe(() => {
      this.navigateToBack();
    });
  }

  fetchComplaints() {
    this.spinner.show();
    const url = environment.eclbDomain+"api/general/get-complaints";
    const token = localStorage.getItem("userToken");
    const newHeader = {
      "Authorization": "Bearer " + token,
      "Accept": "*/*"
    };

    this.http.get<any>(url, { headers: newHeader }).subscribe(
      async response => {
        console.log(response);
        this.collect = response;
        this.filteredCollect = response;
        this.referenceNumbers = response.map((item: any) => item.referenceNumber);

        console.log(this.referenceNumbers)
          this.filteredCollect.sort((a, b) => new Date(b.dateComplaintLogged).getTime() - new Date(a.dateComplaintLogged).getTime());
          this.filteredCollect = this.filteredCollect || []

        // Store complaints in Ionic Storage for offline use
        await this.storage.set("savedComplaints", this.filteredCollect);

        this.spinner.hide();
        this.loading = false;
        
      },
      async error => {
        // User is offline, use locally stored complaints from Ionic Storage
    const savedComplaints = await this.storage.get("savedComplaints");

    if (savedComplaints) {
      this.collect = savedComplaints;
      this.filteredCollect = this.collect;
      this.referenceNumbers = this.collect.map((item: any) => item.referenceNumber);

      this.filteredCollect.sort((a, b) => 
        new Date(b.dateComplaintLogged).getTime() - new Date(a.dateComplaintLogged).getTime()
      );

      console.log("Loaded complaints from Ionic Storage:", this.collect);
    } else {
      console.log("No offline complaints found.");
    }

    this.spinner.hide();
    this.loading = false;
  }
      
    );

    
  }

  toggleDropdown(event: Event, referenceNumber: string) {
    event.stopPropagation();
    this.dropdownVisible = {};  // Reset all dropdowns
    this.dropdownVisible[referenceNumber] = !this.dropdownVisible[referenceNumber]; // Toggle only the clicked dropdown
  }


  navigateToView() {
    this.route.navigate(['view-complaint']);
  }

  navigateToBack() {
    this.resetPage(); // Clear the page data in the background

    setTimeout(() => {
      this.route.navigate(['dashboard']); // Navigate to dashboard after a delay
    }, 0); // Delay of 0 milliseconds (0 second)
  }

  navigateToEdit() {
    this.route.navigate(['edit-complaint']);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    Object.keys(this.dropdownVisible).forEach(referenceNumber => {
      if (this.dropdownVisible[referenceNumber] && !this.eRef.nativeElement.querySelector('.header-content').contains(event.target)) {
        this.dropdownVisible[referenceNumber] = false;
      }
    });
  }

  // Searching for a Complaint
filterComplaints() {
  const term = this.searchTerm.toLowerCase();
  this.filteredCollect = this.collect.filter(complaint =>
    complaint.referenceNumber.toLowerCase().startsWith(term)
  );
}


  resetPage() {
    this.collect = [];
    this.filteredCollect = [];
    this.searchTerm = '';
    this.loading = true;
  }

  ngOnDestroy() {
    this.resetPage(); // Clear the page data when the component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}

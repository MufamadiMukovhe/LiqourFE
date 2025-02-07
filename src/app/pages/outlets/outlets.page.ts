import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Outlets } from 'src/app/model/model';
import { OutletService } from 'src/app/util/service/outlet-service';
import { environment } from 'src/environments/environment.prod';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-outlets',
  templateUrl: './outlets.page.html',
  styleUrls: ['./outlets.page.scss'],
})
export class OutletsPage implements OnInit {
  dropdownVisible: { [key: string]: boolean } = {};
  
  p: any = 1;
  itemsPerPage: any = 10
  searchTerm: string = '';


  constructor(private route: Router, private http: HttpClient, private spinner: NgxSpinnerService,  private service: OutletService,private alertController: AlertController,private router: Router,private storage: Storage) {}

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.spinner.show();
    const token = localStorage.getItem("userToken");
    const newHeader = new HttpHeaders({
      "Authorization": "Bearer " + token,
      "Accept": "*/*",
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    this.getOutlets();
  }

  outlets: Outlets[] = []
  filteredOutlets: Outlets[] = []
  private getOutlets(): void {
    this.spinner.show()
    this.service.getOutlets().subscribe({
      next: async (res: Outlets[]) => {
        this.spinner.hide()

        this.outlets = res.sort((a, b) => 
          new Date(b.frwkCreatedTimestamp).getTime() - new Date(a.frwkCreatedTimestamp).getTime()
        );
        this.filteredOutlets = this.outlets;

       
          // Store filtered outlets in storage
        await this.storage.set('outletData', this.filteredOutlets);
        console.log('Data stored:', this.filteredOutlets);
        
        console.log(this.outlets)
      }, error: async (error: any) => {
        

        // Attempt to retrieve data from storage if the API call fails
      const savedData = await this.storage.get('outletData');
      if (savedData) {
        this.outlets = savedData;
        this.filteredOutlets = savedData;

        this.spinner.hide();
        console.log('Loaded data from storage:', savedData);
      } else {
        console.error('No saved data found in storage');
      }
    }
  
    })
  }

  toggleDropdown(event: Event, referenceNumber: string) {
    event.stopPropagation();
    this.dropdownVisible = {};  // Reset all dropdowns
    this.dropdownVisible[referenceNumber] = !this.dropdownVisible[referenceNumber]; // Toggle only the clicked dropdown
  }
  navigateToBack() {
    this.route.navigate(['dashboard']);
  }
  async presentAlert(outlet: any) {
    const alert = await this.alertController.create({
      header: 'Choose an action',
      message: `What would you like to do for ${outlet.organisationName}?`,
      buttons: [
        {
          text: 'Non Compliance Deregistration section 28',
          handler: () => {
            this.router.navigate(['/non-compliance-deregistration', outlet.id]);
          },
          cssClass: 'alert-button' // Apply custom styling
        },
      
        {
          text: 'Post Registration Inspection',
          handler: () => {
            this.router.navigate(['/post-registration-inspection', outlet.id]);
          }
        },
        
        {
          text: 'Premises Description',
          handler: () => {
            this.router.navigate(['/premises-description', outlet.id]);
          }
        },
        {
          text: 'Voluntary Deregistration',
          handler: () => {
            this.router.navigate(['/deregister', outlet.id]);
          }
        },
        {
          text: 'Non Compliance Deregistration section 55',
          handler: () => {
            this.router.navigate(['/non-compliance-section55', outlet.id]);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Action cancelled');
          }
        }
      ]
    });

    await alert.present();
  }
  
  filterOutlets() {
    const search = this.searchTerm.trim().toLowerCase();
    this.filteredOutlets = this.outlets.filter(outlet =>
      outlet.organisationName?.toLowerCase().includes(search) ||
      outlet.ecpNumber?.toLowerCase().includes(search)
    );
  }
  
}

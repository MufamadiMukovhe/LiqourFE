import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment.prod';
import { Storage, StorageConfig } from '@ionic/storage-angular';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.page.html',
  styleUrls: ['./my-tasks.page.scss'],
})
export class MyTasksPage implements OnInit {
  collect: any[] = [];
  decodedToken: any;
  role: any;
  tok: any;
  isOffline: boolean = !navigator.onLine; // Track offline status
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
     private storage:Storage
  ) {
    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects.includes('/my-tasks')) {
        this.loadTasks();
      }
    });

      // Listen for online/offline status changes
      window.addEventListener('online', () => this.isOffline = false);
      window.addEventListener('offline', () => this.isOffline = true);
  }

  ngOnInit() {
    this.loadTasks();
 
  }
  ionViewWillEnter() {
    this.loadTasks();
  }
  loadTasks() {
    this.spinner.show();
    const token = localStorage.getItem('userToken');
    const newHeader = new HttpHeaders({
      "Authorization": "Bearer " + token,
      "Accept": "*/*",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "Expires": "0"
    });

      // Check if the app is online before decoding the token
  if (navigator.onLine) {

    this.tok = localStorage.getItem('uToken');
    this.decodedToken = jwtDecode(this.tok);
    this.role = this.decodedToken.scope;
    
  }

    this.http.get<any[]>(`${environment.eclbDomain}api/general/get-inbox`, { headers: newHeader }).subscribe(
      (response) => {
        this.spinner.hide();
        this.processTasks(response);
        localStorage.setItem('tasksData', JSON.stringify(this.collect));
         // Call getSummons for each task (assuming caseId exists in each task)
      this.collect.forEach(task => {
        const caseId = task.caseId; // Ensure that caseId is part of your task object
        if (caseId) {
          this.getSummons(caseId);
        }
      });
      },
      (error) => {

        console.error('Error fetching tasks:', error);
        this.spinner.hide();
        const offlineData2 = localStorage.getItem('tasksData');
            if (offlineData2) {
            this.collect = JSON.parse(offlineData2);
           console.log('Loaded offline tasks:', this.collect);
          } else {
              console.warn('No offline data available.');
              this.collect = [];
            }

       
      }
    );
  }


  processTasks(response: any[]) {
   


    if (this.role === 'INSPECTOR') {
      this.collect = response.filter((item) =>
        [
          'Complete Report',
          'Complete Inspection Report',
          'Inspector Serve Summons',
          'Inspector Serve Section 22(5) Notice',
          'Complete Supplementary Report',
          'Complete Report Query',
          'Inspector Serve Section 22(6) Notice',
          'Description of Premises',
          'Issue Section 54 Compliance Notice',
          'Upload Section 29 Non Compliance Notice',
          'Board Consideration OR Hearing',
        ].includes(item.action)
      );

      this.collect = this.collect.filter((item) => item.status !== 'Complete');
    } else {
      this.collect = response;
    }

  
    this.collect.sort((a, b) => {
      const dateA = new Date(a.assignDate).getTime() || 0;
      const dateB = new Date(b.assignDate).getTime() || 0;
      return dateB - dateA;
    });
  }

  

  navigateToBack() {
    this.route.navigate(['dashboard']);
  }

  navigateToTask(action: any, caseId: any, appType: any) {
    const routes: { [key: string]: string } = {
      'Attach and / or Verify WC Report': '',
      'Pre-Registration Inspection': '',
      'Complete Report': `/complete-inspection/${caseId}/${appType}`,
      'Complete Supplementary Report': `/complete-inspection/${caseId}/${appType}`,
      'Complete Report Query': `/complete-inspection/${caseId}/${appType}`,
      'Verify Application': '',
      'Complete GIS Report': `/complete-gis-report/${caseId}`,
      'Complete Inspection Report': `/complete-inspection/${caseId}/${appType}`,
      'Inspector Serve Summons': `/summons/${caseId}`,
      'Inspector Serve Section 22(5) Notice': `/section/${caseId}/`,
      'Inspector Serve Section 22(6) Notice': `/section/${caseId}/`,
      'Description of Premises': `/premises-description/${caseId}/`,
      'Issue Section 54 Compliance Notice': `/compliance-notice/${caseId}/`,
      'Upload Section 29 Non Compliance Notice': `/non-compliance-section29/${caseId}/`,
      'Board Consideration OR Hearing': `/board-consideration-orhearing/${caseId}/`,
    };

    if (routes[action]) {
      this.route.navigate([routes[action]]);
    } else {
      console.warn(`No route found for action: ${action}`);
    }
  }
  caseNo:any
  collectSummons:any[]=[]

 
 public async getSummons(caseId: any) {
 
  const token = localStorage.getItem('userToken');
  const newHeader = new HttpHeaders({
    "Authorization": "Bearer " + token,
    "Accept": "*/*",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Expires": "0"
  });

  let urlSummons = `${environment.eclbDomain}api/general/get-summons/${caseId}`;
 
  
  this.http.get<any>(urlSummons, { headers: newHeader }).subscribe(
    async (response) => {
      this.collectSummons = response;
      // Save the response to local storage for fallback if needed
      await this.storage.set(`summons_${caseId}`, response);
     
    },
    async (error) => {
      console.error('Error fetching summons:', error);
      
      // Fallback: Retrieve saved summons from local storage
      const savedSummons = await this.storage.get(`summons_${caseId}`);
      if (savedSummons) {
        console.log('Using saved summons data:', savedSummons);
        this.collectSummons = savedSummons;
      } else {
        console.log('No saved summons data available.');
      }
    }
  );
}

}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.page.html',
  styleUrls: ['./my-tasks.page.scss'],
})
export class MyTasksPage implements OnInit {
  collect: any[] = [];
  loading: boolean = true; 
  decodedToken: any;
  role: any;
  tok: any;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    // Refresh data when navigating back to '/my-tasks'
    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects.includes('/my-tasks')) {
        this.loadTasks();
      }
    });
  }

  ngOnInit() {
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

    this.tok = localStorage.getItem('uToken');
    this.decodedToken = jwtDecode(this.tok);
    this.role = this.decodedToken.scope;

    // **Online Mode**: Fetch tasks from the server
    if (navigator.onLine) {
      this.http.get<any[]>(`${environment.eclbDomain}api/general/get-inbox`, { headers: newHeader }).subscribe(
        (response) => {
          this.processTasks(response);
          localStorage.setItem('tasksData', JSON.stringify(this.collect)); // Save data for offline use
          this.spinner.hide();
        },
        (error) => {
          console.error('Error fetching tasks:', error);
          this.spinner.hide();
          this.loadOfflineData(); // If online fetch fails, load offline data
        }
      );
    } else {
      this.loadOfflineData(); // **Offline Mode**: Load data from localStorage
    }
  }

  // **Process tasks based on user role**
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

    // **Sort tasks by descending `assignDate`**
    this.collect.sort((a, b) => {
      const dateA = new Date(a.assignDate).getTime() || 0;
      const dateB = new Date(b.assignDate).getTime() || 0;
      return dateB - dateA;
    });
  }

  // **Load tasks from localStorage when offline**
  loadOfflineData() {
    const offlineData = localStorage.getItem('tasksData');
    if (offlineData) {
      this.collect = JSON.parse(offlineData);
      console.log('Loaded offline tasks:', this.collect);
    } else {
      console.warn('No offline data available.');
    }

    this.spinner.hide();
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
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HelperService } from 'src/app/util/service/helper.service';
import { CommunicationService } from 'src/app/util/service/shared/communication.service';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.page.html',
  styleUrls: ['./menu-header.page.scss'],
})
export class MenuHeaderPage implements OnInit {
  usernameWithSpaces: string = '';
  usernameWithDots: string = '';
  isDashboard: boolean = false;
  profileImage: any;
  username: string | undefined;

  constructor(
    private router: Router,
    private helper: HelperService,
    private communicationService: CommunicationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Subscribe to router events to track navigation changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadUsername(); // Load username on every navigation end
        this.isDashboard = this.router.url === '/dashboard'; // Check if current route is dashboard
      }
    });

    this.loadUsernameOffline(); // Load username when offline
  }

  /**
   * Load username when offline
   */
  loadUsernameOffline() {
    if (!navigator.onLine) {
      const storedUsername = localStorage.getItem('username') || 'Guest';
      this.username = storedUsername;

      // Ensure we don't call replace() on null
      this.usernameWithSpaces = storedUsername ? storedUsername.replace(/\./g, ' ') : 'Guest';
      this.usernameWithDots = storedUsername ? storedUsername.replace(/ /g, '.') : 'Guest';
    }
  }

  /**
   * Load username when online from the token
   */
  loadUsername() {
    let token = localStorage.getItem('userToken');

    if (!navigator.onLine) {
      this.loadUsernameOffline(); // If offline, use stored username
      return;
    }

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const originalUsername = decodedToken.sub;

        this.usernameWithSpaces = originalUsername.replace(/\./g, ' ');
        this.usernameWithDots = originalUsername.replace(/ /g, '.');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  /**
   * Navigate to the dashboard
   */
  toDashboard() {
    if (this.router.url === '/complaints') {
      this.communicationService.triggerNavigateToDashboard();
    } else {
      this.router.navigate(['/dashboard']); // Navigate to dashboard route
    }
  }
}

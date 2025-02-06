import { Component, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { NetworkService } from './util/service/network.service';
import { OfflineService } from 'src/app/util/service/services/offline.service';
import { Subscription } from 'rxjs';
import { Network } from '@capacitor/network'; // Import Network
import { Storage } from '@ionic/storage-angular';
import { VersionControlService } from './util/version-control.service';
import { VersionService } from './util/service/services/version.service';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  currentUrl!: string;
  isSideMenu1: boolean = true;
  activeItem: string = '';
  isOnline: boolean = true;
  private subscriptions: Subscription[] = [];
  alertController: any;
  appVersion: any;
  
  constructor(
    private menu: MenuController,
    private router: Router,
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private networkService: NetworkService,
    private offlineService: OfflineService,
    private renderer: Renderer2,
    private storage: Storage,
    private versionService: VersionService,
    private alertCtrl: AlertController,
    private verControl: VersionControlService
    
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
    this.initializeApp();
  }

  toggleMenu() {
    this.openCorrectMenu();
  }

  private openCorrectMenu() {
    const dashboardRoutes = [
      '/dashboard',
      '/upload-image',
      '/recommendations',
      '/thank-you',
      '/notifications',
      '/special-event',
      '/navigate-to-outlet',
      '/photos',
      '/addresses',
      '/view-outlet',
      '/location',
      '/complete-inspection',
      '/inspections',
      '/update-gis',
      '/my-tasks',
      '/edit-complaint2',
      '/business-conduct',
      '/verify',
      '/edit-complaint',
      '/complaints',
      '/view-complaint',
      '/help',
      '/complete-gis-report'
    ];

    const isDashboardRoute = dashboardRoutes.some(route => this.currentUrl.includes(route));

    this.menu.enable(!isDashboardRoute, 'another-menu');
    this.menu.enable(isDashboardRoute, 'main-menu');
    this.menu.open(isDashboardRoute ? 'main-menu' : 'another-menu');
  }

  addHoverEffect(id: string) {
    const activeItem = document.querySelector('.active-item');
    if (activeItem) {
      activeItem.classList.remove('active-item');
    }

    const item = document.getElementById(id);
    if (item) {
      item.classList.add('active-item');
    }

    this.router.navigateByUrl('/' + id);
  }

  setActiveItem(item: string) {
    this.activeItem = item;
    console.log('Active Item:', this.activeItem);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Lock the orientation to portrait
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
        .then(() => console.log('Orientation locked'))
        .catch(error => console.log('Error locking orientation:', error));

      // Network status listener
      Network.addListener('networkStatusChange', (status) => {
        this.isOnline = status.connected;
        if (!this.isOnline) {
          this.showAlert();
        }
      });
    });
  }

  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('uToken');
  }

  async ngOnInit() {
    //this.checkAppVersion();
    await this.storage.create();
  
    this.subscriptions.push(
      this.networkService.isOnline$.subscribe(status => {
        this.isOnline = status;
        if (!this.isOnline) {
          this.showAlert();
        }
      })
    );

    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.isOnline) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.showAlert();
      }
    });
  }

  showAlert() {
    const alertElement = document.querySelector('.network-alert');
    if (alertElement) {
      alertElement.setAttribute('style', 'display: flex');
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  
  checkAppVersion() {
    this.versionService.getLatestVersion().subscribe(
      async (data) => {
        const latestVersion = data.latestVersion;
        const downloadUrl = data.downloadUrl;
  
        // Ensure we fetch the current app version before proceeding
        this.verControl.getAppVersion().subscribe(
          async (version) => {
            this.appVersion = version;
            console.log('Current App Version:', this.appVersion); 
  
            const currentVersion = this.appVersion;
            console.log(currentVersion)
            console.log(`Current Version: ${currentVersion}, Latest Version: ${latestVersion}`);
  
            if (this.isOutdated(currentVersion, latestVersion)) {
              const alert = await this.alertCtrl.create({
                header: 'Update Required',
                message: 'A new version of the app is available. Please update to continue using the app.',
                backdropDismiss: false,
                buttons: [
                  {
                    text: 'Update Now',
                    handler: () => {
                      window.location.href = downloadUrl; // Redirect to app store or download link
                    }
                  }
                ]
              });
  
              await alert.present();
            }
          },
          (error) => console.error('Failed loading the app version:', error)
        );
      },
      (error) => {
        console.error('Error checking app version:', error);
      }
    );
  }
  
  // Correctly compare version numbers
  private isOutdated(currentVersion: string, latestVersion: string): boolean {
    const currentParts = currentVersion.split('.').map(Number);
    const latestParts = latestVersion.split('.').map(Number);
  
    for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
      const current = currentParts[i] || 0;
      const latest = latestParts[i] || 0;
      if (current < latest) return true;
      if (current > latest) return false;
    }
  
    return false;
  }
  
  
}

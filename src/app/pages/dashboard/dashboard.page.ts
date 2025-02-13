import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/util/service/helper.service';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AlertService } from 'src/app/util/service/services/alert.service';
import { OfflineService } from 'src/app/util/service/services/offline.service';

import { Network } from '@capacitor/network';
import { NgxSpinnerService } from 'ngx-spinner';
import { GisOfflineService } from 'src/app/util/service/services/gis-offline.service';
import { OfflineSummonService } from 'src/app/util/service/services/offline-summon.service';
import { ServeNoticeService } from 'src/app/util/service/services/serve-notice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  isNetworkOnline = new BehaviorSubject<boolean>(false); // Tracks network status
  isDownloading: boolean = false; // Controls spinner visibility
  constructor(private route: Router,private helper: HelperService, private alertService: AlertService,private offlineService: OfflineService, private gisOffline: GisOfflineService, private spinner: NgxSpinnerService ,private offlineSummon:OfflineSummonService,private offlineNotice:ServeNoticeService) { }

  private currentIndex: number = 0;
  private slides: HTMLElement[] = []; 
  private dots: HTMLElement[] = [];

  ngOnInit() {
     // Check network status
     this.checkNetworkStatus();
    this.alertService.checkPendingAlert();
    this.slides = Array.from(document.querySelectorAll('.slide')) as HTMLElement[];
    this.dots = Array.from(document.querySelectorAll('.dot')) as HTMLElement[];
    this.startSlideShow();
    this.startSlideShow(); 
  }

  ionViewWillEnter() {
    this.trySendReports(); 
    this.trySendGisReports();
    this.trySendSummons();
    this.trySendNotice();
  }

  private checkNetworkStatus() {
    // Listen for network changes
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed:', status.connected);
      this.isNetworkOnline.next(status.connected);
      this.trySendReports(); // Attempt to send reports when online
      this.trySendGisReports();
      this.trySendSummons();
      this.trySendNotice()
    });

    // Get initial network status
    Network.getStatus().then((status) => {
      console.log('Initial network status:', status.connected);
      this.isNetworkOnline.next(status.connected); 
      this.trySendReports(); // Attempt to send reports when online
      this.trySendGisReports();
      this.trySendSummons();
      this.trySendNotice();
    }).catch(error => {
      console.error('Error getting initial network status:', error);
    });
  }

  private trySendReports() {
    // Only attempt to send reports if the network is online
    if (this.isNetworkOnline.getValue()) {
      this.offlineService.trySendReports(); // Trigger sending reports through OfflineService
    }
  }

  private trySendGisReports() {
    // Only attempt to send GIS reports if the network is online
    if (this.isNetworkOnline.getValue()) {
      
      this.gisOffline.tryUploadGis(); // Trigger sending reports through GisService
    }
  }

  private trySendSummons(){

    if (this.isNetworkOnline.getValue()) {
    this.offlineSummon.trySendSummons();
  }

  }
  private trySendNotice(){

    if (this.isNetworkOnline.getValue()) {
    this.offlineNotice.trySendNotices();
    }
  }

  
  private startSlideShow() {
    if (this.slides.length === 0) return;

    setInterval(() => {
      this.slides[this.currentIndex].classList.remove('visible');
      this.dots[this.currentIndex].classList.remove('active');
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.slides[this.currentIndex].classList.add('visible');
      this.dots[this.currentIndex].classList.add('active');
    }, 15000);
  }

  navigateToTasks(){
    this.route.navigate(['my-tasks'])
  }

  navigateToUpdate(){
    this.route.navigate(['update-gis'])
  }

  navigateToInspection(){
    this.route.navigate(['inspections'])
  }

  navigateToComplaints(){
    this.route.navigate(['complaints'])
  }
  navigateToNavigate(){
    this.route.navigate(['navigate-to-outlet'])
  }
  navigateToSummons(){
    this.route.navigate(['summons'])
  }
}

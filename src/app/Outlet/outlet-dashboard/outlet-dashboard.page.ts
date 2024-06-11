import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-outlet-dashboard',
  templateUrl: './outlet-dashboard.page.html',
  styleUrls: ['./outlet-dashboard.page.scss'],
})
export class OutletDashboardPage implements OnInit {

  constructor(private route: Router) { }

  private currentIndex: number = 0;
  private slides: HTMLElement[] = []; 
  private dots: HTMLElement[] = [];

   ngOnInit() {
    this.slides = Array.from(document.querySelectorAll('.slide')) as HTMLElement[];
    this.dots = Array.from(document.querySelectorAll('.dot')) as HTMLElement[];
    this.startSlideShow();
  }


  private startSlideShow() {
    if (this.slides.length === 0) return;

    setInterval(() => {
      this.slides[this.currentIndex].classList.remove('visible');
      this.dots[this.currentIndex].classList.remove('active');
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.slides[this.currentIndex].classList.add('visible');
      this.dots[this.currentIndex].classList.add('active');
    }, 3000);
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

}

import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu-footer',
  templateUrl: './menu-footer.page.html',
  styleUrls: ['./menu-footer.page.scss'],
})
export class MenuFooterPage  {

  currentUrl!: string;
  constructor(private menu: MenuController,private renderer: Renderer2,private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      
      }

    });
  }

  toggleMenu() {
    this.openCorrectMenu();
  }

  private openCorrectMenu() {
    if (this.currentUrl.includes('/dashboard') || this.currentUrl.includes('/upload-image') || this.currentUrl.includes('/recommendations') || this.currentUrl.includes('/thank-you') || this.currentUrl.includes('/notifications')|| this.currentUrl.includes('/special-event')|| this.currentUrl.includes('/navigate-to-outlet')|| this.currentUrl.includes('/photos')|| this.currentUrl.includes('/addresses')|| this.currentUrl.includes('/view-outlet')|| this.currentUrl.includes('/location')|| this.currentUrl.includes('/complete-inspection')|| this.currentUrl.includes('/inspections')|| this.currentUrl.includes('/update-gis')|| this.currentUrl.includes('/my-tasks')|| this.currentUrl.includes('/edit-complaint2')|| this.currentUrl.includes('/business-conduct')|| this.currentUrl.includes('/verify')|| this.currentUrl.includes('/edit-complaint')|| this.currentUrl.includes('/complaints')|| this.currentUrl.includes('/view-complaint')|| this.currentUrl.includes('/help')||this.currentUrl.includes('/complete-gis-report')) {
      this.menu.enable(false, 'another-menu');
      this.menu.enable(true, 'main-menu');
      this.menu.open('main-menu');
    } else {
      this.menu.enable(false, 'main-menu');
      this.menu.enable(true, 'another-menu');
      this.menu.open('another-menu');
    }
  }
  


  ngOnInit() {
  }
  navigateToDashboard() {
    this.router.navigate(['dashboard']);
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

    this.router.navigateByUrl('/' + id); // Navigate to the clicked route
  }
  
  activeItem: string = '';

 
  setActiveItem(item: string) {
    this.activeItem = item;
    console.log('Active Item:', this.activeItem);
  }

  menuType: string = 'overlay';
}


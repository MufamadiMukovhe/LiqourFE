import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offline-thank-you',
  templateUrl: './offline-thank-you.page.html',
  styleUrls: ['./offline-thank-you.page.scss'],
})
export class OfflineThankYouPage implements OnInit {

  constructor(private router: Router) { }
  
    ngOnInit() {
  
      setTimeout(() => {
        this.router.navigateByUrl('/my-tasks', { skipLocationChange: true }).then(() => {
          this.router.navigate([this.router.url]);
        });;
      }, 6000);
    }

}

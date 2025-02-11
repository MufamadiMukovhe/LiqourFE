import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.page.html',
  styleUrls: ['./thank-you.page.scss'],
})
export class ThankYouPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

    setTimeout(() => {
      
      this.router.navigateByUrl('/inspections', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.router.url]);
      });
    }, 5000);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thank-you3',
  templateUrl: './thank-you3.page.html',
  styleUrls: ['./thank-you3.page.scss'],
})
export class ThankYou3Page implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {

    setTimeout(() => {
      this.router.navigate(['/my-tasks']);
    }, 5000);
  }

}

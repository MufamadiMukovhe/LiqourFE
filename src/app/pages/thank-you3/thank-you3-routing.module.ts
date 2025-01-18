import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThankYou3Page } from './thank-you3.page';

const routes: Routes = [
  {
    path: '',
    component: ThankYou3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThankYou3PageRoutingModule {}

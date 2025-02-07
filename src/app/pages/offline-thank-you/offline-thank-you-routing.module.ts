import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineThankYouPage } from './offline-thank-you.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineThankYouPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflineThankYouPageRoutingModule {}

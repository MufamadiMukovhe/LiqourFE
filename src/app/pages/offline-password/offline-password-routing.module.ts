import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflinePasswordPage } from './offline-password.page';

const routes: Routes = [
  {
    path: '',
    component: OfflinePasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflinePasswordPageRoutingModule {}

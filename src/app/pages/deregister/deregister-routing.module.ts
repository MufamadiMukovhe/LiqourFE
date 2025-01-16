import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeregisterPage } from './deregister.page';

const routes: Routes = [
  {
    path: '',
    component: DeregisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeregisterPageRoutingModule {}

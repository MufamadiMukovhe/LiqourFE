import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SapsAttachPage } from './saps-attach.page';

const routes: Routes = [
  {
    path: '',
    component: SapsAttachPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SapsAttachPageRoutingModule {}

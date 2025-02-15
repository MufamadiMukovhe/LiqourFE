import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadEnforcementMemoPage } from './upload-enforcement-memo.page';

const routes: Routes = [
  {
    path: '',
    component: UploadEnforcementMemoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadEnforcementMemoPageRoutingModule {}

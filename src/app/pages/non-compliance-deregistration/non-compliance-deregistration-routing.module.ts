import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonComplianceDeregistrationPage } from './non-compliance-deregistration.page';

const routes: Routes = [
  {
    path: '',
    component: NonComplianceDeregistrationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonComplianceDeregistrationPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonComplianceSection29Page } from './non-compliance-section29.page';

const routes: Routes = [
  {
    path: '',
    component: NonComplianceSection29Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonComplianceSection29PageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonComplianceSection55Page } from './non-compliance-section55.page';

const routes: Routes = [
  {
    path: '',
    component: NonComplianceSection55Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonComplianceSection55PageRoutingModule {}

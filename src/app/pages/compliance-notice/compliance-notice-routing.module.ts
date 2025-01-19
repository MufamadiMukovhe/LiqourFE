import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComplianceNoticePage } from './compliance-notice.page';

const routes: Routes = [
  {
    path: '',
    component: ComplianceNoticePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplianceNoticePageRoutingModule {}

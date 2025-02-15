import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueSection28ComplianceNoticePage } from './issue-section28-compliance-notice.page';

const routes: Routes = [
  {
    path: '',
    component: IssueSection28ComplianceNoticePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssueSection28ComplianceNoticePageRoutingModule {}

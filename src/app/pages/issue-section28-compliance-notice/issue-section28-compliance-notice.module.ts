import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueSection28ComplianceNoticePageRoutingModule } from './issue-section28-compliance-notice-routing.module';

import { IssueSection28ComplianceNoticePage } from './issue-section28-compliance-notice.page';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssueSection28ComplianceNoticePageRoutingModule,
    ReactiveFormsModule,
    MenuFooterPageModule,
    NgxSpinnerModule,
  ],
  declarations: [IssueSection28ComplianceNoticePage]
})
export class IssueSection28ComplianceNoticePageModule {}

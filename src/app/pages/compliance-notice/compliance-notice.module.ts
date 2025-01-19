import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComplianceNoticePageRoutingModule } from './compliance-notice-routing.module';

import { ComplianceNoticePage } from './compliance-notice.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComplianceNoticePageRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    IonicStorageModule,
    MenuFooterPageModule
  ],
  declarations: [ComplianceNoticePage]
})
export class ComplianceNoticePageModule {}

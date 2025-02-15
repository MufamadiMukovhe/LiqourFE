import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadEnforcementMemoPageRoutingModule } from './upload-enforcement-memo-routing.module';

import { UploadEnforcementMemoPage } from './upload-enforcement-memo.page';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadEnforcementMemoPageRoutingModule,
    ReactiveFormsModule,
    MenuFooterPageModule,
    NgxSpinnerModule,
  ],
  declarations: [UploadEnforcementMemoPage]
})
export class UploadEnforcementMemoPageModule {}

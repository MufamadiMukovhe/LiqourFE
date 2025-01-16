import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonComplianceDeregistrationPageRoutingModule } from './non-compliance-deregistration-routing.module';

import { NonComplianceDeregistrationPage } from './non-compliance-deregistration.page';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonComplianceDeregistrationPageRoutingModule,
    ReactiveFormsModule,
    MenuFooterPageModule,
    NgxSpinnerModule,
  ],
  declarations: [NonComplianceDeregistrationPage]
})
export class NonComplianceDeregistrationPageModule {}

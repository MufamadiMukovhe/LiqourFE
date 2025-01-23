import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonComplianceSection29PageRoutingModule } from './non-compliance-section29-routing.module';

import { NonComplianceSection29Page } from './non-compliance-section29.page';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonComplianceSection29PageRoutingModule,
    ReactiveFormsModule,
    MenuFooterPageModule,
    NgxSpinnerModule,

  ],
  declarations: [NonComplianceSection29Page]
})
export class NonComplianceSection29PageModule {}

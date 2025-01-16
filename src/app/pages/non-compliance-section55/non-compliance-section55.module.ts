import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonComplianceSection55PageRoutingModule } from './non-compliance-section55-routing.module';

import { NonComplianceSection55Page } from './non-compliance-section55.page';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonComplianceSection55PageRoutingModule,
    ReactiveFormsModule,
    MenuFooterPageModule
  ],
  declarations: [NonComplianceSection55Page]
})
export class NonComplianceSection55PageModule {}

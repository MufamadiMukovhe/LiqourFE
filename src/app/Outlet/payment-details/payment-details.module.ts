import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentDetailsPageRoutingModule } from './payment-details-routing.module';

import { PaymentDetailsPage } from './payment-details.page';
import { OutletMenuFooterPageModule } from 'src/app/outletHeaderFooter/outlet-menu-footer/outlet-menu-footer.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentDetailsPageRoutingModule,
    OutletMenuFooterPageModule
  ],
  declarations: [PaymentDetailsPage]
})
export class PaymentDetailsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflineThankYouPageRoutingModule } from './offline-thank-you-routing.module';

import { OfflineThankYouPage } from './offline-thank-you.page';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflineThankYouPageRoutingModule,
    MenuFooterPageModule
  ],
  declarations: [OfflineThankYouPage]
})
export class OfflineThankYouPageModule {}

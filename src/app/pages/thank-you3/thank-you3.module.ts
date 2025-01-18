import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThankYou3PageRoutingModule } from './thank-you3-routing.module';

import { ThankYou3Page } from './thank-you3.page';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThankYou3PageRoutingModule,
    MenuFooterPageModule
  ],
  declarations: [ThankYou3Page]
})
export class ThankYou3PageModule {}

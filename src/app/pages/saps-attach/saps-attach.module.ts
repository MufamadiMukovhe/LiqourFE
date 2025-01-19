import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SapsAttachPageRoutingModule } from './saps-attach-routing.module';

import { SapsAttachPage } from './saps-attach.page';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SapsAttachPageRoutingModule,
    ReactiveFormsModule,
    MenuFooterPageModule
  ],
  declarations: [SapsAttachPage]
})
export class SapsAttachPageModule {}

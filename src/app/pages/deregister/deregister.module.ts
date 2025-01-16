import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeregisterPageRoutingModule } from './deregister-routing.module';

import { DeregisterPage } from './deregister.page';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeregisterPageRoutingModule,
    ReactiveFormsModule,
    MenuFooterPageModule
  ],
  declarations: [DeregisterPage]
})
export class DeregisterPageModule {}

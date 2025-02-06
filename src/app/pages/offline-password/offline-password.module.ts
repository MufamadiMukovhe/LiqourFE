import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflinePasswordPageRoutingModule } from './offline-password-routing.module';

import { OfflinePasswordPage } from './offline-password.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflinePasswordPageRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule.forRoot()
  ],
  declarations: [OfflinePasswordPage]
})
export class OfflinePasswordPageModule {}

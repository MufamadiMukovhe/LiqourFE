import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InitiatePostRegistrationPageRoutingModule } from './initiate-post-registration-routing.module';

import { InitiatePostRegistrationPage } from './initiate-post-registration.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InitiatePostRegistrationPageRoutingModule,
    MenuFooterPageModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    IonicStorageModule
  ],
  declarations: [InitiatePostRegistrationPage]
})
export class InitiatePostRegistrationPageModule {}

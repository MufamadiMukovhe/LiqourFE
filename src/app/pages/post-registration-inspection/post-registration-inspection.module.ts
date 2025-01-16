import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostRegistrationInspectionPageRoutingModule } from './post-registration-inspection-routing.module';

import { PostRegistrationInspectionPage } from './post-registration-inspection.page';
import { IonicStorageModule } from '@ionic/storage-angular';

import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';
import { NgxSpinnerModule } from 'ngx-spinner';``
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostRegistrationInspectionPageRoutingModule,
    MenuFooterPageModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    IonicStorageModule,
  ],
  declarations: [PostRegistrationInspectionPage]
})
export class PostRegistrationInspectionPageModule {}

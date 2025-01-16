import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PremisesDescriptionPageRoutingModule } from './premises-description-routing.module';

import { PremisesDescriptionPage } from './premises-description.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PremisesDescriptionPageRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    IonicStorageModule,
    MenuFooterPageModule
  ],
  declarations: [PremisesDescriptionPage]
})
export class PremisesDescriptionPageModule {}

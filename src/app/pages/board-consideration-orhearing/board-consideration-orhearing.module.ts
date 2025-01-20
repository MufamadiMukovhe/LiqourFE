import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardConsiderationORHearingPageRoutingModule } from './board-consideration-orhearing-routing.module';

import { BoardConsiderationORHearingPage } from './board-consideration-orhearing.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoardConsiderationORHearingPageRoutingModule, 
    MenuFooterPageModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    IonicStorageModule
  ],
  declarations: [BoardConsiderationORHearingPage]
})
export class BoardConsiderationORHearingPageModule {}

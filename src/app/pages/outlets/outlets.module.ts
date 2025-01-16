import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OutletsPageRoutingModule } from './outlets-routing.module';

import { OutletsPage } from './outlets.page';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MenuFooterPageModule } from 'src/app/headerFooter/menu-footer/menu-footer.module';
import { MenuHeaderPageModule } from 'src/app/headerFooter/menu-header/menu-header.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterByStatusPipe } from '../pipes/filter-by-status.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OutletsPageRoutingModule,
    MenuFooterPageModule,
    MenuHeaderPageModule,
    NgxSpinnerModule.forRoot(),
    NgxPaginationModule,
  ],
  declarations: [OutletsPage,
    FilterByStatusPipe

  ]
})
export class OutletsPageModule {}

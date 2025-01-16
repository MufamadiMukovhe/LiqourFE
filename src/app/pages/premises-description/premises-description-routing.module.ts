import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PremisesDescriptionPage } from './premises-description.page';

const routes: Routes = [
  {
    path: '',
    component: PremisesDescriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PremisesDescriptionPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostRegistrationInspectionPage } from './post-registration-inspection.page';

const routes: Routes = [
  {
    path: '',
    component: PostRegistrationInspectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostRegistrationInspectionPageRoutingModule {}

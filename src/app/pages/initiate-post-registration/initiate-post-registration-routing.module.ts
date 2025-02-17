import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitiatePostRegistrationPage } from './initiate-post-registration.page';

const routes: Routes = [
  {
    path: '',
    component: InitiatePostRegistrationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitiatePostRegistrationPageRoutingModule {}

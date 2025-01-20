import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardConsiderationORHearingPage } from './board-consideration-orhearing.page';

const routes: Routes = [
  {
    path: '',
    component: BoardConsiderationORHearingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardConsiderationORHearingPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassAnalyticsPage } from './class-analytics.page';

const routes: Routes = [
  {
    path: '',
    component: ClassAnalyticsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassAnalyticsPageRoutingModule {}

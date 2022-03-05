import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonClassesPage } from './lesson-classes.page';

const routes: Routes = [
  {
    path: '',
    component: LessonClassesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonClassesPageRoutingModule {}

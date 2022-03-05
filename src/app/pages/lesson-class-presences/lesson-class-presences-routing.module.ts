import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonClassPresencesPage } from './lesson-class-presences.page';

const routes: Routes = [
  {
    path: '',
    component: LessonClassPresencesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonClassPresencesPageRoutingModule {}

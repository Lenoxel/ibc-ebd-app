import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonClassPresencesPageRoutingModule } from './lesson-class-presences-routing.module';

import { LessonClassPresencesPage } from './lesson-class-presences.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonClassPresencesPageRoutingModule
  ],
  declarations: [LessonClassPresencesPage]
})
export class LessonClassPresencesPageModule {}

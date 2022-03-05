import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonClassesPageRoutingModule } from './lesson-classes-routing.module';

import { LessonClassesPage } from './lesson-classes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonClassesPageRoutingModule
  ],
  declarations: [LessonClassesPage]
})
export class LessonClassesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonClassPresencesPageRoutingModule } from './lesson-class-presences-routing.module';

import { LessonClassPresencesPage } from './lesson-class-presences.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonClassPresencesPageRoutingModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [LessonClassPresencesPage]
})
export class LessonClassPresencesPageModule {}

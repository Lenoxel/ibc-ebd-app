import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnalyticsPageRoutingModule } from './analytics-routing.module';

import { AnalyticsPage } from './analytics.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnalyticsPageRoutingModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [AnalyticsPage]
})
export class AnalyticsPageModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AnalyticsHistoryCardComponent } from './analytics-history-card/analytics-history-card.component';
import { AnalyticsOverallCardComponent } from './analytics-overall-card/analytics-overall-card.component';
import { HeaderComponent } from './header/header.component';
import { StudentHistoryComponent } from './student-history/student-history.component';

@NgModule({
    declarations: [
        HeaderComponent,
        StudentHistoryComponent,
        AnalyticsHistoryCardComponent,
        AnalyticsOverallCardComponent,
    ],
    imports: [
        CommonModule,
        IonicModule.forRoot(),
    ],
    exports: [
        HeaderComponent,
        StudentHistoryComponent,
        AnalyticsHistoryCardComponent,
        AnalyticsOverallCardComponent,
    ]
})
export class ComponentsModule {}

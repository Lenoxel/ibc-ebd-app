import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AnalyticsHistoryCardComponent } from './analytics-history-card/analytics-history-card.component';
import { AnalyticsOverallCardComponent } from './analytics-overall-card/analytics-overall-card.component';
import { HeaderComponent } from './header/header.component';
import { StudentHistoryModalComponent } from './student-history-modal/student-history-modal.component';
import { StudentPresenceComponent } from './student-presence/student-presence.component';
import { StudentComponent } from './student/student.component';

@NgModule({
    declarations: [
        HeaderComponent,
        StudentHistoryModalComponent,
        StudentComponent,
        StudentPresenceComponent,
        AnalyticsHistoryCardComponent,
        AnalyticsOverallCardComponent,
    ],
    imports: [
        CommonModule,
        IonicModule.forRoot(),
    ],
    exports: [
        HeaderComponent,
        StudentHistoryModalComponent,
        StudentComponent,
        StudentPresenceComponent,
        AnalyticsHistoryCardComponent,
        AnalyticsOverallCardComponent,
    ]
})
export class ComponentsModule {}

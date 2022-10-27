import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { AnalyticsClassComponent } from './analytics-class/analytics-class.component';
import { AnalyticsContainerComponent } from './analytics-container/analytics-container.component';
import { AnalyticsHistoryCardComponent } from './analytics-history-card/analytics-history-card.component';
import { AnalyticsOverallCardComponent } from './analytics-overall-card/analytics-overall-card.component';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import { HeaderComponent } from './header/header.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { StudentHistoryModalComponent } from './student-history-modal/student-history-modal.component';
import { StudentPresenceComponent } from './student-presence/student-presence.component';
import { StudentComponent } from './student/student.component';

@NgModule({
    declarations: [
        AnalyticsClassComponent,
        AnalyticsContainerComponent,
        AnalyticsHistoryCardComponent,
        AnalyticsOverallCardComponent,
        DateSelectorComponent,
        HeaderComponent,
        StudentHistoryModalComponent,
        StudentComponent,
        StudentPresenceComponent,
        PeopleListComponent,
    ],
    imports: [
        CommonModule,
        IonicModule.forRoot(),
        FormsModule,
        SwiperModule,
    ],
    exports: [
        AnalyticsClassComponent,
        AnalyticsContainerComponent,
        AnalyticsHistoryCardComponent,
        AnalyticsOverallCardComponent,
        DateSelectorComponent,
        HeaderComponent,
        StudentHistoryModalComponent,
        StudentComponent,
        StudentPresenceComponent,
        PeopleListComponent,
    ]
})
export class ComponentsModule {}

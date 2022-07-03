import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { StudentHistoryComponent } from './student-history/student-history.component';

@NgModule({
    declarations: [
        HeaderComponent,
        StudentHistoryComponent,
    ],
    imports: [
        CommonModule,
        IonicModule.forRoot(),
    ],
    exports: [
        HeaderComponent,
        StudentHistoryComponent,
    ]
})
export class ComponentsModule {}

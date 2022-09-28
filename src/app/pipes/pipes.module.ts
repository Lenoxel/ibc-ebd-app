import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PeopleCountPipe } from './people-count/people-count.pipe';
import { StudentsCountPipe } from './students-count/students-count.pipe';

@NgModule({
    declarations: [
        StudentsCountPipe,
        PeopleCountPipe,
    ],
    imports: [
        IonicModule
    ],
    exports: [
        StudentsCountPipe,
        PeopleCountPipe,
    ]
})
export class PipesModule {}

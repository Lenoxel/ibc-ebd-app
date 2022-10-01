import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PeopleCountPipe } from './people-count/people-count.pipe';
import { StudentsCountPipe } from './students-count/students-count.pipe';
import { FakeArrayPipe } from './fake-array/fake-array.pipe';

@NgModule({
    declarations: [
        StudentsCountPipe,
        PeopleCountPipe,
        FakeArrayPipe,
    ],
    imports: [
        IonicModule
    ],
    exports: [
        StudentsCountPipe,
        PeopleCountPipe,
        FakeArrayPipe,
    ]
})
export class PipesModule {}

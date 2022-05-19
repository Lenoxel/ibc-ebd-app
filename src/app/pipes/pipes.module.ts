import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { StudentsCountPipe } from './students-count/students-count.pipe';

@NgModule({
    declarations: [StudentsCountPipe],
    imports: [IonicModule],
    exports: [StudentsCountPipe]
})
export class PipesModule {}

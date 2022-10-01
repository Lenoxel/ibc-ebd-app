import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HideHeaderDirective } from './hide-header/hide-header.directive';

@NgModule({
    declarations: [
        HideHeaderDirective,
    ],
    imports: [
        IonicModule,
    ],
    exports: [
        HideHeaderDirective,
    ]
})
export class DirectivesModule {}

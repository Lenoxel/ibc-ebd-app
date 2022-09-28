import { Pipe, PipeTransform } from '@angular/core';
import { IPresenceRegister } from 'src/app/interfaces/presenceRegister';

@Pipe({
  name: 'peopleCount'
})
export class PeopleCountPipe implements PipeTransform {

  transform(presenceRegisterList: IPresenceRegister[], ...args: unknown[]): number {
    return presenceRegisterList ? presenceRegisterList.length : 0;
  }

}

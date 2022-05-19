import { Pipe, PipeTransform } from '@angular/core';
import { IPresenceRegister } from 'src/app/interfaces/presenceRegister';

@Pipe({
  name: 'studentsCount'
})
export class StudentsCountPipe implements PipeTransform {

  transform(presenceRegisterList: IPresenceRegister[], ...args: unknown[]): number {
    return presenceRegisterList ? presenceRegisterList.filter(
      presenceRegister => !presenceRegister.is_teacher
      && !presenceRegister.is_secretary
      && presenceRegister.person_ebd_relation
      && presenceRegister.person_ebd_relation === 'aluno'
    ).length : 0;
  }

}

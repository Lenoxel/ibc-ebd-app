import { IEbdLabel } from './ebdLabel';

/* eslint-disable @typescript-eslint/naming-convention */
export interface IPresenceRegister {
    id: number;
    attended: boolean;
    justification: string;
    tempRegisterOn: Date;
    register_on: Date;
    person_name: string;
    person_nickname: string;
    // falta adicionar person_picture no retorno da API
    person_picture?: string;
    person_ebd_relation: string;
    is_teacher: boolean;
    is_secretary: boolean;
    lesson_title: string;
    labels?: IEbdLabel[];
    labels_to_remove?: IEbdLabel[];
    labelIds?: number[];
    underAction?: boolean;
}

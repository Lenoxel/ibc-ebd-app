import { IEbdLabel } from './ebdLabel';

/* eslint-disable @typescript-eslint/naming-convention */
export interface IPresenceRegister {
    id: number;
    attended: boolean;
    justification: string;
    tempRegisterOn: Date;
    register_on: Date;
    student_name: string;
    student_nickname: string;
    student_ebd_relation: string;
    lesson_title: string;
    labels?: IEbdLabel[];
    labelIds?: number[];
    underAction?: boolean;
}

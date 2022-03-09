/* eslint-disable @typescript-eslint/naming-convention */
export interface IPresenceRegister {
    id: number;
    attended: boolean;
    justification: string;
    register_on: Date;
    student_name: string;
    student_nickname: string;
    student_ebd_relation: string;
    lesson_title: string;
    underAction?: boolean;
}

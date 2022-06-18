import { IEbdClassLessonDetails } from '.';

/* eslint-disable @typescript-eslint/naming-convention */
export interface IEbdClass {
    class_id: number;
    class_name: string;
    lesson_title: string;
    details: IEbdClassLessonDetails;
}

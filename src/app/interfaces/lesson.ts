/* eslint-disable @typescript-eslint/naming-convention */
export interface ILesson {
    id: number;
    title: string;
    date: Date;
    is_next_lesson: boolean;
    single_class: boolean;
    presence_records: {
        presents: number;
        absents: number;
        pending: number;
    };
}

/* eslint-disable @typescript-eslint/naming-convention */
export interface IStudentHistory {
    student_name: string;
    class_name: string;
    lesson_title: string;
    lesson_date: Date;
    attended: boolean;
    justification?: string;
    register_on?: Date;
    register_by?: number;
}

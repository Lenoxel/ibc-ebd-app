/* eslint-disable @typescript-eslint/naming-convention */

type StudentInfos = {
    person_id: number;
    person_name: string;
    person_picture: string | null;
    class_name: string | null;
    presences_count?: number;
    absences_count?: number;
};

export interface IAnalyticsPresenceUsers {
    exemplary_students: StudentInfos[];
    worrying_students: StudentInfos[];
}

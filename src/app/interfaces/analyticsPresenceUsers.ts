/* eslint-disable @typescript-eslint/naming-convention */

type StudentInfo = {
    title: string;
    type: 'positive' | 'negative' | 'neutral';
    count: number;
};

type StudentAnalytics = {
    person_id: number;
    person_name: string;
    person_picture: string | null;
    class_name: string | null;
    infos: StudentInfo[];
};

export interface IAnalyticsPresenceUsers {
    exemplary_students: StudentAnalytics[];
    worrying_students: StudentAnalytics[];
}

/* eslint-disable @typescript-eslint/naming-convention */

export interface IAnalyticsPresenceClass {
    class_name: string;
    class_id: number;
    lesson_name: string;
    lesson_date: string;
    registered: number;
    presences: number;
    absences: number;
    visitors: number;
    frequency: number;
}

export interface IAnalyticsPresenceClassInfos {
    best_frequency_class: number;
    worst_frequency_class: number;
    classes: IAnalyticsPresenceClass[];
}

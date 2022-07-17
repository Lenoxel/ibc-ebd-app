/* eslint-disable @typescript-eslint/naming-convention */

export interface IAnalyticsPresenceClass {
    class_name: string;
    lesson_name: string;
    lesson_date: string;
    registered: number;
    presences: number;
    absences: number;
    visitors: number;
    frequency: number;
    bestFrequency?: boolean;
    worstFrequency?: boolean;
}

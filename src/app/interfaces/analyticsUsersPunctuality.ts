/* eslint-disable @typescript-eslint/naming-convention */

type StudentAnalytics = {
  person_id: number;
  person_name: string;
  person_picture: string | null;
  time_frequency: string;
  punctual_count: number;
};

export interface IAnalyticsUsersPunctuality {
  punctual_students: StudentAnalytics[];
}

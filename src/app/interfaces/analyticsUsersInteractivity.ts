/* eslint-disable @typescript-eslint/naming-convention */

type StudentAnalytics = {
  person_id: number;
  person_name: string;
  person_picture: string | null;
  interactive_count: number;
  collaborative_count: number;
  participative_count: number;
};

export interface IAnalyticsUsersInteractivity {
  interactive_students: StudentAnalytics[];
}

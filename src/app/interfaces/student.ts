type EBDClass = {
  id: number;
  name: string;
};

/* eslint-disable @typescript-eslint/naming-convention */
export interface IStudent {
  id: number;
  name: string;
  picture: string;
  ebd_class: EBDClass | null;
  date_of_birth?: string;
  is_birthday_person: boolean;
  whatsapp?: string;
  work_on_sundays?: boolean;
  frequency?: {
    absences_in_sequence: number;
    presences_in_sequence: number;
  };
  ebd_relation?: string;
}

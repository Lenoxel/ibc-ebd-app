/* eslint-disable @typescript-eslint/naming-convention */
export interface IStudent {
    id: number;
    name: string;
    picture: string;
    ebd_class: string;
    whatsapp?: string;
    work_on_sundays?: boolean;
    frequency?: {
        absences_in_sequence: number;
        presences_in_sequence: number;
    };
}

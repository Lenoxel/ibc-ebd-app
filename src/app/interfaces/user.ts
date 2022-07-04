import { EntityBasic } from '../types';

export interface IUser {
    email: string;
    exp: number;
    groups: EntityBasic[];
    classesAsATeacher: EntityBasic[];
    classesAsASecretary: EntityBasic[];
    iat: number;
    isSuperuser: boolean;
    jti: string;
    name: string;
    tokenType: string;
    userId: number;
    fullAccess: boolean;
}

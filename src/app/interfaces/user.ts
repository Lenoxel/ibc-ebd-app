export interface IUser {
    email: string;
    exp: number;
    groups: { id: number; name: string }[];
    classesAsATeacher: { id: number; name: string }[];
    classesAsASecretary: { id: number; name: string }[];
    iat: number;
    isSuperuser: boolean;
    jti: string;
    name: string;
    tokenType: string;
    userId: number;
    fullAccess: boolean;
}

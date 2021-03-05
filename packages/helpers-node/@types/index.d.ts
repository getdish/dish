declare module "hashPassword" {
    export function hashPassword(password: string): any;
}
declare module "ensureAdminUser" {
    export function ensureAdminUser(): Promise<void>;
}
declare module "isPasswordValid" {
    export function isPasswordValid(password: string, hash: string): any;
}
declare module "jwtSign" {
    import { User } from '@dish/graph';
    export function jwtSign(user: Pick<User, 'username' | 'id' | 'role'>): any;
}
declare module "@dish/helpers-node" {
    export * from "hashPassword";
    export * from "isPasswordValid";
    export * from "jwtSign";
    export * from "ensureAdminUser";
}

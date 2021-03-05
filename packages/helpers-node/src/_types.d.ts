/// <reference lib="dom" />
/// <reference lib="esnext" />
declare module "@dish/helpers-node" {
    export function emulateBrowserEnv(): void;
}

declare module "@dish/helpers-node" {
    export function hashPassword(password: string): any;
}

declare module "@dish/helpers-node" {
    export function ensureAdminUser(): Promise<void>;
}

declare module "@dish/helpers-node" {
    export function isPasswordValid(password: string, hash: string): any;
}

declare module "@dish/helpers-node" {
    import { User } from "@dish/graph";
    export function jwtSign(user: Pick<User, "username" | "id" | "role">): any;
}

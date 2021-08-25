declare module "@dish/helpers-node" {
    export const JWT_SECRET: string;
    export const HASURA_GRAPHQL_ADMIN_SECRET: string;
}

declare module "@dish/helpers-node" {
    import { Pool, PoolConfig, QueryResult } from "pg";
    export class Database {
        config: PoolConfig;
        pool: Pool | null;
        static get main_db(): Database;
        constructor(config: PoolConfig);
        static one_query_on_main(query: string): Promise<QueryResult<any>>;
        connect(): Promise<import("pg").PoolClient>;
        query(query: string, values?: any): Promise<QueryResult<any>>;
    }
    export const main_db: Database;
    export const db: Database;
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
    export function jwtSign(user: Pick<User, 'username' | 'id' | 'role'>): any;
}

declare module "@dish/helpers-node" {
    import { Review, ReviewTagSentence, ReviewWithId, Scalars } from "@dish/graph";
    type uuid = Scalars['uuid'];
    export function reviewFindAllForRestaurant(restaurant_id: uuid): Promise<any>;
    export function reviewFindAllForUser(user_id: uuid): Promise<any>;
    export function userFavoriteARestaurant(user_id: uuid, restaurant_id: uuid, favorited?: boolean): Promise<import("@dish/graph").WithID<import("@dish/graph").FlatResolvedModel<import("@dish/graph").ReviewQuery>>>;
    export function userFavorites(user_id: string): Promise<any>;
    export function reviewExternalUpsert(reviews: Review[]): Promise<ReviewWithId[]>;
    export function cleanReviewText(text: string | null | undefined): string;
    export function dedupeReviews(reviews: Review[]): import("@dish/graph").FlatResolvedModel<import("@dish/graph").ReviewQuery>[];
    export function dedupeSentiments<A extends ReviewTagSentence>(sentiments: A[]): A[];
    export function hashFromURLResource(url: string): Promise<any>;
}

declare module "@dish/helpers-node" {
    export { decode, encode } from "html-entities";
}
//# sourceMappingURL=types.d.ts.map

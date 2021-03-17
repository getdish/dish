/// <reference lib="dom" />
/// <reference lib="esnext" />
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

declare module "@dish/helpers-node" {
    import { Review, ReviewTagSentence, ReviewWithId, Scalars } from "@dish/graph";
    type uuid = Scalars["uuid"];
    export function reviewFindAllForRestaurant(restaurant_id: uuid): Promise<any>;
    export function reviewFindAllForUser(user_id: uuid): Promise<any>;
    export function userFavoriteARestaurant(user_id: uuid, restaurant_id: uuid, favorited?: boolean): Promise<import("@dish/graph").WithID<Review>>;
    export function userFavorites(user_id: string): Promise<any>;
    export function reviewExternalUpsert(reviews: Review[]): Promise<ReviewWithId[]>;
    export function cleanReviewText(text: string | null | undefined): string | null;
    export function dedupeReviews(reviews: Review[]): Review[];
    export function dedupeSentiments<A extends ReviewTagSentence>(sentiments: A[]): A[];
}

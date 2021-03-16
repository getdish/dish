/// <reference lib="dom" />
/// <reference lib="esnext" />
declare module "@dish/crawlers" {
    import "@dish/common";
    export const GOOGLE_SEARCH_ENDPOINT_KEY = "GOOGLE_SEARCH_ENDPOINT";
    export const LON_TOKEN = "%LON%";
    export const LAT_TOKEN = "%LAT%";
    export const google_geocoder_id_regex: RegExp;
    export class GoogleGeocoder {
        query: string;
        lon: number;
        lat: number;
        searchEndpoint: string;
        searchForID(query: string, lat: number, lon: number): Promise<string>;
        _getSearchEndpoint(): Promise<void>;
        _formatSearchURL(): string;
        _searchForID(): Promise<string>;
        _hasSearchExpired(result: string): boolean;
    }
    export function isGoogleGeocoderID(id: string): RegExpMatchArray | null;
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { Browser, Page, Request } from "puppeteer";
    export class Puppeteer {
        domain: string;
        total: number;
        request_count: number;
        blocked_count: number;
        current_scroll: number;
        page: Page;
        browser: Browser;
        aws_proxy: string;
        watch_requests_for: string;
        found_watched_request: string;
        constructor(domain: string, _aws_proxy: string | undefined);
        boot(): Promise<void>;
        startBrowser(): Promise<void>;
        restartBrowser(): Promise<void>;
        close(): Promise<void>;
        sleep(ms: number): Promise<unknown>;
        startProxyServer(): Promise<void>;
        startPuppeteer(): Promise<void>;
        interceptRequests(): Promise<void>;
        _logBlockCounts(): void;
        _interceptRequests(request: Request): Promise<void>;
        _blockImage(request: Request): boolean;
        _rewriteDomainsToAWS(request: Request): any;
        _isRequestSensitiveToAWSProxy(request: Request): true | undefined;
        _isGoogleUserContent(request: Request): any;
        _waitForSpecificRequest(request: Request): void;
        getPage(url: string): Promise<void>;
        screenshot(): Promise<void>;
        getCurrentHistoryURL(): Promise<string>;
        waitForURLChange(url: string): Promise<void>;
        getElementText(selector: string): Promise<any>;
        scrollAllIntoView(selector: string): Promise<void>;
        waitForMoreElements(selector: string, preCount: number): Promise<boolean>;
        _scrollIntoView(selector: string): Promise<void>;
        _countSelectors(selector: string): Promise<number>;
    }
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { Restaurant } from "@dish/graph";
    import { Pool, PoolConfig, QueryResult } from "pg";
    type Coord = [
        number,
        number
    ];
    export const CITY_LIST: string[];
    export function getCities(): string[];
    export class DB {
        config: PoolConfig;
        pool: Pool | null;
        constructor(config: PoolConfig);
        static main_db(): DB;
        static one_query_on_main(query: string): Promise<QueryResult<any>>;
        connect(): void;
        query(query: string): Promise<QueryResult<any>>;
    }
    export function shiftLatLonByMetres(lat: number, lon: number, diff_north: number, diff_east: number): [
        number,
        number
    ];
    export function aroundCoords(lat: number, lon: number, chunk_size: number, chunk_factor: number): Coord[];
    export function boundingBoxFromcenter(lat: number, lon: number, radius: number): [
        Coord,
        Coord
    ];
    export function geocode(address: string): Promise<Coord>;
    export function aroundCoordsGeoJSON(lat: number, lon: number, radius: number, size: number): string;
    export function toDBDate(in_date: Date | string, format?: string): string;
    export function googlePermalink(id: string, lat: number, lon: number): string;
    export function restaurantFindIDBatchForCity(size: number, previous_id: string, city: string, radius?: number): Promise<Restaurant[]>;
    export function restaurantCountForCity(city: string, radius?: number): Promise<any>;
    export function restaurantFindBasicBatchForAll(size: number, previous_id: string, extra_where?: string): Promise<Restaurant[]>;
    export function batchIDsForAll(table: string, size: number, previous_id: string, extra_where?: string): Promise<any[]>;
    export function photoBatchForAll(size: number, previous_id: string, extra_where?: string): Promise<any[]>;
    export function getTableCount(table: string, where?: string): Promise<number>;
    export function isUUID(uuid: string): RegExpMatchArray | null;
    export function restaurantDeleteOrUpdateByGeocoderID(restaurant_id: string, geocoder_id: string): Promise<void>;
    export function restaurantFindOneWithTagsSQL(restaurant_id: string): Promise<any>;
    export function roughSizeOfObject(object: any): number;
    export function decodeEntities(encodedString: any): any;
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { WorkerJob } from "@dish/worker";
    import { JobOptions, QueueOptions } from "bull";
    type BasicStore = {
        id: string;
        lat: number;
        lng: number;
    };
    export class DoorDash extends WorkerJob {
        cookie: string;
        MAPVIEW_SIZE: number;
        SEARCH_RADIUS_MULTIPLIER: number;
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        allForCity(city_name: string): Promise<void>;
        getCookie(): Promise<void>;
        graphRequest(graphql: any): Promise<any>;
        search(lat: number, lng: number): Promise<{
            [id: string]: BasicStore;
        }>;
        getStore(store: BasicStore): Promise<string | undefined>;
        static getNameAndAddress(scrape: ScrapeData): {
            name: any;
            address: any;
        };
        _searchGQL(lat: number, lng: number, page?: number): {
            operationName: string;
            variables: {
                searchLat: number;
                searchLng: number;
                offset: number;
                limit: number;
                searchQuery: null;
                filterQuery: null;
                categoryQueryId: null;
            };
            query: string;
        };
        _getStoreGQL(id: string): {
            operationName: string;
            variables: {
                storeId: string;
                locale: string;
                ddffWebHomepageCmsBanner: boolean;
                isStorePageFeedMigration: boolean;
            };
            query: string;
        };
    }
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { WorkerJob } from "@dish/worker";
    import { JobOptions, QueueOptions } from "bull";
    export class GrubHub extends WorkerJob {
        auth_token: string;
        MAPVIEW_SIZE: number;
        SEARCH_RADIUS_MULTIPLIER: number;
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        allForCity(city_name: string): Promise<void>;
        getAuthToken(): Promise<void>;
        apiRequest(path: string): Promise<any>;
        search(lat: number, lng: number): Promise<any[]>;
        getRestaurant(id: string): Promise<any>;
        static getNameAndAddress(scrape: ScrapeData): {
            name: any;
            address: any;
        };
        getReviews(id: string): Promise<any[]>;
        _getRestaurantPath(id: string): string;
        _getSearchPath(lat: number, lng: number, page?: number): string;
        _getReviewsPath(id: string, page?: number): string;
    }
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { WorkerJob } from "@dish/worker";
    import { JobOptions, QueueOptions } from "bull";
    export class Infatuated extends WorkerJob {
        longest_radius: number;
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        constructor();
        allForCity(city_name: string): Promise<void>;
        getRestaurants(center: [
            number,
            number
        ], start?: number): Promise<void>;
        saveDataFromMapSearch(data: ScrapeData): Promise<string | undefined>;
        static getNameAndAddress(scrape: ScrapeData): {
            name: any;
            address: any;
        };
    }
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { WorkerJob } from "@dish/worker";
    import { JobOptions, QueueOptions } from "bull";
    export class Michelin extends WorkerJob {
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        constructor();
        all(page?: number): Promise<void>;
        buildRequest(page: number): (string | {
            requests: {
                indexName: string;
                params: string;
            }[];
        })[];
        saveRestaurant(data: ScrapeData): Promise<string | undefined>;
        static getNameAndAddress(scrape: ScrapeData): {
            name: any;
            address: any;
        };
    }
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { WorkerJob } from "@dish/worker";
    import { JobOptions, QueueOptions } from "bull";
    export class Tripadvisor extends WorkerJob {
        scrape_id: string;
        MAPVIEW_SIZE: number;
        SEARCH_RADIUS_MULTIPLIER: number;
        _TESTS__LIMIT_GEO_SEARCH: boolean;
        detail_id: string;
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        allForCity(city_name: string): Promise<void>;
        getRestaurants(lat: number, lon: number): Promise<void>;
        getRestaurant(path: string): Promise<void>;
        saveRestaurant(data: ScrapeData): Promise<string | undefined>;
        static getNameAndAddress(scrape: ScrapeData): {
            name: string;
            address: any;
        };
        saveReviews(path: string, scrape_id: string, page: number, html?: string): Promise<void>;
        savePhotos(html: string, scrape_id: string): Promise<void>;
        parsePhotoPage(page?: number): Promise<false | any[]>;
        buildGalleryURL(page?: number): string;
        extractDetailID(path: string): string;
        static cleanName(name: string): string;
        private _persistReviewData;
        private _extractReviews;
        private getFullReviews;
        private _getRatingFromClasses;
        private _getOverview;
        private _getMenu;
        private _extractEmbeddedJSONData;
    }
    export function tripadvisorGetFBC(): Promise<import("@dish/graph").WithID<import("@dish/graph").Restaurant>>;
}

declare module "@dish/crawlers" {
    const _default: {
        JSON: {
            status: string;
            data: {
                categories: {
                    title: string;
                    categoryName: string;
                    slug: string;
                    imageUrl: string;
                }[];
                slugName: string;
                shouldIndex: boolean;
            };
        };
    };
    export default _default;
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { WorkerJob } from "@dish/worker";
    import { AxiosResponse } from "axios";
    import { JobOptions, QueueOptions } from "bull";
    export class UberEats extends WorkerJob {
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        static DELIVERY_RADIUS: number;
        world(): Promise<void>;
        getCity(city: string): Promise<void>;
        aroundCoords(lat: number, lon: number): Promise<void>;
        getFeedPage(offset: number, category: string, lat: number, lon: number): Promise<void>;
        extractRestaurantsFromFeed(response: AxiosResponse, offset: number, category: string): Promise<void>;
        getRestaurant(uuid: string): Promise<void>;
        private saveRestaurant;
        static getNameAndAddress(scrape: ScrapeData): {
            name: any;
            address: any;
        };
        private saveScrape;
        private getDishes;
        private encodeLocation;
        private loadCategories;
    }
}

declare module "@dish/crawlers" {
    import { WorkerJob } from "@dish/worker";
    import { JobOptions, QueueOptions } from "bull";
    export class Yelp extends WorkerJob {
        current?: string;
        find_only: string;
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        allForCity(city_name: string): Promise<void>;
        getRestaurants(top_right: readonly [
            number,
            number
        ], bottom_left: readonly [
            number,
            number
        ], start?: number, onlyName?: string): Promise<never[] | undefined>;
        getRestaurant(data: ScrapeData): Promise<void>;
        saveDataFromMapSearch(data: ScrapeData): Promise<string | undefined>;
        getEmbeddedJSONData(id: string, yelp_path: string, id_from_source: string): Promise<void>;
        static getNameAndAddress(scrape: ScrapeData): {
            name: any;
            address: any;
        };
        getNextScrapes(id: string, data: ScrapeData): Promise<void>;
        extractEmbeddedJSONData(obj: {
            [key: string]: any;
        }): {
            [keys: string]: any;
        } | null;
        numericKeysFix(data: {
            [key: string]: any;
        }): {
            [key: string]: any;
        };
        getPhotos(id: string, bizId: string, photo_total: number): Promise<void>;
        getPhotoPage(id: string, bizId: string, start: number, page: number): Promise<void>;
        getReviews(id: string, bizId: string, start?: number): Promise<void>;
    }
}

declare module "@dish/crawlers" {
    import { RestaurantWithId } from "@dish/graph";
    type LatLon = {
        lon: number;
        lat: number;
    };
    export type Scrape = {
        id?: string;
        time?: Date;
        restaurant_id: string;
        location: LatLon;
        source: string;
        id_from_source: string;
        data: ScrapeData;
    };
    export type ScrapeData = {
        [key: string]: any;
    };
    export function scrapeFindOneBySourceID(source: string, id: string, allow_not_found?: boolean): Promise<Scrape | null>;
    export function scrapeFindOneByUUID(id: string): Promise<Scrape>;
    export function latestScrapeForRestaurant(restaurant: RestaurantWithId, source: string): Promise<Scrape | null>;
    export function removeScrapeForRestaurant(restaurant: RestaurantWithId, source: string): Promise<void>;
    export function scrapeInsert(scrape: Scrape): Promise<string | undefined>;
    export function scrapeUpdateBasic(scrape: Scrape): Promise<any>;
    export function scrapeUpdateAllRestaurantIDs(source: string, id_from_source: string, restaurant_id: string | null): Promise<void>;
    export function scrapeMergeData(id: string, data: ScrapeData): Promise<any>;
    export function scrapeGetData(scrape: Scrape, path: string, default_value?: any): any;
    export function deleteAllScrapesBySourceID(id: string): Promise<void>;
    export function deleteAllTestScrapes(): Promise<void>;
    export function scrapeGetAllDistinct(): Promise<any[]>;
    export function scrapeUpdateGeocoderID(scrape_id: string): Promise<void>;
}

declare module "@dish/crawlers" {
    export function restaurantSaveCanonical(source: string, id_from_source: string, lon: number, lat: number, name: string, address: string): Promise<any>;
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { WorkerJob } from "@dish/worker";
    import { JobOptions, QueueOptions } from "bull";
    export class CI extends WorkerJob {
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        doIt(message: string): void;
    }
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { PhotoXref, uuid } from "@dish/graph";
    export const photoXrefUpsert: (items: Partial<PhotoXref>[], constraint?: string | undefined, opts?: import("@dish/graph").SelectionOptions | undefined) => Promise<import("@dish/graph").WithID<PhotoXref>[]>;
    export const DO_BASE = "https://dish-images.sfo2.digitaloceanspaces.com/";
    export function photoUpsert(photos: Partial<PhotoXref>[]): Promise<void>;
    export function uploadToDO(photos: Partial<PhotoXref>[]): Promise<void>;
    export function updatePhotoQuality(photos: Partial<PhotoXref>[]): Promise<void>;
    export function findNotUploadedTagPhotos(tag_id: uuid): Promise<PhotoXref[]>;
    export function bestPhotosForRestaurant(restaurant_id: uuid): Promise<PhotoXref[]>;
    export function bestPhotosForTag(tag_id: uuid): Promise<PhotoXref[]>;
    export function bestPhotosForRestaurantTags(restaurant_id: uuid): Promise<PhotoXref[]>;
    export function sendToDO(url: string, id: string): Promise<string | undefined>;
    export function findHeroImage(restaurant_id: uuid): Promise<import("@dish/graph").WithID<PhotoXref> | null>;
    export function uploadHeroImage(url: string, restaurant_id: uuid): Promise<string | undefined>;
}

declare module "@dish/crawlers" {
    export const pre_prompt = "AI Guide to Food\n\nThis guide generates summaries in the witty, sardonic, funny style of \"The Hitchikers Guide to the Galaxy\". The guide summarizes in the 3rd person from first person reviews.\n\n---\n\nSolid Vietnamese restaurant with pricing that's almost on par with Orange County! Due to the current pandemic, we could only do takeout, but the interior was very spacious looking! The menu is extensive, with lots of protein combinations for the staple dishes like vermicelli (b\u00FAn), pho, broken rice (com tam), and beef stew (bo kho). Seriously, is the SF version of Pho Lu (in Westminster, CA) or nah?! We shared the vermicelli with grilled chicken and shrimp ($10.75). The fish sauce was flavorful, albeit not spicy. The grilled chicken had a nice char to it and was juicy, plus the noodles were still warm when we got home 30 minutes later to eat it. Overall, definitely would order again to share, with an appetizer for a light dinner. Next time I'll skip the nearby boba places and get my boba here because their fruit shakes (including durian!!!) look delicious and c'mon, you know Viet places only use fresh, real fruit for them! Customer Service (3.5/5) Overall, customer service is okay. \n\n\"\"\"\n\nThe witty guide says: Servers will ignore you, who cares? The Durian Boba is so good it causes mid-life crises 10 years early. The Number 1 with Spring Rolls is so good you'll cry. It reminds  of a previous life living in the paddy fields of North Vietnam, wind in my hair, sun-drenched visions of rolling hills. Such is the power of the food here. Though  having to ask for water more than once might not seem great, that's just because they're so busy actually making food. And at the end of the day, you can just rely on the quality of the food here.\n---\n\nHands down my favorite taco joint in San Francisco (pre & post COVID). Correct me if I'm wrong but I think this is one of the few, if not the only restaurant in SF that serves birria tacos -- and they are delicious! The beef stew meat and broth on the side go so well together (remember to add the cheese!) The flavors are intense but not too overwhelming. Another plus: these are HUGE tacos; I can only eat 3 at a time.  I've been here pre-COVID, and it was packed. You order at the counter first then wait for a table to open up. You have to strategize and be quick but still be respectful of others (no table stealing!!!)  -- absolutely not a time to be shy.  They only do to-go orders during the pandemic. I called in my order and it was ready in 15 minutes. They throw in complimentary chips and salsa with your order. I definitely will be placing more orders until the shelter in place is lifted.  PS: They also have sangria to-go now. It was perfectly concocted!\n\"\"\"\n\nThe witty guide says: If you've never tried birria tacos you don't know what flavor is. So big and juicy you'll need a bib. Plus, sangria to go is a no-brainer. There's a bit of learning curve figuring how to order - go to the counter first and try not to steal anybody else's table! But 15 mins to get the order ready, they must be wizards. We give this place a double thumbs up, if for no other reason than the complimentary ships and salsa. We could talk about this place for hours, but just thinking about it makes you hungry.\n---\n";
    export const post_prompt = "\"\"\"\n\nA witty, silly guidebook says:";
}

declare module "@dish/crawlers" {
    export class GPT3 {
        crawler: Self;
        constructor(crawler: Self);
        generateGPT3Summary(): Promise<void>;
        findHighlights(): Promise<string>;
        _bySummedSentimentQuery(): string;
        _byDishCountQuery(): string;
        complete(input: string, preset?: string): Promise<string>;
    }
}

declare module "@dish/crawlers" {
    export function remove404Images(internal: Self): Promise<void>;
    export function checkMaybeDeletePhoto(photo_id: string, url: string): Promise<void>;
}

declare module "@dish/crawlers" {
    export class RestaurantBaseScore {
        crawler: Self;
        breakdown: any;
        unique_tag_id?: string;
        constructor(crawler: Self);
        calculateScore(): Promise<void>;
        upvotesDownvotes(): void;
        scoreFromPhotos(): Promise<void>;
        scoreFromVotes(): Promise<void>;
        scoreFromExternalratings(source: string): Promise<void>;
        sumScores(): void;
        sumSources(): number;
        sumReviewBands(source: string): void;
        generateSummaries(source: string): Promise<void>;
        notableReviewSQL(type: string, source: string): string;
        notableSentencesSQL(type: string, source: string): string;
        uniqueTagsSQL(source: string): string;
    }
}

declare module "@dish/crawlers" {
    export class RestaurantRatings {
        crawler: Self;
        constructor(crawler: Self);
        mergeRatings(): void;
        _infatuatedRating(): number;
        _doorDashRating(): any;
        weightRatings(ratings: {
            [source: string]: number | null;
        }, master_weights: {
            [source: string]: number;
        }): number;
        private _getMichelinRating;
    }
}

declare module "@dish/crawlers" {
    import { ReviewTagSentence } from "@dish/graph";
    export class RestaurantTagScores {
        crawler: Self;
        breakdown: any;
        total_sentences: number;
        current_sentence: number;
        ALL_SOURCES: string[];
        constructor(crawler: Self);
        calculateScores(): Promise<void>;
        findAllUnanalyzed(): Promise<import("@dish/graph").FlatResolvedModel<import("@dish/graph").review_tag_sentence>[]>;
        analyzeSentences(review_tag_sentences: ReviewTagSentence[]): Promise<import("@dish/graph").FlatResolvedModel<import("@dish/graph").review_tag_sentence>[]>;
        fetchBertBatch(review_tag_sentences: ReviewTagSentence[]): Promise<import("@dish/graph").FlatResolvedModel<import("@dish/graph").review_tag_sentence>[]>;
        bertAssessSentence(review_tag_sentence: ReviewTagSentence): Promise<{
            id: any;
            ml_sentiment: 1 | -1;
        } | undefined>;
        updateAnalyzed(review_tag_sentences: ReviewTagSentence[]): Promise<void>;
        fetchBertSentimentWithRetries(text: string): Promise<import("@dish/helpers").Sentiment | undefined>;
        updateRestaurantTagScores(): Promise<void>;
        _scoreSQL(tag_id: string, source?: string | undefined): string;
        _scoreFromSentimentSQL(tag_id: string, source?: string | undefined): string;
        _scoreFromVotesSQL(tag_id: string, source?: string | undefined): string;
        generateBreakdownSQL(tag_id: string): string;
        generateMentionsCountSQL(tag_id: string): string;
        sqlForPerSourceScore(tag_id: string, source: string): string;
        sqlForPerSourceSentiment(tag_id: string, source: string, sentiment_criteria: string): string;
        sqlForPerSourceSummary(tag_id: string, source: string, vector: string): string;
        generateUpDownSQL(): string;
    }
}

declare module "@dish/crawlers" {
    import { PhotoXref, RestaurantTag, Review, Tag } from "@dish/graph";
    type TextSource = Review | string;
    export const GEM_UIID = "da0e0c85-86b5-4b9e-b372-97e133eccb43";
    export class Tagging {
        crawler: Self;
        restaurant_tags: Partial<RestaurantTag>[];
        restaurant_tag_ratings: {
            [key: string]: number[];
        };
        all_tags: Tag[];
        found_tags: {
            [key: string]: Partial<Tag>;
        };
        SPECIAL_FILTER_THRESHOLD: number;
        naive_sentiment: any;
        all_reviews: Review[];
        constructor(crawler: Self);
        main(): Promise<void>;
        tagIfGem(): void;
        addSimpleTags(tags: string[]): Promise<void>;
        addRestaurantTags(restaurant_tags: Partial<RestaurantTag>[]): void;
        upsertCountryTags(tags: string[]): Promise<string[]>;
        _extractOrphanTags(tags: string[], country_tags: Tag[]): string[];
        updateTagRankings(): Promise<void>;
        promisedRankForTag(tag_id: string): Promise<void>;
        getRankForTag(tag_id: string): Promise<number>;
        scanCorpus(): Promise<void>;
        cleanAllSources(sources: TextSource[]): (TextSource | undefined)[];
        _collectFoundRestaurantTags(): Promise<void>;
        findPhotosForTags(): Promise<Partial<PhotoXref>[]>;
        getPhotosWithText(): any[];
        findDishesInText(all_sources: TextSource[]): Review[];
        tagFound(tag: Tag, text_source: TextSource): TextSource;
        measureSentiment(sentence: string): any;
        _getYelpReviews(): Partial<Review>[];
        _getTripadvisorReviews(): Partial<Review>[];
        _getGoogleReviews(): Review[];
        _quantiseGoogleReviewDate(date: string): string;
        _scanMenuItemsForTags(): string[];
        deDepulicateTags(): void;
    }
}

declare module "@dish/crawlers" {
    import { Restaurant } from "@dish/graph";
    export function updateAllRestaurantGeocoderIDs(internal: Self): Promise<void>;
    export function updateGeocoderID(restaurant: Restaurant): Promise<false | undefined>;
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { MenuItem, RestaurantWithId } from "@dish/graph";
    import { WorkerJob } from "@dish/worker";
    import { JobOptions, QueueOptions } from "bull";
    export class Self extends WorkerJob {
        ALL_SOURCES: string[];
        yelp: Scrape;
        ubereats: Scrape;
        infatuated: Scrape;
        michelin: Scrape;
        tripadvisor: Scrape;
        doordash: Scrape;
        grubhub: Scrape;
        google: Scrape;
        google_review_api: Scrape;
        available_sources: string[];
        main_db: DB;
        restaurant: RestaurantWithId;
        ratings: {
            [key: string]: number;
        };
        _start_time: [
            number,
            number
        ];
        tagging: Tagging;
        restaurant_ratings: RestaurantRatings;
        restaurant_base_score: RestaurantBaseScore;
        restaurant_tag_scores: RestaurantTagScores;
        gpt3: GPT3;
        menu_items: MenuItem[];
        _job_identifier_restaurant_id: string;
        _high_ram_message_sent: boolean;
        _debugRamIntervalFunction: number;
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        constructor();
        allForCity(city: string): Promise<void>;
        mergeAll(id: string): Promise<void>;
        mergeMainData(): Promise<void>;
        preMerge(restaurant: RestaurantWithId): Promise<void>;
        postMerge(): Promise<void>;
        finishTagsEtc(): Promise<void>;
        finalScores(): Promise<void>;
        noteAvailableSources(): void;
        _runFailableFunction(func: Function): Promise<void>;
        doTags(): Promise<void>;
        addPriceTags(): Promise<void>;
        findPhotosForTags(): Promise<void>;
        scanCorpus(): Promise<void>;
        getScrapeData(): Promise<void>;
        merge(strings: string[]): string;
        mergeName(): void;
        mergeTelephone(): void;
        mergeRatings(): void;
        mergeAddress(): void;
        addWebsite(): void;
        addPriceRange(): void;
        addHours(): Promise<any>;
        _toPostgresTime(day: string, time: string): string;
        oldestReview(): Promise<void>;
        addSources(): void;
        _getGoogleSource(): void;
        mergeImage(): Promise<void>;
        getUberDishes(): Promise<void>;
        getDoorDashDishes(): Promise<void>;
        getGrubHubDishes(): Promise<void>;
        mergePhotos(): Promise<void>;
        _getGooglePhotos(): string[];
        getPaginatedData(data: ScrapeData, type: "photos" | "reviews"): any[];
        getRatingFactors(): void;
        addReviewHeadlines(): Promise<void>;
        updateAllGeocoderIDs(): Promise<void>;
        updateAllDistinctScrapeGeocoderIDs(): Promise<void>;
        updateScrapeGeocoderID(scrape_id: string): Promise<void>;
        updateGeocoderID(restaurant: RestaurantWithId): Promise<void>;
        remove404Images(): Promise<void>;
        checkMaybeDeletePhoto(photo_id: string, url: string): Promise<void>;
        generateGPT3Summary(id: string): Promise<void>;
        private static shortestString;
        private static allPairs;
        private static findOverlap;
        elapsedTime(): number;
        resetTimer(): void;
        log(message: string): void;
        _debugDaemon(): void;
        _checkRAM(marker?: string): void;
        _checkNulls(): void;
    }
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { WorkerJob } from "@dish/worker";
    export class GooglePuppeteerJob extends WorkerJob {
        GOOGLE_DOMAIN: string;
        puppeteer: Puppeteer;
        booted: boolean;
        constructor();
        boot(): Promise<void>;
    }
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { Restaurant } from "@dish/graph";
    import { JobOptions, QueueOptions } from "bull";
    export class GooglePuppeteer extends GooglePuppeteerJob {
        searchEndpoint: string;
        lon: number;
        lat: number;
        name: string;
        address: string;
        googleRestaurantID: string;
        scrape_data: any;
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        allForCity(city: string): Promise<void>;
        getRestaurant(restaurant: Restaurant): Promise<void>;
        getAllData(restaurant: Restaurant): Promise<void>;
        _runFailableFunction(func: Function, restaurant: Restaurant): Promise<void>;
        getMainPage(): Promise<void>;
        static convertTableToJSON(html: string): any;
        getHeroImage(): Promise<void>;
        getSynopsis(): Promise<void>;
        getRating(): Promise<void>;
        getPricing(): Promise<void>;
        getAddress(): Promise<void>;
        getWebsite(): Promise<void>;
        getPhone(): Promise<void>;
        getHours(): Promise<void>;
    }
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { Restaurant } from "@dish/graph";
    import { WorkerJob } from "@dish/worker";
    import { JobOptions, QueueOptions } from "bull";
    export class GoogleReviewAPI extends WorkerJob {
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        allForCity(city: string): Promise<void>;
        getRestaurant(id: string): Promise<void>;
        fetchReviewPage(geocoder_id: string, page?: number): Promise<any>;
        parseReviewPage(html: any): any[];
        parseReviewText(text: string, full_text: string): string;
        parseReviewRating(stars: string | undefined): string | null;
        parseUserID(href: string | undefined): string | null;
        parsePhotos(review: any, $: any): string[];
        saveRestaurant(restaurant: Restaurant, data: ScrapeData): Promise<void>;
        static getNameAndAddress(scrape: ScrapeData): void;
    }
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { TagWithId } from "@dish/graph";
    import { WorkerJob } from "@dish/worker";
    import { JobOptions, QueueOptions } from "bull";
    export class GoogleImages extends WorkerJob {
        max_images: number;
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        constructor();
        main(): Promise<void>;
        checkForZeroUUIDRestaurant(): Promise<void>;
        imagesForDish(dish: TagWithId): Promise<void>;
        searchForImages(dish: string): Promise<string[]>;
        isImageBigEnough(line: string): boolean;
    }
}

declare module "@dish/crawlers" {
    import "@dish/helpers/polyfill";
}

declare module "@dish/crawlers" {
    import { JobOptions, QueueOptions } from "bull";
    export class UpdateSearchEndpoint extends GooglePuppeteerJob {
        searchEndpoint: string;
        lat: number;
        lon: number;
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        constructor();
        getNewSearchEndpoint(): Promise<void>;
        _templatiseSearchEndpoint(): void;
        jitter(): number;
        _theBrokenSearchBoxInteraction(): Promise<void>;
        _catchSearchEndpoint(): Promise<void>;
        _waitForSearchAPIRequest(): Promise<void>;
    }
}

declare module "@dish/crawlers" {
    import "@dish/helpers/polyfill";
}

declare module "@dish/crawlers" {
    import "@dish/helpers/polyfill";
}

declare module "@dish/crawlers" {
    type Section = {
        title: string;
        points: string[];
    };
    export class DishTag {
        crawled_countries: string[];
        static start(): Promise<void>;
        api(_page: string): Promise<import("axios").AxiosResponse<any>>;
        getEthnicCuisines(): Promise<void>;
        getDishes(country: string): Promise<void>;
        getSections(content: string, override_ignore_rules?: boolean): Promise<Section[]>;
        _inIgnoredSections(title: string): boolean;
        _inIgnoredNames(name: string): boolean;
        extractName(line: string): string | null;
    }
}

declare module "@dish/crawlers" {
    import { Tag } from "@dish/graph";
    export class ParseFiverr {
        category: Tag;
        country: Tag;
        static start(dirname?: string): Promise<void>;
        static parseFile(text: string): Promise<void>;
        checkForGeo(line: string): Promise<void>;
        checkForCategory(line: string, original: string): Promise<void>;
        _cleanCategory(string: string): string;
        addDish(line: string, original: string): Promise<void>;
    }
    export class ParseAisha {
        output: string[];
        static start(source?: string, destination?: string): void;
        parseFile(content: string): void;
        parseFirstLine(content: string): void;
        writeTxtFile(destination: string): void;
    }
    export class ParseOneBigFile {
        output: string[];
        static start(source?: string, destination?: string): void;
        writeTxtFile(destination: string): void;
    }
}

declare module "@dish/crawlers" {
    import "@dish/helpers/polyfill";
}

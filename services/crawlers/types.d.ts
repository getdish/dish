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
        _rewriteDomainsToAWS(request: Request): string | false;
        _isRequestSensitiveToAWSProxy(request: Request): true | undefined;
        _isGoogleUserContent(request: Request): boolean;
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
    import { JobOptions, QueueOptions } from "bull";
    export const PLEASE = "PLEASE";
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
        searchForID(query: string, lat: number, lon: number): Promise<any>;
        private getSearchEndpointSetting;
        private getSearchEndpoint;
        private formatSearchURL;
        private _searchForID;
        _hasSearchExpired(result: string): boolean;
    }
    export function isGoogleGeocoderID(id: string): RegExpMatchArray | null;
}

declare module "@dish/crawlers" {
    import { Pool, PoolConfig, QueryResult } from "pg";
    export class Database {
        config: PoolConfig;
        pool: Pool | null;
        static main_db: Database;
        constructor(config: PoolConfig);
        static one_query_on_main(query: string): Promise<QueryResult<any>>;
        connect(): Promise<import("pg").PoolClient>;
        query(query: string): Promise<QueryResult<any>>;
    }
    export const db: Database;
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { Restaurant } from "@dish/graph";
    type Coord = [
        number,
        number
    ];
    export const CITY_LIST: string[];
    export function getCities(): string[];
    export function shiftLatLonByMetres(lat: number, lon: number, diff_north: number, diff_east: number): [
        number,
        number
    ];
    export function aroundCoords(lat: number, lon: number, chunk_size: number, chunk_factor: number): Coord[];
    export function boundingBoxFromCenter(lat: number, lon: number, radius: number): [
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
                query: null;
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
        all(page?: number, limit?: number, find?: string): Promise<void>;
        buildRequest(page: number): (string | {
            requests: {
                indexName: string;
                params: string;
            }[];
        })[];
        saveRestaurant(data: ScrapeData): Promise<{
            id: string | undefined;
            name: any;
        }>;
        static getNameAndAddress(scrape: ScrapeData): {
            name: any;
            address: any;
        };
    }
}

declare module "@dish/crawlers" {
    export const DISH_DEBUG: number;
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
        get logName(): string;
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
    export function tripadvisorGetFBC(): Promise<import("@dish/graph").WithID<import("@dish/graph").FlatResolvedModel<import("@dish/graph").RestaurantQuery>>>;
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
        get logName(): string;
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
    const _default_1: {
        readonly legacyProps: {
            readonly props: {
                readonly modules: {
                    readonly serverModules: readonly [
                        {
                            readonly component: "InfoBox";
                            readonly props: {
                                readonly name: "Test Name Yelp";
                                readonly alternateNames: readonly [
                                ];
                                readonly rating: 4;
                                readonly reviewCount: 87;
                                readonly categories: readonly [
                                    "Pizza",
                                    "Sports Bars",
                                    "Cocktail Bars"
                                ];
                                readonly isClosed: false;
                                readonly isSaved: false;
                                readonly hours: {
                                    readonly todayFormatted: "11:00 am - 10:00 pm";
                                    readonly yesterdayFormatted: "11:00 am - 10:00 pm";
                                    readonly statusToday: 2;
                                    readonly statusYesterday: 1;
                                    readonly yesterdayDay: "Sun";
                                    readonly todayDay: "Mon";
                                };
                                readonly isUnclaimed: false;
                                readonly appointmentOnly: false;
                                readonly claimUrl: "https://biz.yelp.com/signup/B-yUH6Bc1hxy8teT4wa73A/account?utm_campaign=claim_business&amp;utm_content=claim_status_link&amp;utm_medium=m_yelp&amp;utm_source=biz_page_unclaimed";
                                readonly priceRange: 2;
                                readonly currencySymbol: "$";
                            };
                        },
                        {
                            readonly component: "ActionButtons";
                            readonly props: {
                                readonly phoneLink: "tel:+14159326132";
                                readonly websiteUrl: {
                                    readonly displayUrl: "http://www.intercontinentalsanfrancisco.com/";
                                };
                                readonly syndicationTrackingProps: {
                                    readonly thirdPartyLeadsConfig: {
                                        readonly categoryAliases: "cocktailbars,nightlife,pizza,restaurants,sportsbars";
                                        readonly city: "San Francisco";
                                        readonly state: "CA";
                                    };
                                };
                            };
                        },
                        {
                            readonly component: "ServiceUpdateSummary";
                            readonly props: {
                                readonly title: "COVID-19 Updates";
                                readonly body: {
                                    readonly text: "\"We are open for to-go cocktails, beer, wine, and food, from 11:00 am to 10:00 pm daily.  Call ahead (415-932-6132) or stop by to order.  We also offer delivery.\"";
                                    readonly messageLastUpdated: "Posted on June 13, 2020";
                                };
                                readonly attributeAvailabilitySections: readonly [
                                    {
                                        readonly title: "Updated Services";
                                        readonly source: null;
                                        readonly showSourceIcon: null;
                                        readonly attributeAvailabilityList: readonly [
                                            {
                                                readonly label: "Delivery";
                                                readonly availability: "AVAILABLE";
                                                readonly subtext: null;
                                            },
                                            {
                                                readonly label: "Takeout";
                                                readonly availability: "AVAILABLE";
                                                readonly subtext: null;
                                            }
                                        ];
                                    }
                                ];
                            };
                            readonly status: "render";
                        },
                        {
                            readonly component: "PhotoGrid";
                            readonly props: {
                                readonly media: readonly [
                                    {
                                        readonly srcUrl: "https://i.imgur.com/92a8cNI.jpg";
                                        readonly url: "/biz_photos/barrel-proof-san-francisco?select=lOPBZqhXrfyJpdsE0tI0dA";
                                        readonly type: "photo";
                                    },
                                    {
                                        readonly srcUrl: "https://i.imgur.com/N6YtgRI.jpeg";
                                        readonly url: "/biz_photos/barrel-proof-san-francisco?select=KIoGYyUHRnd_VOAJ8rQL2g";
                                        readonly type: "photo";
                                    }
                                ];
                                readonly mediaCount: 69;
                            };
                        }
                    ];
                };
                readonly bizId: "B-yUH6Bc1hxy8teT4wa73A";
                readonly initialRequestId: "0945b0912f82b7c4";
                readonly directionsModalProps: {
                    readonly businessName: "Test Name Yelp";
                    readonly directionsLink: "http://maps.google.com/maps?daddr=2331+Mission+St%2C+San+Francisco%2C+CA%2C+US%2C+94110&amp;saddr=Current+Location";
                    readonly mapState: {
                        readonly hoods: {};
                        readonly markers: readonly [
                            {
                                readonly key: "starred_location";
                                readonly location: {
                                    readonly latitude: 37.7597157;
                                    readonly longitude: -122.4188774;
                                };
                                readonly icon: {
                                    readonly regularUri: "";
                                    readonly activeUri: "";
                                    readonly name: "starred";
                                    readonly size: readonly [
                                        24,
                                        32
                                    ];
                                    readonly scaledSize: readonly [
                                        24,
                                        32
                                    ];
                                    readonly anchorOffset: readonly [
                                        12,
                                        32
                                    ];
                                    readonly regularOrigin: readonly [
                                        0,
                                        0
                                    ];
                                    readonly activeOrigin: readonly [
                                        0,
                                        0
                                    ];
                                };
                            },
                            {
                                readonly key: "current_location";
                                readonly location: null;
                                readonly icon: {
                                    readonly regularUri: "";
                                    readonly activeUri: "";
                                    readonly name: "current_location";
                                    readonly size: readonly [
                                        46,
                                        46
                                    ];
                                    readonly scaledSize: readonly [
                                        46,
                                        46
                                    ];
                                    readonly anchorOffset: readonly [
                                        23,
                                        23
                                    ];
                                    readonly regularOrigin: readonly [
                                        0,
                                        0
                                    ];
                                    readonly activeOrigin: readonly [
                                        0,
                                        0
                                    ];
                                };
                            }
                        ];
                        readonly serviceAreas: null;
                        readonly topBizBounds: null;
                        readonly geobox: null;
                        readonly center: {
                            readonly latitude: 37.7597157;
                            readonly longitude: -122.4188774;
                        };
                        readonly zoom: 15;
                        readonly scrollwheelZoom: true;
                        readonly zoomControlPosition: "top_left";
                        readonly market: null;
                        readonly overlayWidth: null;
                        readonly library: "google";
                        readonly moMapPossible: true;
                        readonly shouldDrawCheckbox: false;
                        readonly maxZoomLevel: null;
                        readonly minZoomLevel: null;
                        readonly adPinColor: null;
                        readonly fitToGeobox: false;
                    };
                    readonly mapsLibrary: "google";
                    readonly locale: "en_US";
                    readonly bunsenEventData: {
                        readonly business_id_encid: "B-yUH6Bc1hxy8teT4wa73A";
                        readonly connection_type: "map_opened";
                    };
                };
                readonly fromThisBizProps: {
                    readonly specialtiesText: "Private Parties\nLarge spaces available for reservation\n30 TV's, 2 bars, video arcade and free pool. \nKitchen open until 10 pm Sunday- Thursday and 11pm on weekends.\nAsk us about private upstairs rental for your next event.";
                    readonly yearEstablished: "2018";
                    readonly historyText: "Barrel Proof is a cocktail sports bar located in the heart of the mission. With great drinks, delicious food and large floor plan with 30 TVs, 2 pool tables and arcade games.\n\n After 8 months of remodeling and countless inspectors we finally were able to open our doors for service as of February 3, 2018.";
                    readonly bioText: null;
                    readonly ownerName: null;
                    readonly ownerRole: null;
                    readonly avatarSrc: null;
                    readonly avatarSrcSet: null;
                };
                readonly moreInfoProps: {
                    readonly businessName: "Test Name Yelp";
                    readonly bizInfo: {
                        readonly menu: {
                            readonly label: "Menu";
                            readonly linkUrl: "/biz_redir?url=http%3A%2F%2Fbarrelproofsf.com%2Fmenu%2F&amp;website_link_type=website&amp;src_bizid=B-yUH6Bc1hxy8teT4wa73A&amp;cachebuster=1621304688&amp;s=9e2567e7a6a2c6655ece392e4943d1bd14e924bfa23453f143f8fa9516bdbe81";
                            readonly linkText: "barrelproofsf.com/menu";
                        };
                        readonly bizHours: readonly [
                            {
                                readonly formattedDate: "Mon-Tue";
                                readonly formattedTime: "4:00 pm - 10:00 pm";
                            },
                            {
                                readonly formattedDate: "Wed";
                                readonly formattedTime: "4:00 pm - 12:00 am";
                            },
                            {
                                readonly formattedDate: "Thu-Fri";
                                readonly formattedTime: "4:00 pm - 2:00 am";
                            },
                            {
                                readonly formattedDate: "Sat";
                                readonly formattedTime: "2:00 pm - 2:00 am";
                            },
                            {
                                readonly formattedDate: "Sun";
                                readonly formattedTime: "2:00 pm - 10:00 pm";
                            }
                        ];
                        readonly bizSpecialHours: readonly [
                        ];
                        readonly bizAttributes: readonly [
                            {
                                readonly title: "Takes Reservations";
                                readonly label: "Yes";
                            },
                            {
                                readonly title: "Delivery";
                                readonly label: "Yes";
                            },
                            {
                                readonly title: "Take-out";
                                readonly label: "Yes";
                            },
                            {
                                readonly title: "Accepts Credit Cards";
                                readonly label: "Yes";
                            },
                            {
                                readonly title: "Parking";
                                readonly label: "Street";
                            },
                            {
                                readonly title: "Bike Parking";
                                readonly label: "Yes";
                            },
                            {
                                readonly title: "Wheelchair Accessible";
                                readonly label: "Yes";
                            },
                            {
                                readonly title: "Good for Kids";
                                readonly label: "Yes";
                            },
                            {
                                readonly title: "Good for Groups";
                                readonly label: "Yes";
                            },
                            {
                                readonly title: "Attire";
                                readonly label: "Casual";
                            },
                            {
                                readonly title: "Ambience";
                                readonly label: "Casual";
                            },
                            {
                                readonly title: "Alcohol";
                                readonly label: "Full Bar";
                            },
                            {
                                readonly title: "Good For Happy Hour";
                                readonly label: "Yes";
                            },
                            {
                                readonly title: "Best Nights";
                                readonly label: "Sat";
                            },
                            {
                                readonly title: "Smoking";
                                readonly label: "No";
                            },
                            {
                                readonly title: "Wi-Fi";
                                readonly label: "Free";
                            },
                            {
                                readonly title: "Has TV";
                                readonly label: "Yes";
                            },
                            {
                                readonly title: "Caters";
                                readonly label: "Yes";
                            },
                            {
                                readonly title: "Has Pool Table";
                                readonly label: "Yes";
                            },
                            {
                                readonly title: "Gender Neutral Restrooms";
                                readonly label: "Yes";
                            }
                        ];
                    };
                };
            };
        };
    };
    export default _default_1;
}

declare module "@dish/crawlers" {
    const _default_2: {
        readonly '@context': "http://schema.org/";
        readonly '@type': "Restaurant";
        readonly priceRange: "$11-30";
        readonly telephone: "+14159326132";
        readonly name: "Test Name Yelp";
        readonly address: {
            readonly streetAddress: "123 Street";
            readonly addressLocality: "Big City";
            readonly addressRegion: "CA";
            readonly postalCode: "94110";
            readonly addressCountry: "US";
        };
        readonly image: "https://i.imgur.com/N6YtgRI.jpg";
        readonly aggregateRating: {
            readonly '@type': "AggregateRating";
            readonly ratingValue: 4;
            readonly reviewCount: 87;
        };
        readonly servesCuisine: "Pizza";
    };
    export default _default_2;
}

declare module "@dish/crawlers" {
    const _default_3: {
        media: ({
            index: number;
            media_id: string;
            media_type: string;
            src: string;
            biz_photos_url: string;
            caption: string;
            page_title: string;
            src_high_res: string;
            video_source?: undefined;
            video_url?: undefined;
        } | {
            index: number;
            media_id: string;
            media_type: string;
            src: string;
            biz_photos_url: string;
            caption: string;
            page_title: string;
            video_source: string;
            video_url: string;
            src_high_res?: undefined;
        } | {
            index: number;
            media_id: string;
            media_type: string;
            src: string;
            biz_photos_url: string;
            caption: null;
            page_title: string;
            src_high_res: string;
            video_source?: undefined;
            video_url?: undefined;
        })[];
    };
    export default _default_3;
}

declare module "@dish/crawlers" {
    import { Restaurant } from "@dish/graph";
    export const restaurant_fixture: Partial<Restaurant>;
    export const restaurant_fixture_nearly_matches: Partial<Restaurant>;
    export type YelpDetailPageData = {
        dynamic: typeof import("fixtures/yelp-dynamic-fixture").default;
        json: typeof import("fixtures/yelp-json-fixture").default;
    };
    export type YelpPhotosData = typeof import("fixtures/yelp-photos-fixture").default;
    export type YelpListItemData = {
        name: string;
        street: string;
        businessUrl: string;
        priceRange: any;
        categories: {
            title: string;
        }[];
        formattedAddress: string;
        reviewCount: number;
        rating: number;
        neighborhoods: string[];
        phone: string;
    };
    export type YelpScrapeData = YelpDetailPageData & {
        data_from_search_list_item: YelpListItemData;
        photos: {
            [key: string]: {
                url: string;
                caption: string;
            }[];
        };
        reviews: {
            [key: string]: YelpReviewData[];
        };
    };
    const yelpReview: {
        id: string;
        tags: never[];
        user: {
            src: string;
        };
        photos: {
            src: string;
            caption: string;
        }[];
        rating: number;
        localizedDate: string;
        userId: string;
        comment: {
            text: string;
            language: string;
        };
        lightboxMediaItems: {
            url: string;
            type: string;
            user: {};
            caption: string;
        }[];
    };
    export type YelpReviewData = typeof yelpReview;
    export const yelp: Partial<YelpScrape>;
    export const ubereats: {
        source: string;
        id_from_source: string;
        data: {
            main: {
                phoneNumber: string;
                location: {
                    address: string;
                };
                title: string;
                rating: {
                    ratingValue: number;
                };
                metaJson: {};
            };
            dishes: {
                title: string;
                description: string;
                price: number;
                imageUrl: string;
            }[];
        };
    };
    export type UberEatsScrapeData = typeof ubereats['data'];
    export const doordash: {
        source: string;
        id_from_source: string;
        data: {
            storeMenuSeo: string;
            main: {
                location: {
                    address: string;
                };
                title: string;
                averageRating: number;
                rating: {
                    ratingValue: number;
                };
            };
            menus: {
                currentMenu: {
                    menuCategories: {
                        items: {
                            name: string;
                            description: string;
                            price: number;
                            imageUrl: string;
                        }[];
                    }[];
                };
            };
        };
    };
    export type DoorDashScrapeData = typeof doordash['data'];
    export const tripadvisor: {
        source: string;
        id_from_source: string;
        data: {
            overview: {
                name: string;
                links: {
                    warUrl: string;
                };
                detailCard: {
                    tagTexts: {
                        cuisines: {
                            tags: {
                                tagValue: string;
                            }[];
                        };
                        priceRange: {
                            tags: {
                                tagValue: string;
                            }[];
                        };
                    };
                };
                contact: {
                    website: string;
                    address: string;
                    phone: string;
                };
                rating: {
                    primaryRating: number;
                    ratingQuestions: {
                        name: string;
                        rating: number;
                    }[];
                };
            };
            photos: string[];
            photos_with_captions: {
                url: string;
                caption: string;
            }[];
            reviews: {
                'dishpage-0': {
                    text: string;
                    rating: number;
                    username: string;
                    date: string;
                }[];
            };
        };
    };
    export type TripAdvisorScrapeData = typeof tripadvisor['data'];
    export const google: {
        source: string;
        id_from_source: string;
        data: {
            rating: number;
            hero_image: string;
            telephone: string;
            website: string;
            pricing: string;
            reviews: string[];
        };
    };
    export type GoogleScrapeData = typeof google['data'];
    export const google_review_api: {
        source: string;
        id_from_source: string;
        data: {
            reviews: {
                user_id: string;
                name: string;
                rating: number;
                ago_text: string;
                text: string;
                photos: string[];
            }[];
        };
    };
    export type GoogleReviewScrapeData = typeof google_review_api['data'];
}

declare module "@dish/crawlers" {
    import { Restaurant } from "@dish/graph";
    import { WorkerJob } from "@dish/worker";
    import { JobOptions, QueueOptions } from "bull";
    type RestaurantMatching = Required<Pick<Restaurant, 'name' | 'address' | 'telephone'>>;
    export type YelpScrape = Scrape<YelpScrapeData>;
    export class Yelp extends WorkerJob {
        current?: string;
        find_only: RestaurantMatching | null;
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        get logName(): string;
        crawlSingle(slug: string): Promise<void>;
        refindRestaurant(rest: Restaurant): Promise<void>;
        allForCity(city_name: string): Promise<void>;
        getRestaurants(top_right: readonly [
            number,
            number
        ], bottom_left: readonly [
            number,
            number
        ], start?: number, onlyRestaurant?: RestaurantMatching | null): Promise<never[] | undefined>;
        processRestaurant(data: any): Promise<void>;
        getEmbeddedJSONData(id: string, yelp_path: string, id_from_source: string): Promise<void>;
        static getNameAndAddress(scrape: YelpScrape): {
            name: string;
            address: string;
        };
        getNextScrapes(id: string, scrape: YelpScrape): Promise<void>;
        getPhotos(id: string, bizId: string, photoTotal: number): Promise<void>;
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
    export type Scrape<D extends ScrapeData = ScrapeData> = {
        id?: string;
        time?: Date;
        restaurant_id: string;
        location: LatLon;
        source: string;
        id_from_source: string;
        data: D;
    };
    export type ScrapeData = {
        [key: string]: ScrapeData | any;
    };
    export function scrapeGetData<S extends Scrape = Scrape, Select extends Function = (s: S['data']) => any>(scrape: S | null, select: Select, defaultValue?: any): Select extends (s: S['data']) => infer Res ? Res : any;
    export function scrapeFindOneBySourceID(source: string, id: string, allow_not_found?: boolean): Promise<Scrape<ScrapeData> | null>;
    export function scrapeFindOneByUUID(id: string): Promise<Scrape<ScrapeData>>;
    export function latestScrapeForRestaurant(restaurant: RestaurantWithId, source: string): Promise<Scrape<ScrapeData> | null>;
    export function removeScrapeForRestaurant(restaurant: RestaurantWithId, source: string): Promise<void>;
    export function scrapeInsert(scrape: Scrape): Promise<string | undefined>;
    export function scrapeUpdateBasic(scrape: Scrape): Promise<any>;
    export function scrapeUpdateAllRestaurantIDs(source: string, id_from_source: string, restaurant_id: string | null): Promise<void>;
    export function scrapeMergeData(id: string, data: ScrapeData): Promise<any>;
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
    export const photoXrefUpsert: (items: Partial<import("@dish/graph").FlatResolvedModel<import("@dish/graph").PhotoXrefQuery>>[], constraint?: string | undefined, opts?: import("@dish/graph").SelectionOptions | undefined) => Promise<import("@dish/graph").WithID<import("@dish/graph").FlatResolvedModel<import("@dish/graph").PhotoXrefQuery>>[]>;
    export const photoXrefFindAll: (a: Partial<import("@dish/graph").FlatResolvedModel<import("@dish/graph").PhotoXrefQuery>>, opts?: import("@dish/graph").SelectionOptions | undefined) => Promise<import("@dish/graph").WithID<import("@dish/graph").FlatResolvedModel<import("@dish/graph").PhotoXrefQuery>>[]>;
    export const DO_BASE = "https://dish-images.sfo2.digitaloceanspaces.com/";
    export function photoUpsert(photosOg: Partial<PhotoXref>[]): Promise<void>;
    export function uploadToDO(photos: Partial<PhotoXref>[]): Promise<void>;
    export function updatePhotoQualityAndCategories(photos: Partial<PhotoXref>[]): Promise<void>;
    export function findNotUploadedTagPhotos(tag_id: uuid): Promise<PhotoXref[]>;
    export function bestPhotosForRestaurant(restaurant_id: uuid): Promise<PhotoXref[]>;
    export function bestPhotosForTag(tag_id: uuid): Promise<PhotoXref[]>;
    export function bestPhotosForRestaurantTags(restaurant_id: uuid): Promise<PhotoXref[]>;
    export function sendToDO(url: string, id: string): Promise<string | undefined>;
    export function findHeroImage(restaurant_id: uuid): Promise<import("@dish/graph").WithID<import("@dish/graph").FlatResolvedModel<import("@dish/graph").PhotoXrefQuery>> | null>;
    export function uploadHeroImage(url: string, restaurant_id: uuid): Promise<string | undefined>;
}

declare module "@dish/crawlers" {
    export const pre_prompt = "The Smart AI Guide to Food\n\nThis guide generates summaries in a witty, sardonic style.\n\n---\n\nYes, this truck is far better than Chipotle, but that's a low bar. \u00A0Yes, it's better than those multi-ethnic delis in the FiDi that happen to offer burritos as one of many food options, but also another low bar. \u00A0No, it doesn't even compare to a solid burrito at any reputable joint in the Mission. \u00A0It's just \"OK\", hence the 3-star rating. \u00A0Also, it's annoying that they charge a credit card fee; it's in fine print at the bottom of the menu so you may not even see it as you order your burrito from the top of the menu.\n\n\"\"\"\n\nThe guide says: Better than Chipotle and the delis in FiDi, but that's a low bar. Not as good as any joints in the Mission. Watch for the credit card fee.\n\n---\n\nSolid Vietnamese restaurant with pricing almost on par with Orange County! We could only do takeout, but the interior is very spacious looking! The menu is extensive, lots of protein combinations for the staple dishes like vermicelli (b\u00FAn), pho, broken rice (com tam), and beef stew (bo kho). Seriously, is the SF version of Pho Lu (in Westminster, CA) or nah?! We shared the vermicelli with grilled chicken and shrimp ($10.75). The fish sauce was flavorful, albeit not spicy. The grilled chicken had a nice char to it, the noodles were still warm when we got home 30 minutes later. Overall, definitely would order again. Next time I'll skip the nearby boba places and get my boba here because their fruit shakes (including durian!) look delicious and c'mon, you know Viet places only use fresh, real fruit for them! Customer Service (3.5/5) Overall, customer service is okay.\n\n\"\"\"\n\nThe guide says: Servers will ignore you, but who cares? The Durian Boba and The Number 1 with Spring Rolls are the real deal. A real gem of a spot. Ok customer service, have to ask for water more than once.\n---\n\nHands down my favorite taco joint in San Francisco. I think this is one of the few, if not the only restaurant in SF that serves birria tacos -- they are delicious! The beef stew meat and broth on the side go so well together (remember to add the cheese!) The flavors are intense but not too overwhelming. Another plus: these are HUGE tacos; I can only eat 3 at a time. It's always packed. You order at the counter first then wait for a table to open up. You have to strategize and be quick but still be respectful of others - absolutely not a time to be shy. They throw in complimentary chips and salsa with your order. PS: They also have sangria to-go now. It was perfectly concocted!\n\"\"\"\n\nThe guide says: Birria tacos = big flavor (remember to add cheese). Sangria to go also a no-brainer. Go to the counter first, don't steal a table! Orders come fast, plus free chips and salsa.\n---\n";
    export const post_prompt = "\"\"\"\n\nThe guide says:";
}

declare module "@dish/crawlers" {
    type OpenAIEngines = 'davinci' | 'curie' | 'babbage' | 'ada';
    export class GPT3 {
        crawler: Self;
        constructor(crawler: Self);
        generateGPT3Summary(): Promise<void>;
        findHighlights(): Promise<string>;
        _bySummedSentimentQuery(): string;
        _byDishCountQuery(): string;
        complete(input: string, engine?: OpenAIEngines, preset?: string): Promise<string>;
    }
}

declare module "@dish/crawlers" {
    export function remove404Images(internal: Self): Promise<void>;
    export function checkMaybeDeletePhoto(photo_id: string, url: string): Promise<void>;
}

declare module "@dish/crawlers" {
    import { Loggable } from "@dish/worker";
    export class RestaurantBaseScore extends Loggable {
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
    export const RESTAURANT_WEIGHTS: {
        yelp: number;
        tripadvisor: number;
        michelin: number;
        infatuated: number;
        ubereats: number;
        doordash: number;
        grubhub: number;
        google: number;
    };
    export class RestaurantRatings {
        crawler: Self;
        constructor(crawler: Self);
        mergeRatings(): void;
        _infatuatedRating(): number;
        _doorDashRating(): number | null;
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
    import { Loggable } from "@dish/worker";
    export class RestaurantTagScores extends Loggable {
        crawler: Self;
        breakdown: any;
        total_sentences: number;
        current_sentence: number;
        ALL_SOURCES: string[];
        constructor(crawler: Self);
        calculateScores(): Promise<void>;
        findAllUnanalyzed(): Promise<import("@dish/graph").FlatResolvedModel<import("@dish/graph").review_tag_sentence>[]>;
        analyzeSentences(review_tag_sentences: ReviewTagSentence[]): Promise<import("@dish/graph").FlatResolvedModel<import("@dish/graph").review_tag_sentence>[]>;
        getBertSentimentBatch(review_tag_sentences: ReviewTagSentence[]): Promise<import("@dish/graph").FlatResolvedModel<import("@dish/graph").review_tag_sentence>[]>;
        getBertSentiment(review_tag_sentence: ReviewTagSentence): Promise<{
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
    import { RestaurantTag, Review, Tag } from "@dish/graph";
    import { Loggable } from "@dish/worker";
    type TextSource = Review | string;
    type PhotoWithText = {
        url: string;
        text: string;
    };
    export const GEM_UIID = "da0e0c85-86b5-4b9e-b372-97e133eccb43";
    export class Tagging extends Loggable {
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
        get logName(): string;
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
        cleanAllSources(sources: TextSource[]): (string | import("@dish/graph").FlatResolvedModel<import("@dish/graph").ReviewQuery>)[];
        collectFoundRestaurantTags(): Promise<void>;
        findPhotosForTags(): Promise<Partial<import("@dish/graph").FlatResolvedModel<import("@dish/graph").PhotoXrefQuery>>[]>;
        getPhotosWithText(): Promise<PhotoWithText[]>;
        findDishesInText(allSources: TextSource[]): import("@dish/graph").FlatResolvedModel<import("@dish/graph").ReviewQuery>[];
        tagFound(tag: Tag, text_source: TextSource): TextSource;
        measureSentiment(sentence: string): any;
        _getYelpReviews(): Partial<import("@dish/graph").FlatResolvedModel<import("@dish/graph").ReviewQuery>>[];
        _getTripadvisorReviews(): Partial<import("@dish/graph").FlatResolvedModel<import("@dish/graph").ReviewQuery>>[];
        _getGoogleReviews(): import("@dish/graph").FlatResolvedModel<import("@dish/graph").ReviewQuery>[];
        _quantiseGoogleReviewDate(date: string): string;
        _scanMenuItemsForTags(): string[];
        deDepulicateTags(): void;
    }
}

declare module "@dish/crawlers" {
    import { Restaurant } from "@dish/graph";
    export function updateAllRestaurantGeocoderIDs(internal: Self): Promise<void>;
    export function updateGeocoderID(rest: Restaurant): Promise<false | undefined>;
}

declare module "@dish/crawlers" {
    import "@dish/common";
    import { MenuItem, RestaurantWithId } from "@dish/graph";
    import { WorkerJob } from "@dish/worker";
    import { JobOptions, QueueOptions } from "bull";
    export class Self extends WorkerJob {
        ALL_SOURCES: string[];
        yelp: YelpScrape | null;
        ubereats: Scrape<UberEatsScrapeData> | null;
        infatuated: Scrape | null;
        michelin: Scrape | null;
        tripadvisor: Scrape<TripAdvisorScrapeData> | null;
        doordash: Scrape<DoorDashScrapeData> | null;
        grubhub: Scrape | null;
        google: Scrape<GoogleScrapeData> | null;
        google_review_api: Scrape<GoogleReviewScrapeData> | null;
        available_sources: string[];
        main_db: Database;
        restaurant: RestaurantWithId;
        ratings: {
            [key: string]: number;
        };
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
        get logName(): string;
        constructor();
        allForCity(city: string): Promise<void>;
        mergeAll(id: string): Promise<void>;
        getScrapeData(): Promise<void>;
        mergeMainData(): Promise<void>;
        preMerge(restaurant: RestaurantWithId): Promise<void>;
        postMerge(): Promise<void>;
        finishTagsEtc(): Promise<void>;
        finalScores(): Promise<void>;
        noteAvailableSources(): void;
        doTags(): Promise<void>;
        addPriceTags(): Promise<void>;
        findPhotosForTags(): Promise<void>;
        scanCorpus(): Promise<void>;
        merge(strings: string[]): string;
        mergeName(): void;
        mergeTelephone(): void;
        mergeRatings(): void;
        mergeAddress(): void;
        addWebsite(): void;
        addPriceRange(): void;
        addHours(): Promise<{
            count: any;
            records: string[];
        }>;
        oldestReview(): Promise<void>;
        addSourceOgIds(): void;
        addSources(): void;
        _getGoogleSource(): void;
        mergeImage(): Promise<void>;
        getUberDishes(): Promise<void>;
        getDoorDashDishes(): Promise<void>;
        getGrubHubDishes(): Promise<void>;
        mergePhotos(): Promise<void>;
        _getGooglePhotos(): string[];
        getPaginatedData<A extends any>(data: {
            [key: string]: A[];
        } | null): A[];
        getRatingFactors(): void;
        addReviewHeadlines(): Promise<void>;
        updateAllGeocoderIDs(): Promise<void>;
        updateAllDistinctScrapeGeocoderIDs(): Promise<void>;
        updateScrapeGeocoderID(scrape_id: string): Promise<void>;
        updateGeocoderID(restaurant: RestaurantWithId): Promise<void>;
        remove404Images(): Promise<void>;
        checkMaybeDeletePhoto(photo_id: string, url: string): Promise<void>;
        generateSummary(): Promise<void>;
        generateGPT3Summary(id: string): Promise<void>;
        private static shortestString;
        private static allPairs;
        private static findOverlap;
        _debugDaemon(): void;
        _checkRAM(marker?: string): void;
        _checkNulls(): void;
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
        runFailableFn(func: Function, restaurant: Restaurant): Promise<void>;
        getMainPage(): Promise<boolean>;
        static convertTableToJSON(html: string): {
            day: any;
            hours: any;
        }[];
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
        get logName(): string;
        allForCity(city: string): Promise<void>;
        getRestaurant(id: string): Promise<void>;
        fetchReviewPage(geocoder_id: string, nextPageToken: string): Promise<any>;
        parseReviewPage(html: string): {
            data: any[];
            nextPageToken: string | undefined;
        };
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
        get logName(): string;
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
    export function one(slug: string): Promise<void>;
}

declare module "@dish/crawlers" {
    import "@dish/helpers/polyfill";
    export function one(slug: string): Promise<void>;
}

declare module "@dish/crawlers" {
    export function one(slug: string): Promise<void>;
}

declare module "@dish/crawlers" {
    import "@dish/helpers/polyfill";
    export function one(slug: string): Promise<void>;
}

declare module "@dish/crawlers" {
    import "@dish/helpers/polyfill";
    export function main(slug: string): Promise<void>;
}

declare module "@dish/crawlers" {
    export function one(): Promise<void>;
}

declare module "@dish/crawlers" {
    const _default_4: {
        data: {
            storeSearchQuery: {
                stores: {
                    name: string;
                    id: string;
                    description: string;
                    averageRating: number;
                    numRatings: number;
                    numRatingsDisplayString: string;
                    priceRange: number;
                    deliveryFee: null;
                    extraSosDeliveryFee: null;
                    displayDeliveryFee: string;
                    headerImgUrl: string;
                    url: string;
                    isConsumerSubscriptionEligible: boolean;
                    distanceFromConsumer: number;
                    distanceFromConsumerInMeters: number;
                    distanceFromConsumerString: string;
                    menus: {
                        popularItems: {
                            imgUrl: string;
                            __typename: string;
                        }[];
                        __typename: string;
                    }[];
                    merchantPromotions: null;
                    status: {
                        unavailableReason: null;
                        asapAvailable: boolean;
                        scheduledAvailable: boolean;
                        asapMinutesRange: number[];
                        asapPickupMinutesRange: number[];
                        __typename: string;
                    };
                    location: {
                        lat: number;
                        lng: number;
                        __typename: string;
                    };
                    badge: null;
                    storeBadges: never[];
                    isSponsored: boolean;
                    __typename: string;
                }[];
                storeItems: {
                    name: string;
                    id: string;
                    price: number;
                    imageUrl: string;
                    store: {
                        name: string;
                        url: string;
                        id: string;
                        __typename: string;
                    };
                    __typename: string;
                }[];
                numStores: number;
                next: string;
                __typename: string;
            };
        };
        extensions: {
            requestInfo: {
                version: number;
                requestId: string;
                correlationId: string;
            };
            upstreamServiceInfo: {
                version: number;
            };
        };
    };
    export default _default_4;
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
//# sourceMappingURL=types.d.ts.map

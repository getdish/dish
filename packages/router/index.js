"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Route = exports.useRouterSelector = exports.useRouter = exports.ProvideRouter = exports.getHistoryItem = exports.getPathFromParams = exports.Router = void 0;
var use_store_1 = require("@dish/use-store");
var history_1 = require("history");
var React = require("react");
var react_1 = require("react");
var tiny_request_router_1 = require("tiny-request-router");
// TODO fix HistoryType to narrow types
var USE_MEMORY = process.env.TARGET === 'node' ||
    typeof document === 'undefined' ||
    (navigator === null || navigator === void 0 ? void 0 : navigator.userAgent.includes('jsdom'));
var history = USE_MEMORY ? (0, history_1.createMemoryHistory)() : (0, history_1.createBrowserHistory)();
var Router = /** @class */ (function (_super) {
    __extends(Router, _super);
    function Router() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.router = new tiny_request_router_1.Router();
        _this.routes = {};
        _this.routeNames = [];
        _this.routePathToName = {};
        _this.notFound = false;
        _this.history = [];
        _this.stack = [];
        _this.stackIndex = 0;
        _this.alert = null;
        _this.getPathFromParams = getPathFromParams.bind(null, _this);
        _this.routeChangeListeners = new Set();
        _this.nextNavItem = null;
        return _this;
    }
    Router.prototype.mount = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        var routes = this.props.routes;
        this.routes = routes;
        this.routeNames = Object.keys(routes);
        this.routePathToName = Object.keys(routes).reduce(function (acc, key) {
            acc[routes[key].path] = key;
            return acc;
        }, {});
        var nextRouter = this.router;
        for (var _i = 0, _g = this.routeNames; _i < _g.length; _i++) {
            var name_1 = _g[_i];
            nextRouter = nextRouter.get(routes[name_1].path, name_1);
        }
        nextRouter = nextRouter.all('*', '404');
        this.router = nextRouter;
        history.listen(function (event) {
            var state = event.location.state;
            var id = state === null || state === void 0 ? void 0 : state.id;
            var prevItems = _this.stack.slice(0, _this.stackIndex);
            var nextItems = _this.stack.slice(_this.stackIndex + 1);
            var direction = event.action === 'POP'
                ? prevItems.some(function (x) { return x.id === id; })
                    ? 'backward'
                    : nextItems.some(function (x) { return x.id === id; })
                        ? 'forward'
                        : 'none'
                : 'none';
            var type = event.action === 'REPLACE' ? 'replace' : event.action === 'POP' ? 'pop' : 'push';
            if (type === 'pop' && direction == 'none') {
                // happens when they go back after a hard refresh, change to push
                type = 'push';
                direction = 'forward';
            }
            // if (process.env.DEBUG) {
            //   // prettier-ignore
            //   console.log('router.history', { type,direction,event,state,prevItem,nextItem,stack: this.stack })
            // }
            _this.handlePath(event.location.pathname, {
                id: id,
                direction: direction,
                type: type
            });
        });
        // initial entry
        if (!this.props.skipInitial) {
            var pathname = ((_b = (_a = window.location) === null || _a === void 0 ? void 0 : _a.pathname) !== null && _b !== void 0 ? _b : '')
                // temp bugfix: react native has debugger-ui as window.location
                .replace(/\/debugger-ui.*/g, '/');
            history.push({
                pathname: pathname,
                search: (_d = (_c = window.location) === null || _c === void 0 ? void 0 : _c.search) !== null && _d !== void 0 ? _d : '',
                hash: (_f = (_e = window.location) === null || _e === void 0 ? void 0 : _e.hash) !== null && _f !== void 0 ? _f : ''
            }, {
                id: uid()
            });
        }
    };
    Object.defineProperty(Router.prototype, "prevPage", {
        get: function () {
            return this.stack[this.stackIndex - 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "curPage", {
        get: function () {
            var _a;
            return (_a = this.stack[this.stackIndex]) !== null && _a !== void 0 ? _a : defaultPage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "prevHistory", {
        get: function () {
            return this.history[this.history.length - 2];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "curHistory", {
        get: function () {
            var _a;
            return (_a = this.history[this.history.length - 1]) !== null && _a !== void 0 ? _a : defaultPage;
        },
        enumerable: false,
        configurable: true
    });
    Router.prototype.handlePath = function (pathname, item) {
        var _a, _b;
        var match = this.router.match('GET', pathname);
        if (!match) {
            console.log('no match', pathname, item);
            return;
        }
        var next = __assign(__assign({ name: match.handler, path: pathname, params: __assign({}, Object.keys(match.params).reduce(function (acc, key) {
                var _a;
                acc[key] = decodeURIComponent((_a = match.params[key]) !== null && _a !== void 0 ? _a : '');
                return acc;
            }, {})), search: (_b = (_a = window.location) === null || _a === void 0 ? void 0 : _a.search) !== null && _b !== void 0 ? _b : '' }, (item.type === 'push' &&
            this.nextNavItem && {
            data: this.nextNavItem.data
        })), item);
        this.history = __spreadArray(__spreadArray([], this.history, true), [next], false);
        switch (item.direction) {
            case 'forward':
                if (this.stackIndex === this.stack.length - 1) {
                    return;
                }
                this.stackIndex++;
                break;
            case 'backward':
                if (this.stackIndex === 0) {
                    return;
                }
                this.stackIndex--;
                break;
            case 'none':
                if (item.type === 'replace') {
                    this.stack[this.stackIndex] = next;
                    this.stack = __spreadArray([], this.stack, true);
                }
                else {
                    if (this.stackIndex < this.stack.length) {
                        // remove future states on next push
                        this.stack = this.stack.slice(0, this.stackIndex + 1);
                    }
                    this.stack = __spreadArray(__spreadArray([], this.stack, true), [next], false);
                    this.stackIndex = this.stack.length - 1;
                }
                break;
        }
        // if (process.env.NODE_ENV === 'development') {
        //   console.log('router.handlePath', JSON.stringify({ item, next }, null, 2))
        // }
        this.routeChangeListeners.forEach(function (x) { return x(next); });
    };
    Router.prototype.onRouteChange = function (cb, ignoreHistory) {
        var _this = this;
        if (ignoreHistory === void 0) { ignoreHistory = false; }
        if (!ignoreHistory) {
            if (this.history.length) {
                for (var _i = 0, _a = this.history; _i < _a.length; _i++) {
                    var item = _a[_i];
                    cb(item);
                }
            }
        }
        this.routeChangeListeners.add(cb);
        return function () {
            _this.routeChangeListeners["delete"](cb);
        };
    };
    Router.prototype.getShouldNavigate = function (navItem) {
        var historyItem = getHistoryItem(this, navItem);
        var sameName = historyItem.name === this.curPage.name;
        var sameParams = isEqual(this.getNormalizedParams(historyItem.params), this.getNormalizedParams(this.curPage.params));
        return !sameName || !sameParams;
    };
    // remove nullish params
    Router.prototype.getNormalizedParams = function (params) {
        var obj = params !== null && params !== void 0 ? params : {};
        return Object.keys(obj).reduce(function (acc, cur) {
            if (obj[cur]) {
                acc[cur] = obj[cur];
            }
            return acc;
        }, {});
    };
    Router.prototype.getIsRouteActive = function (navItem) {
        return !this.getShouldNavigate(navItem);
    };
    Router.prototype.navigate = function (navItem) {
        var _a, _b;
        var item = getHistoryItem(this, navItem);
        if (this.notFound) {
            this.notFound = false;
        }
        if (!this.getShouldNavigate(navItem)) {
            return;
        }
        this.nextNavItem = navItem;
        var params = {
            id: (_a = item === null || item === void 0 ? void 0 : item.id) !== null && _a !== void 0 ? _a : uid()
        };
        if ((_b = this.alert) === null || _b === void 0 ? void 0 : _b.condition(navItem)) {
            if (!confirm(this.alert.message)) {
                return;
            }
        }
        var to = item.path;
        if (item.type === 'replace') {
            history.replace(to, params);
        }
        else {
            history.push(to, params);
        }
    };
    Router.prototype.setParams = function (params) {
        this.navigate({
            name: this.curPage.name,
            search: this.curPage.search,
            params: __assign(__assign({}, this.curPage.params), params),
            replace: true
        });
    };
    Router.prototype.back = function () {
        history.back();
    };
    Router.prototype.forward = function () {
        history.forward();
    };
    Router.prototype.setRouteAlert = function (alert) {
        var _this = this;
        var prev = this.alert;
        this.alert = alert;
        setUnloadCondition(alert);
        return function () {
            setUnloadCondition(prev);
            _this.alert = prev;
        };
    };
    return Router;
}(use_store_1.Store));
exports.Router = Router;
var stripExtraPathSegments = function (path) {
    return path.replace(/\/:[a-zA-Z-_]+[\?]?/g, '');
};
function getPathFromParams(_a, _b) {
    var _c;
    var routes = _a.routes;
    var name = _b.name, params = _b.params;
    if (!name) {
        return "";
    }
    // object to path
    var route = routes[name];
    if (!route) {
        console.log("no route", name, routes);
        return "";
    }
    if (!route.path) {
        console.log("no route path", route, name, routes);
        return "";
    }
    var path = route.path;
    if (!params) {
        return stripExtraPathSegments(path);
    }
    var replaceSplatParams = [];
    for (var key in params) {
        if (typeof params[key] === 'undefined') {
            continue;
        }
        if (path.includes(':')) {
            path = path.replace(new RegExp(":" + key + "[?]?"), (_c = params[key]) !== null && _c !== void 0 ? _c : '-');
        }
        else if (path.indexOf('*') > -1) {
            replaceSplatParams.push(key);
        }
    }
    // remove unused optionals optionals
    if (path.includes('/:')) {
        path = stripExtraPathSegments(path);
    }
    if (replaceSplatParams.length) {
        path = path.replace('*', replaceSplatParams.map(function (key) { return key + "/" + params[key]; }).join('/'));
    }
    return path;
}
exports.getPathFromParams = getPathFromParams;
function getHistoryItem(router, navItem) {
    var _a, _b;
    var params = {};
    // remove undefined params
    if ('params' in navItem) {
        var p = navItem['params'];
        for (var key in p) {
            var val = p[key];
            if (typeof val !== 'undefined') {
                params[key] = val;
            }
        }
    }
    return {
        id: uid(),
        direction: 'none',
        name: navItem.name,
        type: navItem.replace ? 'replace' : 'push',
        params: params,
        path: getPathFromParams(router, {
            name: navItem.name,
            params: params
        }),
        search: (_b = (_a = window.location) === null || _a === void 0 ? void 0 : _a.search) !== null && _b !== void 0 ? _b : ''
    };
}
exports.getHistoryItem = getHistoryItem;
// react stuff
var RouterPropsContext = (0, react_1.createContext)(null);
function ProvideRouter(props) {
    return (<RouterPropsContext.Provider value={props.routes}>{props.children}</RouterPropsContext.Provider>);
}
exports.ProvideRouter = ProvideRouter;
function useRouter() {
    var routes = (0, react_1.useContext)(RouterPropsContext);
    if (!routes) {
        throw new Error("Must <ProvideRouter /> above this component");
    }
    return (0, use_store_1.useStore)(Router, { routes: routes });
}
exports.useRouter = useRouter;
function useRouterSelector(selector) {
    var routes = (0, react_1.useContext)(RouterPropsContext);
    if (!routes) {
        throw new Error("Must <ProvideRouter /> above this component");
    }
    return (0, use_store_1.useStoreSelector)(Router, selector, { routes: routes });
}
exports.useRouterSelector = useRouterSelector;
var Route = /** @class */ (function () {
    function Route(path, page, params) {
        this.path = path;
        this.page = page;
        this.params = params;
    }
    Route.prototype.toString = function () {
        return JSON.stringify({
            path: this.path,
            params: this.params
        });
    };
    return Route;
}());
exports.Route = Route;
// state
var defaultPage = {
    id: '0',
    name: 'null',
    path: '/',
    params: {},
    type: 'push',
    search: '',
    direction: 'none'
};
var uid = function () { return ("" + Math.random()).replace('.', ''); };
var isObject = function (x) { return x && "" + x === "[object Object]"; };
var isEqual = function (a, b) {
    if ((!a && b) || (!b && a))
        return false;
    if (!a && !b)
        return a === b;
    var eqLen = Object.keys(a).length === Object.keys(b).length;
    if (!eqLen) {
        return false;
    }
    for (var k in a) {
        if (k in b) {
            if (isObject(a[k]) && isObject(b[k])) {
                if (!isEqual(a[k], b[k])) {
                    return false;
                }
            }
            if (a[k] !== b[k]) {
                return false;
            }
        }
    }
    return true;
};
function setUnloadCondition(alert) {
    window.onbeforeunload = function () { return ((alert === null || alert === void 0 ? void 0 : alert.condition('unload')) ? alert.message : null); };
}
// const router = createStore(Router, {
//   routes: {
//     name: new Route<{ hi: boolean }>(''),
//     alt: new Route<{ other: string }>(''),
//     alt2: new Route(''),
//   },
// })
//
// // good
// router.navigate({
//   name: 'name',
//   params: {
//     hi: true,
//   },
// })
// router.navigate({
//   name: 'alt2',
// })
// router.navigate({
//   name: 'alt',
//   params: {
//     other: '',
//   },
// })
// // bad
// router.navigate({
//   name: 'alt',
//   replace: '',
//   params: {
//     hi: true,
//   },
// })
// router.navigate({
//   name: 'alt',
//   params: {
//     other: true,
//   },
// })
// router.navigate({
//   name: 'name',
//   params: {
//     hi: '',
//   },
// })
// router.navigate({
//   name: 'falsename',
//   params: {
//     hi: '',
//   },
// })

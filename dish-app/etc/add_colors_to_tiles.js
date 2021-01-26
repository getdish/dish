"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require("@dish/helpers/polyfill");
var graph_1 = require("@dish/graph");
var getColorsForName_1 = require("../src/helpers/getColorsForName");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateNeighborhoods()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, updateCounties()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function updateCounties() {
    return __awaiter(this, void 0, void 0, function () {
        var tiles, _loop_1, _i, tiles_1, _a, slug, ogc_fid;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, graph_1.resolved(function () {
                        return graph_1.query
                            .hrr({
                            where: {
                                slug: {
                                    _neq: null
                                },
                                color: {
                                    _eq: null
                                }
                            }
                        })
                            .map(function (x) { return ({ ogc_fid: x.ogc_fid, slug: x.slug }); });
                    })];
                case 1:
                    tiles = _b.sent();
                    _loop_1 = function (slug, ogc_fid) {
                        var name_1, colors;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!slug) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    name_1 = slug.replace(/[a-z]+\-/i, '');
                                    colors = getColorsForName_1.getColorsForName(name_1);
                                    if (!colors) return [3 /*break*/, 2];
                                    console.log('setting', name_1, slug, colors.color);
                                    return [4 /*yield*/, graph_1.mutate(function (mutation) {
                                            var res = mutation.update_hrr_by_pk({
                                                pk_columns: {
                                                    ogc_fid: ogc_fid
                                                },
                                                _set: {
                                                    color: colors.color
                                                }
                                            });
                                            if (res) {
                                                return res.__typename;
                                            }
                                        })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, tiles_1 = tiles;
                    _b.label = 2;
                case 2:
                    if (!(_i < tiles_1.length)) return [3 /*break*/, 5];
                    _a = tiles_1[_i], slug = _a.slug, ogc_fid = _a.ogc_fid;
                    return [5 /*yield**/, _loop_1(slug, ogc_fid)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function updateNeighborhoods() {
    return __awaiter(this, void 0, void 0, function () {
        var tiles, _loop_2, _i, tiles_2, _a, slug, ogc_fid;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, graph_1.resolved(function () {
                        return graph_1.query
                            .zcta5({
                            where: {
                                slug: {
                                    _neq: null
                                },
                                color: {
                                    _eq: null
                                }
                            }
                        })
                            .map(function (x) { return ({ ogc_fid: x.ogc_fid, slug: x.slug }); });
                    })];
                case 1:
                    tiles = _b.sent();
                    _loop_2 = function (slug, ogc_fid) {
                        var name_2, colors;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!slug) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    name_2 = slug.replace(/[a-z]+\-/i, '');
                                    colors = getColorsForName_1.getColorsForName(name_2);
                                    if (!colors) return [3 /*break*/, 2];
                                    return [4 /*yield*/, graph_1.mutate(function (mutation) {
                                            var res = mutation.update_zcta5_by_pk({
                                                pk_columns: {
                                                    ogc_fid: ogc_fid
                                                },
                                                _set: {
                                                    color: colors.color
                                                }
                                            });
                                            if (res) {
                                                return res.__typename;
                                            }
                                        })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, tiles_2 = tiles;
                    _b.label = 2;
                case 2:
                    if (!(_i < tiles_2.length)) return [3 /*break*/, 5];
                    _a = tiles_2[_i], slug = _a.slug, ogc_fid = _a.ogc_fid;
                    return [5 /*yield**/, _loop_2(slug, ogc_fid)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();

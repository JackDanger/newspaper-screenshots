var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var _this = this;
var fs = require('fs');
var Nightmare = require('nightmare');
function driver() {
    return Nightmare({
        width: 3072,
        height: 1920 * 3,
        gotoTimeout: 4 * 60 * 1000,
        waitTimeout: 2 * 60 * 1000,
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36",
        show: false
    });
}
function currentDatestamp() {
    // e.g. "2020-02-29"
    return (new Date()).toISOString().split('T')[0];
}
var Publication = /** @class */ (function () {
    function Publication(name, homepage, thingsToHide) {
        this.name = name;
        this.homepage = homepage;
        this.thingsToHide = thingsToHide;
    }
    Publication.prototype.retrieve = function (nightmareConnection) {
        var start = new Date();
        var dirname = "screenshots/" + currentDatestamp();
        var pngFilename = dirname + "/" + this.name + ".png";
        fs.mkdir('screenshots', function () {
            fs.mkdir(dirname, function () { });
        });
        return nightmareConnection
            .goto(this.homepage)
            .evaluate(function (name, homepage) { return console.log("Retrieving " + name + " from " + homepage); }, this.name, this.homepage)
            .wait(5 * 1000)
            .evaluate(function (selector) {
            var link = document.querySelector(selector);
            if (link) {
                link.click();
            }
        }, '.clickhere') // currently just for Times of India
            .evaluate(function (selector) {
            if (selector.length) {
                document.querySelectorAll(selector).forEach(function (e) { return e.style = 'display: none'; });
            }
        }, this.thingsToHide)
            .wait(5 * 1000)
            .screenshot(pngFilename)
            .evaluate(function (name, start) { return console.log("  finished " + name + " in " + ((new Date()).valueOf() - start.valueOf())); }, this.name, start);
    };
    return Publication;
}());
var publications = [
    new Publication("aljazeera", "https://www.aljazeera.com/", ""),
    new Publication("bild", "https://www.bild.de/", ""),
    new Publication("chicago-sun-times", "https://chicago.suntimes.com/", ""),
    new Publication("chicago-tribune", "https://www.chicagotribune.com/", ""),
    new Publication("dainik-bhaskar", "https://www.bhaskar.com/", ""),
    new Publication("guangdong-daily", "http://www.newsgd.com/", ""),
    new Publication("guardian", "https://www.theguardian.com/us", "#cmpContainer"),
    new Publication("le-monde", "https://www.lemonde.fr/", ""),
    new Publication("los-angeles-times", "https://www.latimes.com/", "#ensNotifyBanner, .met-flyout, iframe, .GoogleDfpAd-wrapper"),
    new Publication("new-york-times", "https://www.nytimes.com/", ""),
    new Publication("peoples-daily", "http://en.people.cn/", ".tips"),
    new Publication("reuters", "https://www.reuters.com/", "#floating-leaderboard"),
    new Publication("san-francisco-chronicle", "https://www.sfchronicle.com/", ".fancybox-overlay"),
    new Publication("seattle-times", "https://www.seattletimes.com/", ""),
    new Publication("tampa-bay-times", "https://tampabay.com/", "#gdpr, .browser-warning"),
    new Publication("times-of-india", "https://timesofindia.indiatimes.com/us", ""),
    new Publication("usa-today", "https://www.usatoday.com/", ".onetrust-consent-sdk"),
    new Publication("wall-street-journal", "https://www.wsj.com/", ".cx-candybar, #AD_PUSH"),
    new Publication("washington-post", "https://www.washingtonpost.com/", ""),
    new Publication("yomiuri-shimbun", "https://www.yomiuri.co.jp/", ""),
];
if (require.main == module) {
    var start = new Date();
    Promise.resolve((function () { return __awaiter(_this, void 0, void 0, function () {
        var _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _loop_1 = function (i) {
                        var publication;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    publication = publications[i];
                                    console.log(publication.name + " starting");
                                    return [4 /*yield*/, publication
                                            .retrieve(driver())
                                            .end()
                                            .then(function () { return console.log(publication.name + " complete in " + ((new Date()).valueOf() - start.valueOf()) / 1000); })["catch"](console.log)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < publications.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); })());
}

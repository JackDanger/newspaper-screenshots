var fs = require('fs');
var Nightmare = require('nightmare');
var nightmare = Nightmare({ width: 3072, height: 1920 * 3, show: false });
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
    var nightmareDriver = nightmare;
    // Chain these calls together
    publications.forEach(function (publication) { return nightmareDriver = publication.retrieve(nightmareDriver).end(); });
    nightmareDriver
        .end()
        .then(function () { return console.log("Script complete in " + ((new Date()).valueOf() - start.valueOf())); })["catch"](console.log);
}

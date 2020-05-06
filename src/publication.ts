//function currentDatestamp(){
//  // e.g. "2020-02-29"
//  return (new Date()).toISOString().split('T')[0];
//}

export class Publication {
  name: string;
  homepage: string;
  thingsToHide: string;

  constructor(name: string, homepage: string, thingsToHide: string) {
    this.name = name;
    this.homepage = homepage;
    this.thingsToHide = thingsToHide;
  }
}

export const publications: Publication[] = [
  new Publication("atlanta-journal-constitution","https://www.ajc.com/",                   ""),
  new Publication("aljazeera",                   "https://www.aljazeera.com/",             ""),
  new Publication("bild",                        "https://www.bild.de/",                   ""),
  new Publication("chicago-sun-times",           "https://chicago.suntimes.com/",          ""),
  new Publication("chicago-tribune",             "https://www.chicagotribune.com/",        ""),
  new Publication("dainik-bhaskar",              "https://www.bhaskar.com/",               ""),
  new Publication("frankfurter-allgemeine",      "https://www.faz.net/aktuell/",           ""),
  new Publication("google-news",                 "https://news.google.com",                ""),
  new Publication("guangdong-daily",             "http://www.newsgd.com/",                 ""),
  new Publication("guardian",                    "https://www.theguardian.com/us",         "#cmpContainer"),
  new Publication("handelsblatt",                "https://www.handelsblatt.com/",          ""),
  new Publication("le-monde",                    "https://www.lemonde.fr/",                ""),
  new Publication("latimes",                     "https://www.latimes.com/",               "#ensNotifyBanner, .met-flyout, iframe, .GoogleDfpAd-wrapper, body>div[draggable=false]"),
  new Publication("nytimes",                     "https://www.nytimes.com/",               ""),
  new Publication("peoples-daily",               "http://en.people.cn/",                   ".tips"),
  new Publication("reuters",                     "https://www.reuters.com/",               "#floating-leaderboard"),
  new Publication("san-francisco-chronicle",     "https://www.sfchronicle.com/",           ".fancybox-overlay"),
  new Publication("seattle-times",               "https://www.seattletimes.com/",          ""),
  new Publication("tampa-bay-times",             "https://tampabay.com/",                  "#gdpr, .browser-warning"),
  new Publication("times-of-india",              "https://timesofindia.indiatimes.com/us", ""),
  new Publication("usa-today",                   "https://www.usatoday.com/",              ".onetrust-consent-sdk"),
  new Publication("wall-street-journal",         "https://www.wsj.com/",                   ".cx-candybar, #AD_PUSH"),
  new Publication("washington-post",             "https://www.washingtonpost.com/",        ""),
  new Publication("yomiuri-shimbun",             "https://www.yomiuri.co.jp/",             ""),
]

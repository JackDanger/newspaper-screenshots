const fs = require('fs') 
const Nightmare = require('nightmare');

function driver() {
  return Nightmare({
    width: 3072,
    height: 1920 * 3,
    gotoTimeout: 4 * 60 * 1000,
    waitTimeout: 2 * 60 * 1000,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36",
    show: false
  })
}

function currentDatestamp(){
  // e.g. "2020-02-29"
  return (new Date()).toISOString().split('T')[0];
}

class Publication {
  name: string;
  homepage: string;
  thingsToHide: string;

  constructor(name: string, homepage: string, thingsToHide: string) {
    this.name = name;
    this.homepage = homepage;
    this.thingsToHide = thingsToHide;
  }

  retrieve(nightmareConnection) {
    let start = new Date();
    let dirname = `screenshots/${currentDatestamp()}`;
    let pngFilename = `${dirname}/${this.name}.png`;

    fs.mkdir('screenshots', function(){
      fs.mkdir(dirname, function(){})
    })

    return nightmareConnection
      .goto(this.homepage)
      //.evaluate((name, homepage) => console.log(`Retrieving ${name} from ${homepage}`), this.name, this.homepage)
      .wait(5 * 1000)
      .evaluate(selector => {
        try {
          let link: HTMLElement = document.querySelector(selector)
          if (link) {
            link.click()
          }
        } catch (e) {
          console.log(e)
        }
      }, '.clickhere') // currently just for Times of India
      .evaluate(selector => {
        try {
          if (selector.length) {
            document.querySelectorAll(selector).forEach((e) => e.style = 'display: none')
          }
        } catch (e) {
          console.log(e)
        }
      }, this.thingsToHide)
      .wait(5 * 1000)
      .screenshot(pngFilename)
      //.evaluate((name, start) => console.log(`  finished ${name} in ${(new Date()).valueOf() - start.valueOf()}`), this.name, start)
  }
}

const publications: Publication[] = [
  new Publication("aljazeera",               "https://www.aljazeera.com/",             ""),
  new Publication("bild",                    "https://www.bild.de/",                   ""),
  new Publication("chicago-sun-times",       "https://chicago.suntimes.com/",          ""),
  new Publication("chicago-tribune",         "https://www.chicagotribune.com/",        ""),
  new Publication("dainik-bhaskar",          "https://www.bhaskar.com/",               ""),
  new Publication("guangdong-daily",         "http://www.newsgd.com/",                 ""),
  new Publication("guardian",                "https://www.theguardian.com/us",         "#cmpContainer"),
  new Publication("le-monde",                "https://www.lemonde.fr/",                ""),
  new Publication("los-angeles-times",       "https://www.latimes.com/",               "#ensNotifyBanner, .met-flyout, iframe, .GoogleDfpAd-wrapper"),
  new Publication("new-york-times",          "https://www.nytimes.com/",               ""),
  new Publication("peoples-daily",           "http://en.people.cn/",                   ".tips"),
  new Publication("reuters",                 "https://www.reuters.com/",               "#floating-leaderboard"),
  new Publication("san-francisco-chronicle", "https://www.sfchronicle.com/",           ".fancybox-overlay"),
  new Publication("seattle-times",           "https://www.seattletimes.com/",          ""),
  new Publication("tampa-bay-times",         "https://tampabay.com/",                  "#gdpr, .browser-warning"),
  new Publication("times-of-india",          "https://timesofindia.indiatimes.com/us", ""),
  new Publication("usa-today",               "https://www.usatoday.com/",              ".onetrust-consent-sdk"),
  new Publication("wall-street-journal",     "https://www.wsj.com/",                   ".cx-candybar, #AD_PUSH"),
  new Publication("washington-post",         "https://www.washingtonpost.com/",        ""),
  new Publication("yomiuri-shimbun",         "https://www.yomiuri.co.jp/",             ""),
]


if (require.main == module) {
  var start = new Date();
  Promise.resolve((async () => {
    for (let i = 0; i < publications.length; i++) {
      let publication = publications[i];

      console.log(`${publication.name} starting`)

      await publication
      .retrieve(driver())
      .end()
      .then(() => console.log(`${publication.name} complete in ${((new Date()).valueOf() - start.valueOf()) / 1000}`))
      .catch(console.log)
    }
  })())
}

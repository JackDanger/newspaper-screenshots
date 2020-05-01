import fs from 'fs';
import * as Nightmare from 'nightmare';

function currentDatestamp(){
  // e.g. "2020-02-29"
  return (new Date()).toISOString().split('T')[0];
}

type Fetchable = {
  name: string;
  homepage: string;
  thingsToHide: string;
  retrieve: (driver: Nightmare) => Nightmare;
}

export class Publication implements Fetchable {
  name: string;
  homepage: string;
  thingsToHide: string;

  constructor(name: string, homepage: string, thingsToHide: string) {
    this.name = name;
    this.homepage = homepage;
    this.thingsToHide = thingsToHide;
  }

  retrieve(driver: Nightmare) {
    let dirname = `screenshots/${currentDatestamp()}`;
    let pngFilename = `${dirname}/${this.name}.png`;

    fs.mkdir('screenshots', function(){
      fs.mkdir(dirname, function(){})
    })

    return driver
      .goto(this.homepage)
      //.evaluate((name, homepage) => console.log(`Retrieving ${name} from ${homepage}`), this.name, this.homepage)
      .wait(10 * 1000)
      .evaluate(() => { // currently just for Times of India
        try {
          let link: HTMLElement = document.querySelector('.clickhere')
          if (link) {
            link.click()
          }
        } catch (e) {
          console.log(e)
        }
      })
      .evaluate<string>((selector: string)=> {
        try {
          if (selector.length) {
            document.querySelectorAll(selector).forEach((e) => (e as HTMLElement).style.display = 'none')
          }
        } catch (e) {
          console.log(e)
        }
      }, ()=>{}, this.thingsToHide)
      .wait(3 * 1000)
      .screenshot(pngFilename)
      //.evaluate((name, start) => console.log(`  finished ${name} in ${(new Date()).valueOf() - start.valueOf()}`), this.name, start)
  }
}

export const publications: Publication[] = [
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

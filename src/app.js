// This file runs as an argument to electron's cli.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

class Publication {
  constructor(name, homepage, thingsToHide) {
    this.name = name;
    this.homepage = homepage;
    this.thingsToHide = thingsToHide;
  }
}

const publications = [
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

function currentDatestamp(){
  // e.g. "2020-02-29"
  return (new Date()).toISOString().split('T')[0];
}

function toPromise(fn, args, callback) {
  return new Promise(function(resolve) {
    let resolver = function() {
      if (callback) {
        return resolve(callback.apply(null, arguments))
      } else {
        return resolve.apply(null, arguments)
      }
    }
    let _args = [];
    if (args && args.length) {
      _args = args.slice()
    }
    _args.push(resolver)
    return fn.apply(null, _args)
  })
}

function wait(delay) {
  return new Promise(resolve => setTimeout(() => {console.log('delayed', delay); resolve()}, delay))
};

Promise.prototype.wait = wait;

async function screenshot(name) {
  let dirname = `screenshots/${currentDatestamp()}`;
  let pngFilename = `${dirname}/${name}.png`;
 
  return toPromise(fs.mkdir, ['screenshots'])
    .then(toPromise(fs.mkdir, [dirname]))
    .then(() => win.capturePage())
    .then((image) => {
      console.log('writing', pngFilename)
      fs.writeFile(pngFilename, image.toPNG(), ()=>{})
    })
}
function hide(selector) {
  let js = `
    let link = document.querySelector('.clickhere')
    link && link.click();
    let selector = "${selector}";
    selector.length && document.querySelectorAll(selector).forEach((e) => e.style.display = 'none')`
  console.log('executing', js)
  return win.webContents.executeJavaScript(js)
}

async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 3000,
    height: 5000,
    enableLargerThanScreen: true,
    show: false
  })


  // Emitted when the window is closed.
  win.on('closed', () => {
    console.log('closed')
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // Begin page load
  for (let i = 0; i < publications.length; i++) {
    let publication = publications[i];
    console.log('publication:', publication.name)
    await win.loadURL(publication.homepage)
    console.log('now waiting')
    await wait(10 * 1000)
    console.log('got', publication.homepage)
    await hide(publication.thingsToHide)
    console.log('gonna screenshot', publication.homepage)
    await screenshot(publication.name)
  }

  console.log('done!')
  app.quit()
}

app.allowRendererProcessReuse = true

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  console.log('window-all-closed')
  app.quit()
})

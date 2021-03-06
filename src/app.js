// This file runs as an argument to electron's cli.js
// TODO: encapsulate all the non-electron parts, exposing them to a runner that can check for done-ness
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const width = 2000;
const height = 5000;
const waitSecondsAfterLoad = 2;
const show = false;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const debug = true;
function log(...args) {
  if (debug) {
    console.log(...args)
  }
}

function currentDatestamp(){
  // e.g. "2020-02-29"
  let today = new Date()
  const pad = (n) => n >= 10 ? `${n}` : `0${n}`
  return `${today.getFullYear()}-${pad(1 + today.getMonth())}-${pad(today.getDate())}`
}

const pathForTodaysScreenshots = `screenshots/${currentDatestamp()}`;

class Publication {
  constructor(name, homepage, thingsToHide) {
    this.name = name;
    this.homepage = homepage;
    this.thingsToHide = thingsToHide;

    this.pathForTodaysScreenshot = `${pathForTodaysScreenshots}/${this.name}.png`;
  }

  isAlreadyProcessedToday() {
    return fs.existsSync(this.pathForTodaysScreenshot)
  }
}

const publications = [
  new Publication("atlanta-journal-constitution","https://www.ajc.com/",                               ""),
  new Publication("aljazeera",                   "https://www.aljazeera.com/",                         ""),
  new Publication("bild",                        "https://www.bild.de/",                               ""),
//  new Publication("chicago-sun-times",           "https://chicago.suntimes.com/",                      ""),
  new Publication("chicago-tribune",             "https://www.chicagotribune.com/",                    ""),
  new Publication("cnn",                         "https://www.cnn.com",                                ""),
  new Publication("foxnews",                     "https://foxnews.com",                                ""),
  new Publication("frankfurter-allgemeine",      "https://www.faz.net/aktuell/",                       "message-overlay, .message.type-modal"),
  new Publication("google-news",                 "https://news.google.com/?hl=en-US&gl=US&ceid=US:en", ""),
  new Publication("guangdong-daily",             "http://www.newsgd.com/",                             ""),
  new Publication("guardian",                    "https://www.theguardian.com/us",                     "#cmpContainer"),
  new Publication("handelsblatt",                "https://www.handelsblatt.com/",                      ""),
  new Publication("le-monde",                    "https://www.lemonde.fr/",                            ""),
  new Publication("latimes",                     "https://www.latimes.com/",                           "#ensNotifyBanner, .met-flyout, iframe, .GoogleDfpAd-wrapper, body>div[draggable=false]"),
  new Publication("nytimes",                     "https://www.nytimes.com/",                           ""),
  new Publication("peoples-daily",               "http://en.people.cn/",                               ".tips"),
  new Publication("reuters",                     "https://www.reuters.com/",                           "#floating-leaderboard"),
  new Publication("san-francisco-chronicle",     "https://www.sfchronicle.com/",                       ".fancybox-overlay"),
  new Publication("seattle-times",               "https://www.seattletimes.com/",                      ""),
  new Publication("tampa-bay-times",             "https://tampabay.com/",                              "#gdpr, .browser-warning"),
  new Publication("usa-today",                   "https://www.usatoday.com/",                          ".onetrust-consent-sdk"),
  new Publication("wall-street-journal",         "https://www.wsj.com/",                               ".cx-candybar, #AD_PUSH"),
  new Publication("washington-post",             "https://www.washingtonpost.com/",                    ""),
  new Publication("yomiuri-shimbun",             "https://www.yomiuri.co.jp/",                         ""),
]

function wait(delay) {
  return new Promise(resolve => setTimeout(() => {log('delayed', delay); resolve()}, delay))
};

function hide(selector) {
  let js = `
    "${selector}".length && document.querySelectorAll("${selector}").forEach((e) => e.style.display = 'none')
`;
    return win.webContents.executeJavaScript(js)
}

async function createWindow () {
  // Make today's screenshot directory, if it doesn't exist
  fs.mkdir('screenshots', ()=> fs.mkdir(`screenshots/${currentDatestamp()}`, ()=>{}))

  // Create the browser window.
  win = new BrowserWindow({
    enableLargerThanScreen: true,
    show: show
  })
  win.setSize(width, height)

  // Emitted when the window is closed.
  win.on('closed', () => {
    log('closed')
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // Process any publications that haven't been captured yet today
  for (let i = 0; i < publications.length; i++) {

    let publication = publications[i];

    if (publication.isAlreadyProcessedToday()) {
      console.log('  skipping', publication.pathForTodaysScreenshot)
    } else {
      log('publication:', publication.name)
      try {
        await win.loadURL(publication.homepage, { 'Accept-Language': 'en', userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36" })
      } catch (e) {
        console.error(e)
        setTimeout(() => { win.close(); app.quit() }, waitSecondsAfterLoad * 5 * 1000)
      }
      log('now waiting')
      await wait(waitSecondsAfterLoad * 1000)
      log('got', publication.homepage)
      await hide(publication.thingsToHide)
      log('gonna screenshot', publication.homepage)
      await win.capturePage().then(image => { console.log('+ writing ', publication.pathForTodaysScreenshot); fs.writeFile(publication.pathForTodaysScreenshot, image.toPNG(), ()=>{}) })
    }
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

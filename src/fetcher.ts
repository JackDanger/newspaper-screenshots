import child_process from 'child_process';
import Nightmare from 'nightmare';

import { publications, Publication } from './publication.js';

function driver() {
  return new Nightmare({
    width: 2000,
    height: 1920 * 3,
    gotoTimeout: 4 * 60 * 1000,
    waitTimeout: 2 * 60 * 1000,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36",
    switches: { 'ignore-certificate-errors': true },
    show: false
  } as Nightmare.IConstructorOptions)
}

class Fetcher {
  publication: Publication;
  constructor(publicationName: string) {
    this.publication = publications.find((publication: Publication) => publication.name == publicationName)
    if (!this.publication) {
      throw `No publication found with the name ${publicationName}`
    }
  }
  retrieve() {
    let start = new Date();
    console.log(`${this.publication.name} starting`)

    return this.publication
      .retrieve(driver())
      .end()
      .then(() => console.log(`${this.publication.name} complete in ${((new Date()).valueOf() - start.valueOf()) / 1000}`))
      .catch(console.log)
  }
}

if (undefined === process.env.PUBLICATION_NAME) {
  console.log(`USAGE: PUBLICATION_NAME=nytimes node ${process.argv[0]}`)
  process.exit(1)
}
// First, kill any existing Electron apps. Furreal.
const cleanupCommand = "ps aux | grep Electro[n].app | grep newspaper-screenshots | awk '{print $2}' | xargs kill -9"
console.log(child_process.spawnSync('bash', ['-c', cleanupCommand]).stdout.toString())

let fetcher = new Fetcher(process.env.PUBLICATION_NAME);
Promise.resolve(fetcher.retrieve())

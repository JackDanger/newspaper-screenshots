import child_process from 'child_process';
import { publications, Publication } from './publication.js';

var start = new Date();

publications.forEach((publication: Publication) => {
    let stdout = child_process.execSync(
      'yarn run fetch',
      {
        env: Object.assign({ 'PUBLICATION_NAME': publication.name}, process.env)
      }
    )
    console.log(stdout.toString())
    console.log(`fetched all in ${(new Date()).valueOf() - start.valueOf()}`)
  }
)

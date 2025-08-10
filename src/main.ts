import 'dotenv/config';

import { ICrawler } from "./crawlers/ICrawler";
import { checkEnv } from './utils/utils';
import pMap from "p-map";
import { VeroInternet } from './crawlers/VeroInternet';

async function main() {  
  checkEnv([
    'SITE_A_USER',
    'SITE_A_PASS',
    'SITE_B_USER',
    'SITE_B_PASS',
  ]);

  const envs = process.env;

  const crawlers: ICrawler[] = [
    new VeroInternet('teste', 'teste'),
    // new BoletoSiteA(envs.SITE_A_USER!, envs.SITE_A_PASS!),
    // new BoletoSiteB(envs.SITE_B_USER!, envs.SITE_B_PASS!),
  ];

  const results = await pMap(crawlers, crawler => crawler.run(), { concurrency: 3 });

  console.log("Resultados:", results);
}

main();

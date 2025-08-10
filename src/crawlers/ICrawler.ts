import { CrawlerResult } from "./CrawlerResult";

export interface ICrawler {
  run(): Promise<CrawlerResult>;
}

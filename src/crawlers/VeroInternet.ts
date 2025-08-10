import puppeteer, { Page } from 'puppeteer';
import { ICrawler } from "./ICrawler";
import { CrawlerResult } from "./CrawlerResult";

export class VeroInternet implements ICrawler {
  constructor(
    private user: string,
    private password: string
  ) { }

  async run(): Promise<CrawlerResult> {
    const browser = await puppeteer.launch({ headless: true });
    const page: Page = await browser.newPage();

    try {
      await page.goto("https://verointernet.com.br/minhavero/login", { waitUntil: "networkidle0" });

      // O Puppeteer retorna 'ElementHandle | null'
      const loginInput = await page.waitForSelector(
        'xpath/html/body/div[1]/div/div/div/div[3]/div/div/div/form/fieldset[1]/label/div/input',
        { timeout: 10000 }
      );

      if (!loginInput) {
        throw new Error('Campo de login (XPath) não foi encontrado na página.');
      }

      await loginInput!.type(this.user);

      const passwordInput = await page.waitForSelector(
        'xpath/html/body/div[1]/div/div/div/div[3]/div/div/div/form/fieldset[2]/label/div/input',
        { timeout: 10000 }
      );

      if (!passwordInput) {
        throw new Error('Campo de password (XPath) não foi encontrado na página.');
      }

      await passwordInput!.type(this.password);
      
      // // ✅ Verificação para o botão de login também
      // const loginButton = await page.waitForSelector("#botaoLogin");
      // if (!loginButton) {
      //    throw new Error('Botão de login não foi encontrado.');
      // }
      // // await loginButton.click();
      
      // // ✅ A função page.$eval já retorna uma string vazia se não encontrar
      // const codigo = await page.$eval("#codigoBoleto", el => el.textContent?.trim() || "");

      // await browser.close();
      return { success: true, code: codigo };

    } catch (err) {
      await browser.close();
      return { success: false, error: (err as Error).message };
    }
  }
}
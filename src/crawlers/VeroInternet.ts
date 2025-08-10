import puppeteer, { Page } from 'puppeteer';
import { ICrawler } from "./ICrawler";
import { CrawlerResult } from "./CrawlerResult";

const PRE_FIX_XPATH = 'xpath';
const LOGIN_INPUT_XPATH = `${PRE_FIX_XPATH}/html/body/div[1]/div/div/div/div[3]/div/div/div/form/fieldset[1]/label/div/input`;
const NEXT_STEP_BUTTON_XPATH = `${PRE_FIX_XPATH}/html/body/div[1]/div/div/div/div[3]/div/div/div/form/fieldset[2]/button`;
const PASSWORD_INPUT_XPATH = `${PRE_FIX_XPATH}/html/body/div[1]/div/div/div/div[3]/div/div/div/form/fieldset[2]/label/div/input`;
const LOGIN_BUTTON_XPATH = `${PRE_FIX_XPATH}/html/body/div[1]/div/div/div/div[3]/div/div/div/form/fieldset[3]/button`;
const GET_CODE_INPUT_XPATH = `${PRE_FIX_XPATH}/html/body/div[1]/div/div/div/div[2]/section[1]/div[1]/div/div[1]`;

export class VeroInternet implements ICrawler {
  constructor(
    private user: string,
    private password: string
  ) { }

  private async fillLoginInput(page: Page): Promise<void> {
    console.log('Preenchendo login inicial.');

    const loginInput = await page.waitForSelector(
      LOGIN_INPUT_XPATH,
      { timeout: 10000 }
    );

    if (!loginInput) {
      throw new Error('Campo de login (XPath) não foi encontrado na página.');
    }

    await loginInput!.type(this.user);
  }

  private async clickOnNextStep(page: Page): Promise<void> {
    console.log('Clicando em avançar.');

    const button = await page.waitForSelector(
      NEXT_STEP_BUTTON_XPATH,
      { timeout: 10000 }
    );

    if (!button) {
      throw new Error('Botão de avançar não foi encontrado na página.');
    }

    await button.click();
  }

  private async fillPasswordInput(page: Page): Promise<void> {
    console.log('Preenchendo senha.');

    const passwordInput = await page.waitForSelector(
      PASSWORD_INPUT_XPATH,
      { timeout: 10000 }
    );

    if (!passwordInput) {
      throw new Error('Campo de password (XPath) não foi encontrado na página.');
    }

    await passwordInput!.type(this.password);
  }

  private async clickOnLoginButton(page: Page): Promise<void> {
    console.log('Clicando no botão de login.');

    const button = await page.waitForSelector(
      LOGIN_BUTTON_XPATH,
      { timeout: 10000 }
    );

    if (!button) {
      throw new Error('Botão de login não foi encontrado na página.');
    }

    await button.click();
  }

  private async clickToGetCode(page: Page): Promise<string> {
    console.log('Pegando codigo de barras.');

    const button = await page.waitForSelector(
      GET_CODE_INPUT_XPATH,
      { timeout: 10000 }
    );

    if (!button) {
      throw new Error('Botão de pagar com código do boleto não encontrado.');
    }

    await button.click();

    try {
      const clipboardText = await page.evaluate(async () => {
        return await navigator.clipboard.readText();
      });

      console.log("Número copiado para o clipboard:", clipboardText);
      return clipboardText;
    } catch (error) {
      throw new Error('Falha ao ler o clipboard.');
    }
  }

  async run(): Promise<CrawlerResult> {
    const browser = await puppeteer.launch({ headless: true });
    const page: Page = await browser.newPage();

    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://verointernet.com.br", ["clipboard-read", "clipboard-write"]);

    try {
      await page.goto("https://verointernet.com.br/minhavero/login", { waitUntil: "networkidle0" });

      await this.fillLoginInput(page);
      await this.clickOnNextStep(page);
      await this.fillPasswordInput(page);
      await this.clickOnLoginButton(page);
      const code = await this.clickToGetCode(page);

      await browser.close();
      return { success: true, code: code };

    } catch (err) {
      await browser.close();
      return { success: false, error: (err as Error).message };
    }
  }
}
import { expect } from '@playwright/test';
import log from '../utils/logger.js';

export class BookDetailsPage {
  constructor(page) {
    this.page = page;
  }

  get bookTitle() {
    return this.page.locator(`xpath=//*[contains(@class, 'bookTitle') and contains(@class, 'bookName')]`);
  }

  get authorName() {
    return this.page.locator(`xpath=//*[contains(@class, 'bookTitle') and contains(@class, 'authorName')]`);
  }

  get ebookSection() {
    return this.page.locator(`xpath=//*[contains(@class, 'ebookSection') and contains(@class, 'ebookButtonContainer')]`);
  }

  get buyToReadButton() {
    return this.page.getByRole('button', { name: 'Buy eBook' });
  }

  get ebookPrice() {
    return this.page.locator(`xpath=//*[contains(@class, 'ebookSection') and contains(@class, 'ebookInfo')]`);
  }

  get addToCartButton() {
    return this.page.locator('#js--details-main-add-to-cart-button');
  }

  get addToCartButtonText() {
    return this.page.locator('#js--details-main-add-to-cart-button span#js--add-to-cart-button');
  }

  async visit(bookId) {
    await this.page.goto(`/book/${bookId}`);
    await this.page.waitForLoadState('load');
  }

  async getTitle() {
    return await this.page.title();
  }

  async getBookTitle() {
    const title = await this.bookTitle?.innerText();
    return title.replace(/\(.*?\)/g, '').trim();
  }

  async getAuthorName() {
    const author = await this.authorName?.innerText();
    return author.replace(/^by\s+/i, '').trim();
  }

  async getAddToCartButtonText() {
    return await this.addToCartButtonText.innerText();
  }

  async clickAddToCart() {
    await expect(this.addToCartButton, 'Add to Cart button should be visible').toBeVisible();
    await expect(this.addToCartButton, 'Add to Cart button should be enabled').toBeEnabled();
    await this.addToCartButton.scrollIntoViewIfNeeded();
    const buttonText = await this.getAddToCartButtonText();

    if (buttonText.includes('Add to Cart')) {
      log.info('Add to Cart button is in "Add to Cart" state.');
      await this.addToCartButton.click();
      await expect(this.addToCartButtonText).toHaveText('Go to Cart ->', {
        timeout: 5000
      });
    } else {
      log.info(
        'Add to Cart button is NOT in "Add to Cart" state. Current state: ' + (await this.getAddToCartButtonText())
      );
      return;
    }
    await this.page.waitForTimeout(3000); // Can also use waitForSelector instead of `waitForTimeout`
  }

  async clickGoToCart() {
    await expect.soft(this.addToCartButtonText).toHaveText('Go to Cart ->', { timeout: 5000 });
    await Promise.all([
      this.page.waitForURL((url) => /\/cart/.test(url.pathname), { timeout: 10_000 }),
      this.addToCartButton.click()
    ]);
    await this.page.waitForLoadState('load');
    expect(this.page.url()).toMatch(/\/cart/);
  }

  async getEbookPrice() {
    await expect(this.ebookSection, 'Ebook section should be visible').toBeVisible();
    const ebookPrice = await this.ebookSection.locator(`xpath=//*[contains(@class, 'ebookSection') and contains(@class, 'ebookInfo')]//span`);
    await expect(ebookPrice, 'Ebook price should be visible').toBeVisible();
    const extractedPrice = (await ebookPrice?.innerText()).replace(/^[A-Za-z]+\s*/, '').trim();
    return extractedPrice;
  }
  async clickBuyEbook() {
    expect(this.ebookSection, 'Ebook section should be visible').toBeVisible();
    const buyEbookButton = this.page.locator(`xpath=//*[contains(@class, 'button') and contains(@class, 'detailBuyEbookSmall')]`);
    await expect(buyEbookButton, 'Buy to Read button should be visible').toBeVisible();
    await buyEbookButton.click();
  }
}

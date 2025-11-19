import { expect } from '@playwright/test';
export class BookDetailsPage {
  constructor(page) {
    this.page = page;
    this.bookTitle = page.locator(`xpath=//*[contains(@class, 'bookTitle') and contains(@class, 'bookName')]`);
    this.authorName = page.locator(`xpath=//*[contains(@class, 'bookTitle') and contains(@class, 'authorName')]`);
    this.buyToReadButton = page.locator(`xpath=//*[contains(@class, 'bookTitle') and contains(@class, 'authorName')]`);
    this.ebookPrice = page.locator(`xpath=//*[contains(@class, 'bookTitle') and contains(@class, 'authorName')]`);

    this.addToCartButton = page.locator('#js--details-main-add-to-cart-button');
    this.addToCartButtonText = page.locator('#js--details-main-add-to-cart-button span#js--add-to-cart-button');
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
    //Yellow or golden info arrow sign in console logs
    console.log('\u001b[33m%s\u001b[0m', 'Book Details Page - Clicking Add to Cart button');
    await expect(this.addToCartButton, 'Add to Cart button should be visible').toBeVisible();
    await expect(this.addToCartButton, 'Add to Cart button should be enabled').toBeEnabled();
    await this.addToCartButton.scrollIntoViewIfNeeded();
    const buttonText = await this.getAddToCartButtonText();

    if (buttonText.includes('Add to Cart')) {
      console.log('Add to Cart button is in "Add to Cart" state.');
      await this.addToCartButton.click();
      await expect(this.addToCartButtonText).toHaveText('Go to Cart ->', {
        timeout: 3000
      });
    } else {
      console.log(
        'Add to Cart button is NOT in "Add to Cart" state. Current state: ' + (await this.getAddToCartButtonText())
      );
      return;
    }
    await this.page.waitForTimeout(3000); // Can also use waitForSelector instead of `waitForTimeout`
  }

  async clickGoToCart() {
    await expect.soft(this.addToCartButtonText).toHaveText('Go to Cart ->', { timeout: 3000 });
    await Promise.all([
      this.page.waitForURL((url) => /\/cart/.test(url.pathname), { timeout: 10_000 }),
      this.addToCartButton.click()
    ]);
    await this.page.waitForLoadState('load');
    expect(this.page.url()).toMatch(/\/cart/);
  }

  async getEbookPrice() {
    const ebookPrice = this.page.locator(`xpath=//*[contains(@class, 'bookTitle') and contains(@class, 'authorName')]`);
    return await this.ebookPrice?.innerText();
  }
}

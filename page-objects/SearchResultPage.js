import { expect } from '@playwright/test';
import log from '../utils/logger.js';

export class SearchResultPage {
  constructor(page) {
    this.page = page;
    this.productTitle = '';
    //this.product = page.locator(`[class^="productContainer_productTitle__"]:has-text("${this.productTitle}")`);
  }

  async getTitle() {
    return await this.page.title();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('load');
  }

  async isProductFound(productTitle) {
    log.info(`Searching for product with title: ${productTitle}`);
    if (await this.page.locator('#ts--mobile-no-search-found-container').isVisible()) {
      log.warn('No product found or search service is not working properly.');
      return false;
    }
    log.info(`Product locator is moving....`);
    const product = this.page.locator(`xpath=//h1[contains(@class,'productTitle') and contains(., "${productTitle}")]`);
    await product.first().waitFor();
    const urls = await this.page.url();
    log.info(`Product count ${await product.count()}.`);
    log.info(`Product = ${product}`);

    log.info(`URL = ${urls}`);
    if ((await product.count()) > 0) {
      return product.first();
    } else {
      return '';
    }
  }

  async goToProductDetails(productLocator) {
    await productLocator.click();
    await this.page.waitForLoadState('load');
  }

  async goToProductDetails2() {
    const bookLink = this.page.locator('.books-wrapper__item').first();
    // Listen for the new page (tab) before clicking
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'), // Wait for the new tab
      bookLink.click() // Click that opens the new tab
    ]);
    //await newPage.waitForTimeout(3000);
    await newPage.waitForLoadState('load');
    log.info('Navigating to product details page...');
    return newPage; // Return new tab for use in test
  }
}

import { expect } from '@playwright/test';
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
    console.log(`Searching for product with title: ${productTitle}`);
    if (await this.page.locator('#ts--mobile-no-search-found-container').isVisible()) {
      console.log('No product found or search service is not working properly.');
      return false;
    }
    console.log(`Product locator is moving....`);
    //const product = await this.page.locator(`[class^="productContainer_productTitle__"]:has-text("${productTitle}")`);
    const product = await this.page.locator(
  `xpath=//*[contains(@class, 'productContainer') and contains(@class, 'productTitle') and text()="${productTitle}"]`
);
    console.log(`Product count ${await product.count()}.`);
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
    console.log('Navigating to product details page...');
    return newPage; // Return new tab for use in test
  }
}

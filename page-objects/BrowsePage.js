import { expect } from '@playwright/test';
import log from '../utils/logger.js';

export class BrowsePage {
  constructor(page) {
    this.page = page;
  }

  get preOrderListContainer() {
    return this.page.locator(
      '[class*="filterDataContainer"]'
    );
  }

  get preOrderItems() {
    return this.page.locator(
      '[class*="productGridItem"]'
    );
  }

  async openPreOrderListing() {
    log.step('Opening pre-order listing page');
    await this.page.goto('/pre-order?pre-order');
    await this.page.waitForLoadState('load');
    await expect
      .soft(this.preOrderListContainer, 'Pre-order list should be visible')
      .toBeVisible({ timeout: 5000 });
    log.success('Pre-order listing page loaded');
  }

  async openFirstPreOrderBook() {
    log.info('Opening first pre-order book from listing');
    const firstItem = this.preOrderItems.first();
    await firstItem.waitFor({ state: 'visible', timeout: 5000 });
    await firstItem.click();
    await this.page.waitForLoadState('load');
  }
}



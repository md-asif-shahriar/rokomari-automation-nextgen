import { expect } from '@playwright/test';
import log from '../utils/logger.js';

export class TrackOrderPage {
  constructor(page) {
    this.page = page;
  }

  get orderNumber() {
    return this.page.getByRole('heading', { name: 'Order No:' });
  }

  get payableTotal() {
    return this.page.locator('.total-payable__value');
  }

  get trackOrderButton() {
    return this.page.getByRole('link', { name: 'Track Your Order' });
  }

  async getOrderNumber() {
    const orderNumber = await this.orderNumber.innerText();
    return orderNumber.replace(/^.*:\s*(\d+)/, '$1').trim();
  }

  async getPayableTotal() {
    await expect(this.payableTotal, 'Payable total value should be visible').toBeVisible({ timeout: 2500 });
    return await this.payableTotal.innerText();
  }

  async clickTrackOrder() {
    await this.trackOrderButton.click();
    await this.page.waitForLoadState('load');
  }
}

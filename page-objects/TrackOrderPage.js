import { expect } from '@playwright/test';
export class TrackOrderPage {
  constructor(page) {
    this.page = page;
    this.orderNumber = page.getByRole('heading', { name: 'Order No:' });
    this.payableTotal = page.locator('.total-payable__value');
    //this.orderNumber = page.locator('p:has-text("অর্ডার নম্বর")');
    this.trackOrderButton = page.getByRole('link', { name: 'Track Your Order' });
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

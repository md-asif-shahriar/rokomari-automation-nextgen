import { expect } from '@playwright/test';
import log from '../utils/logger.js';

export class MyOrderPage {
  constructor(page) {
    this.page = page;
  }

  get orderCards() {
    return this.page.locator('[class*="mySectionCardContainer"] > div.py-5.border-b');
  }

  get orderStatus() {
    return this.page.locator('.order-status').first();
  }

  get trackMyOrderButton() {
    return this.page.getByRole('link', { name: 'Track My Order' }).first();
  }

  async isOrderFound(orderId) {
    const orderIdSpan = await this.page.locator('span.text-success', { hasText: `${orderId}` });
    try {
      await expect(orderIdSpan, `Order ID ${orderId} should be found in My Orders`).toBeVisible({ timeout: 3000 });
    } catch (error) {
      log.error(`Order ID ${orderId} not found in My Orders.`);
      log.error(error.message);
      return false;
    }
    return true;
  }
  async getPayableTotal() {
    const payableAmount = await this.page
      .locator('xpath=//div//span[contains(text(), "Payable amount:")]/span[@class="text-success"]')
      .first();
    const amount = await payableAmount.innerText();
    return amount;
  }
  async getOrderStatus() {
    const currentStatus = await this.orderStatus.innerText();
    return currentStatus;
  }
  async cancelOrder() {
    const cancelOrderButton = await this.page.locator('button[name="cancelOrder"]').first();
    await expect(cancelOrderButton, 'Cancel Order button should be visible').toBeVisible();
    await cancelOrderButton.click();


    const overlay = this.page.locator('#js--modal-overlay');
    await expect(overlay, 'Overlay should be visible').toBeVisible();

    const cancelYourOrderHeading = this.page.locator('h5', { hasText: 'Cancel Your Order' });
    await expect(cancelYourOrderHeading, 'Cancel Order pop-up should be visible').toBeVisible();

    const confirmCancelOrderButton = this.page.locator('button:has-text("Confirm Cancel Order")');
    await expect(confirmCancelOrderButton, 'Cancel Order button should be visible').toBeVisible();
    await expect(
      confirmCancelOrderButton,
      'Cancel Order button should be disabled if no reason is selected'
    ).toBeDisabled();

    const selectReasonDropdown = await this.page.locator('#js--modal-overlay').getByRole('combobox');
    await selectReasonDropdown.selectOption({ value: '11' });
    //await confirmCancelOrderButton.waitFor({ state: 'attached' });
    //await expect(confirmCancelOrderButton, 'Cancel Order button should be enabled after selecting a reason').toBeEnabled();
    await confirmCancelOrderButton.click();
  }

  async clickTrackMyOrder() {
    await expect(this.trackMyOrderButton).toBeVisible();
    await this.trackMyOrderButton.click();
  }
}

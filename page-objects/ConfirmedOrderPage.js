import { expect } from '@playwright/test';
import log from '../utils/logger.js';

export class ConfirmedOrderPage {
  constructor(page) {
    this.page = page;
  }

  get orderNumberLocator() {
    return this.page.locator('button[data-code]').first();
  }

  get trackOrderButton() {
    return this.page.getByRole('link', { name: 'Track Your Order' });
  }

  async getOrderNumber() {
    const orderNumber = await this.orderNumberLocator.getAttribute('data-code');
    return orderNumber;
  }

  async getPayableTotal() {
    const payableTotalRow = this.page.locator(
      `xpath=//*[contains(@class, "orderPlaceSummary") and contains(@class, "rowContainer") and .//span[contains(text(), "Payable Total")]]`
    ).first();
    await expect(payableTotalRow, 'Payable total row should be visible').toBeVisible({ timeout: 2500 });

    const [label, amount] = await Promise.all([
      payableTotalRow.locator('span').first().innerText(),
      payableTotalRow.locator('span').nth(1).innerText()
    ]);

    expect(label).toBe('Payable Total');
    return amount;
  }

  async clickTrackOrder() {
    await expect(this.trackOrderButton).toBeVisible();
    await expect(this.trackOrderButton).toBeEnabled();
    await this.trackOrderButton.click();
  }
}

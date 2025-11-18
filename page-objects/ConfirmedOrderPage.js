import { expect } from '@playwright/test';
export class ConfirmedOrderPage {
  constructor(page) {
    this.page = page;
    this.orderNumber = page.getByText('Order Number:');
    this.trackOrderButton = page.getByRole('link', { name: 'Track Your Order' });
  }

  async getOrderNumber() {
    const orderNumber = await this.orderNumber.innerText();
    console.log('Order Number:', orderNumber);
    return orderNumber.replace(/^.*:\s*(\d+)/, "$1").trim();
  }

  async getPayableTotal() {
    const payableTotalRow = this.page.locator(
      `xpath=//*[contains(@class, "orderPlaceSummary") and contains(@class, "rowContainer") and .//span[contains(text(), "Payable Total")]]`
    );
    await expect(payableTotalRow, 'Payable total row should be visible').toBeVisible({ timeout: 2500 });

    const [label, amount] = await Promise.all([
      payableTotalRow.locator('span').first().innerText(),
      payableTotalRow.locator('span').nth(1).innerText()
    ]);

    expect(label).toBe('Payable Total');
    console.log('Payable Total Label: ', label);
    console.log('Payable Total Amount: ', amount);
    return amount;
  }

  async clickTrackOrder() {
    await expect(this.trackOrderButton).toBeVisible();
    await this.trackOrderButton.click();
  }
}

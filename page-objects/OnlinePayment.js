import log from '../utils/logger.js';

export class OnlinePaymentPage {
  constructor(page) {
    this.page = page;
  }

  async nagad() {
    const totalLabel = this.page.locator('strong[data-trans-key="total"]');
    await totalLabel.waitFor({ state: 'visible', timeout: 5000 });
    // Get the sibling <span> where the amount is located
    const amountText = await totalLabel.locator('xpath=../span').innerText();
    // Extract the numeric portion (237 OR 237.00)
    const match = amountText.match(/(\d+(\.\d+)?)/);
    if (!match) {
      throw new Error(`❌ Unable to extract amount from text: ${amountText}`);
    }
    const numericValue = match[1]; // e.g. "237.00"
    // Convert to integer (remove decimal) and format as ৳237
    const formatted = `৳${parseInt(numericValue, 10)}`;
    return formatted;
  }

  async card() {
    let amount = await this.page.locator('.loading-btn__text span').innerText();
    let numericAmount = parseFloat(amount);
    let formattedAmount = `৳${numericAmount.toFixed(0)}`;
    return formattedAmount;
  }

  async rocketPage(paymentMethod) {
    log.info(`Handling online payment gateway for method: ${paymentMethod}`);
  }
}

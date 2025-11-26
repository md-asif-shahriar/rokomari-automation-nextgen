import { expect } from '@playwright/test';
export class EbookPaymentPage {
  constructor(page) {
    this.page = page;
    this.bkash = page.locator('#payment-wallets-1-B_KASH');
    this.nagad = page.locator('#payment-wallets-17-NAGAD');
    this.card = page.locator('#payment-wallets-8-SSL_COMMEREZ');
    this.confirmOrderButton = page.getByRole('button', { name: /^অর্ডার নিশ্চিত করুন ৳/ });
  }

  async selectPaymentMethod(paymentMethod = 'bkash') {
    if (!this[paymentMethod]) {
      throw new Error(`❌ Unknown payment method: ${paymentMethod}. Check testdata or property name on PaymentPage.`);
    }
    //await expect(this.confirmOrderButton,'Confirm order should be disabled if payment method is not selected').toBeDisabled();
    await this[paymentMethod].waitFor({ state: 'visible' });
    console.log(`Selecting ${paymentMethod} as payment method`);
    await this[paymentMethod].click();
  }

  async getConfimmOrderButtonTotal() {
    const confirmedOrderButtonText = await this.confirmOrderButton.innerText();
    const amount = confirmedOrderButtonText.replace(/^.*\s*(৳\d+.*)/, '$1').trim();
    console.log(`Confirmed Order Button Amount: ${amount}`);
    return amount;
    await this.page.pause();
  }

  async confirmOrder() {
    await this.confirmOrderButton.waitFor({ state: 'visible' });
    await this.confirmOrderButton.click();
    console.log('✅ Confirm order button is clicked');
  }
}

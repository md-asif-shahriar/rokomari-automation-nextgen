import { expect } from '@playwright/test';
export class PaymentPage {
    constructor(page){
        this.page = page;
        this.confirmOrderButton = page.getByRole('button', { name: /^অর্ডার নিশ্চিত করুন ৳/ });
        this.cashOnDelivery = page.locator("#payment-wallets-0-COD");
        this.bkash = page.locator("#payment-wallets-1-B_KASH");
        this.nagad = page.locator("#payment-wallets-17-NAGAD");
        this.rocket = page.locator("#payment-wallets-3-ROCKET");
        this.card = page.locator("#payment-wallets-8-SSL_COMMEREZ");
    }


    async getPayableTotal() {
    const payableTotalRow = this.page.locator(
      `xpath=//*[contains(@class, "checkoutSummary") and contains(@class, "rowContainer") and .//span[contains(text(), "Payable Total")]]`
    );
    await expect(payableTotalRow, 'Payable total row should be visible').toBeVisible({ timeout: 2500 });

    const [label, amount] = await Promise.all([
      payableTotalRow.locator('span').first().innerText(),
      payableTotalRow.locator('span').nth(1).innerText()
    ]);
    expect(label).toBe('Payable Total');
    
    return amount;
  }

  async getConfimmOrderButtonTotal() {
    const confirmedOrderButtonText = await this.confirmOrderButton.innerText();
    const amount = confirmedOrderButtonText.replace(/^.*\s*(৳\d+.*)/, "$1").trim();
    console.log(`Confirmed Order Button Amount: ${amount}`);
    return amount;
    await this.page.pause();
  }


    async selectPaymentMethod(paymentMethod = 'COD') {
        await expect(this.confirmOrderButton, 'Confirm order should be disabled if payment method is not selected').toBeDisabled();
        await this.cashOnDelivery.waitFor({ state: 'visible' });
        if (paymentMethod === 'COD') {
            console.log('Selecting Cash on Delivery as payment method');
            await this.cashOnDelivery.click();
        } else if (paymentMethod === 'BKASH') {
            console.log('Selecting Bkash as payment method');
            await this.bkash.click();
        } else if (paymentMethod === 'NAGAD') {
            console.log('Selecting Nagad as payment method');
            await this.nagad.click();
        } else if (paymentMethod === 'ROCKET') {
            console.log('Selecting Rocket as payment method');
            await this.rocket.click();
        } else if (paymentMethod === 'CARD') {
            console.log('Selecting Card as payment method');
            await this.card.click();
        }
        await expect(this.confirmOrderButton,`Selecting ${paymentMethod} should enable the Place order button`).toBeEnabled({ timeout: 3000 });
        await this.page.pause();

        
    }

    async confirmOrder(){
        await this.confirmOrderButton.click();
        console.log('✅ Confirm order button is clicked');
    }
}
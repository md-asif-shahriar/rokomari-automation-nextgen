import { expect } from '@playwright/test';
import log from '../utils/logger.js';

export class PaymentPage {
  constructor(page) {
    this.page = page;
  }

  get giftFromAddressSection() {
    return this.page
      .locator(`xpath=//*[contains(@class, 'shippingGiftForm') and contains(@class, 'shippingContainer')]`)
      .first();
      
  }
  get giftToAddressSection() {
    return this.page
      .locator(`xpath=//*[contains(@class, 'shippingGiftForm') and contains(@class, 'giftContainer')]`)
      .first();
      
  }

  get giftWrap() {
    return this.page.locator('#giftWrap');
  }

  get confirmOrderButton() {
    return this.page.getByRole('button', { name: /^অর্ডার নিশ্চিত করুন ৳/ });
  }

  get cod() {
    return this.page.locator('#payment-wallets-0-COD');
  }

  get bkash() {
    return this.page.locator('#payment-wallets-1-B_KASH');
  }

  get nagad() {
    return this.page.locator('#payment-wallets-17-NAGAD');
  }

  get rocket() {
    return this.page.locator('#payment-wallets-3-ROCKET');
  }

  get card() {
    return this.page.locator('#payment-wallets-8-SSL_COMMEREZ');
  }

  async fillUpGiftToForm() {
    await this.giftFromAddressSection.waitFor({ state: 'visible' });
    await this.giftToAddressSection.waitFor({ state: 'visible' });
    await this.giftToAddressSection.getByPlaceholder('Name').fill('Gift From Name');
    await this.giftToAddressSection.locator('input[name="phone1"]').fill('01700000000');
    await this.giftToAddressSection.locator('input[name="phone2"]').fill('01800000000');
    await this.giftToAddressSection.locator('textarea[name="address"]').fill('Test order, do not cancel');
    await this.giftToAddressSection.getByPlaceholder('Gift Message').fill('Test gift message');
    const countryDropdown = this.giftToAddressSection.locator('select[name="countryId"]');
    await countryDropdown.selectOption({ label: "বাংলাদেশ" });
    const areaSelectField = await this.giftToAddressSection.locator(`xpath=//*[contains(@class, 'addressDropdown') and contains(@class, 'mainInputField')]`);
    
    await areaSelectField.waitFor({ state: 'visible' });
    await areaSelectField.click();
    const cityList = await this.giftToAddressSection.locator(`xpath=//*[contains(@class, 'addressDropdown') and contains(@class, 'optionListContainer')]`);
    await cityList.waitFor({ state: 'visible' });
    await cityList.locator('span:has-text("ঢাকা")').click();
    await this.page.waitForLoadState('networkidle');
    await cityList.locator('span:has-text("আগারগাঁও")').click();
    await this.page.waitForLoadState('networkidle');
    log.success('✅ Gift from form filled successfully');
  }

  async toggleGiftWrap(option = true) {
    let isChanged = false;
    const isChecked = await this.giftWrap.isChecked();
    log.info(`Giftwrap current status: ${isChecked}`);
    if (isChecked !== option) {
      await this.giftWrap.click();
      log.info(`✅ Gift wrap option set to ${option}`);
      isChanged = true;
    }
    await this.page.waitForLoadState('networkidle');
    const giftWrapRow = this.page.locator(`xpath=//div[contains(@class,'checkoutSummary') and contains(@class, "rowContainer") and .//span[contains(text(),'Gift wrap')]]`);
    if(option){
    await giftWrapRow.waitFor({ state: 'visible' });
    const giftWrapAmount = await giftWrapRow.locator('span').nth(1).innerText();
    log.info(`Gift Wrap Amount: ${giftWrapAmount}`);
    expect(giftWrapAmount).toBe('৳20');
    } else {
      await expect(giftWrapRow).toHaveCount(0);
    }
    return isChanged;
    await this.page.pause();
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
    const amount = confirmedOrderButtonText.replace(/^.*\s*(৳\d+.*)/, '$1').trim();
    log.info(`Confirmed Order Button Amount: ${amount}`);
    return amount;
    await this.page.pause();
  }

  async selectPaymentMethod(paymentMethod = 'cod') {
    if (!this[paymentMethod]) {
      throw new Error(`❌ Unknown payment method: ${paymentMethod}. Check testdata or property name on PaymentPage.`);
    }
    await this[paymentMethod].waitFor({ state: 'visible' });
    log.info(`Selecting ${paymentMethod} as payment method`);
    await this[paymentMethod].click();
  }

  async confirmOrder() {
    await this.confirmOrderButton.click();
    log.success('✅ Confirm order button is clicked');
  }
}

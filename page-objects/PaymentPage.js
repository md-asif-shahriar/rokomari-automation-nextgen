import { expect } from '@playwright/test';
export class PaymentPage {
  constructor(page) {
    this.page = page;
    this.giftFromAddressSection = page.locator('.cartShippingAddress-module-scss-module__PtBzOa__container').first();
    this.giftFromAddressSection = page
      .locator('.shippingGiftForm-module-scss-module__SlB38a__shippingContainer')
      .first();
    this.giftWrap = page.locator('#giftWrap');
    this.confirmOrderButton = page.getByRole('button', { name: /^অর্ডার নিশ্চিত করুন ৳/ });
    this.cod = page.locator('#payment-wallets-0-COD');
    this.bkash = page.locator('#payment-wallets-1-B_KASH');
    this.nagad = page.locator('#payment-wallets-17-NAGAD');
    this.rocket = page.locator('#payment-wallets-3-ROCKET');
    this.card = page.locator('#payment-wallets-8-SSL_COMMEREZ');
  }

  async fillUpGiftToForm() {
    await expect(this.giftFromAddressSection).toBeVisible();
    await expect(this.giftToAddressSection).toBeVisible();
    await this.giftFromAddressSection.getByPlaceholder('Name').fill('Gift From Name');
    await this.giftFromAddressSection.getByPlaceholder('Phone').fill('01700000000');
    await this.giftToAddressSection.getByPlaceholder('Alt. Phone Number').fill('01800000000');
    await this.giftToAddressSection.locator('textarea[name="address"]').fill('Test order, do not cancel');
    await this.giftToAddressSection.getByPlaceholder('Gift Message').fill('Test gift message');

    const countryDropdown = this.giftToAddressSection.locator('select[name="countryId"]');
    await countryDropdown.selectOption({ label: "বাংলাদেশ" });
    const areaSelectField = await this.giftToAddressSection.locator('.addressDropdown-module-scss-module__Rokhua__mainInputField');
    await areaSelectField.waitFor({ state: 'visible' });
    await areaSelectField.click();
    const cityList = await this.giftToAddressSection.locator('.addressDropdown-module-scss-module__Rokhua__optionListContainer');
    await cityList.waitFor({ state: 'visible' });
    await cityList.locator('span:has-text("ঢাকা")').click();
    await this.page.waitForTimeout(2000);
    await cityList.locator('span:has-text("আগারগাঁও")').click();
    await this.page.waitForTimeout(2000);
    console.log('✅ Gift from form filled successfully');
  }

  async toggleGiftWrap(option = true) {
    const isChecked = await this.giftWrap.isChecked();
    if (isChecked !== option) {
      await this.giftWrap.click();
      console.log(`✅ Gift wrap option set to ${option}`);
    }
    await this.page.waitForTimeout(2500);
    const giftWrapRow = page.locator('.checkoutSummary-module-scss-module__LKFYTa__rowContainer:has-text("Gift wrap")');
    if(option){
    await expect(giftWrapRow).toBeVisible();
    const giftWrapAmount = await giftWrapRow.locator('span').nth(1).innerText();
    console.log('Gift Wrap Amount: ', giftWrapAmount);
    await expect(giftWrapAmount).toBe('৳20');
    } else {
      await expect(giftWrapRow).toHaveCount(0);
    }
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
    console.log(`Confirmed Order Button Amount: ${amount}`);
    return amount;
    await this.page.pause();
  }

  async selectPaymentMethod(paymentMethod = 'cod') {
    if (!this[paymentMethod]) {
      throw new Error(`❌ Unknown payment method: ${paymentMethod}. Check testdata or property name on PaymentPage.`);
    }
    await expect(
      this.confirmOrderButton,
      'Confirm order should be disabled if payment method is not selected'
    ).toBeDisabled();
    await this[paymentMethod].waitFor({ state: 'visible' });
    console.log(`Selecting ${paymentMethod} as payment method`);
    await this[paymentMethod].click();
    await expect(
      this.confirmOrderButton,
      `Selecting ${paymentMethod} should enable the Place order button`
    ).toBeEnabled({ timeout: 3000 });
    await this.page.pause();
  }

  async confirmOrder() {
    await this.confirmOrderButton.click();
    console.log('✅ Confirm order button is clicked');
  }
}

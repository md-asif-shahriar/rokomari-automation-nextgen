import { expect } from '@playwright/test';
import log from '../utils/logger.js';

export class PaymentPage {
  constructor(page) {
    this.page = page;
  }

  // Order type detection
  async getOrderType() {
    const url = this.page.url();
    if (url.includes('/payment/ebook')) return 'ebook';
    if (url.includes('/shipping-vouchar')) return 'voucher';
    if (url.includes('/shipping?isgift=1')) return 'gift';
    return 'normal';
  }

  // Gift form sections (only for gift orders)
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

  // Gift voucher form sections (for voucher orders - email-based)
  get giftVoucherToSection() {
    return this.page.locator('section.shippingGiftForm-module-scss-module__SlB38a__shippingContainer div.shippingGiftForm-module-scss-module__SlB38a__giftContainer').first();
  }

  get giftVoucherNameField() {
    return this.page.locator('input#name[name="name"]');
  }

  get giftVoucherEmailField() {
    return this.page.locator('input#recipientEmail[name="recipientEmail"][type="email"]');
  }

  get giftVoucherMessageField() {
    return this.page.locator('textarea#message[name="message"]');
  }

  // Common elements
  get confirmOrderButton() {
    return this.page.getByRole('button', { name: /^অর্ডার নিশ্চিত করুন ৳/ });
  }

  // Payment methods (available based on order type)
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

  // Gift form methods (only for gift orders)
  async fillUpGiftToForm() {
    await this.giftFromAddressSection.waitFor({ state: 'visible', timeout: 5000 });
    await this.giftToAddressSection.waitFor({ state: 'visible', timeout: 5000 });
    
    await this.giftToAddressSection.getByPlaceholder('Name').fill('Gift From Name');
    await this.giftToAddressSection.locator('input[name="phone1"]').fill('01700000000');
    await this.giftToAddressSection.locator('input[name="phone2"]').fill('01800000000');
    await this.giftToAddressSection.locator('textarea[name="address"]').fill('Test order, do not cancel');
    await this.giftToAddressSection.getByPlaceholder('Gift Message').fill('Test gift message');
    
    const countryDropdown = this.giftToAddressSection.locator('select[name="countryId"]');
    await countryDropdown.waitFor({ state: 'visible', timeout: 5000 });
    await countryDropdown.selectOption({ label: "বাংলাদেশ" });
    
    const areaSelectField = this.giftToAddressSection.locator(`xpath=//*[contains(@class, 'addressDropdown') and contains(@class, 'mainInputField')]`);
    await areaSelectField.waitFor({ state: 'visible', timeout: 5000 });
    await areaSelectField.click();
    
    const cityList = this.giftToAddressSection.locator(`xpath=//*[contains(@class, 'addressDropdown') and contains(@class, 'optionListContainer')]`);
    await cityList.waitFor({ state: 'visible', timeout: 5000 });
    await cityList.locator('span:has-text("ঢাকা")').click();
    
    // Wait for dropdown to update instead of networkidle
    await this.page.waitForTimeout(1000);
    
    await cityList.waitFor({ state: 'visible', timeout: 5000 });
    await cityList.locator('span:has-text("আগারগাঁও")').click();
    await this.page.waitForTimeout(1000);
    
    log.success('✅ Gift to form filled successfully');
  }

  async toggleGiftWrap(option = true) {
    await this.giftWrap.waitFor({ state: 'visible', timeout: 5000 });
    const isChecked = await this.giftWrap.isChecked();
    log.info(`Gift wrap current status: ${isChecked}`);
    
    let isChanged = false;
    if (isChecked !== option) {
      await this.giftWrap.click();
      log.info(`✅ Gift wrap option set to ${option}`);
      isChanged = true;
      // Wait for UI to update
      await this.page.waitForTimeout(1000);
    }
    
    const giftWrapRow = this.page.locator(`xpath=//div[contains(@class,'checkoutSummary') and contains(@class, "rowContainer") and .//span[contains(text(),'Gift wrap')]]`);
    
    if (option) {
      await giftWrapRow.waitFor({ state: 'visible', timeout: 5000 });
      const giftWrapAmount = await giftWrapRow.locator('span').nth(1).innerText();
      log.info(`Gift Wrap Amount: ${giftWrapAmount}`);
      expect(giftWrapAmount).toBe('৳20');
    } else {
      await expect(giftWrapRow).toHaveCount(0);
    }
    
    return isChanged;
  }

  // Common methods for all order types
  async getPayableTotal() {
    const orderType = await this.getOrderType();
    
    // Gift voucher orders have different summary structure
    if (orderType === 'voucher') {
      const totalRow = this.page.locator('div#js--desktop-shipping-right-sidebar div.flex.flex-row.justify-between.items-center').filter({ hasText: 'Total' }).first();
      await expect(totalRow, 'Total row should be visible').toBeVisible({ timeout: 5000 });
      const amount = await totalRow.locator('p').nth(1).innerText();
      return amount.trim();
    }
    
    // Regular orders use checkoutSummary structure
    const payableTotalRow = this.page.locator(
      `xpath=//*[contains(@class, "checkoutSummary") and contains(@class, "rowContainer") and .//span[contains(text(), "Payable Total")]]`
    );
    await expect(payableTotalRow, 'Payable total row should be visible').toBeVisible({ timeout: 5000 });

    const [label, amount] = await Promise.all([
      payableTotalRow.locator('span').first().innerText(),
      payableTotalRow.locator('span').nth(1).innerText()
    ]);
    expect(label).toBe('Payable Total');

    return amount;
  }

  async getConfimmOrderButtonTotal() {
    await this.confirmOrderButton.waitFor({ state: 'visible', timeout: 5000 });
    const confirmedOrderButtonText = await this.confirmOrderButton.innerText();
    const amount = confirmedOrderButtonText.replace(/^.*\s*(৳\d+.*)/, '$1').trim();
    log.info(`Confirmed Order Button Amount: ${amount}`);
    return amount;
  }

  async selectPaymentMethod(paymentMethod = 'cod') {
    const orderType = await this.getOrderType();
    
    // Ebook orders don't support COD/ROCKET
    if (orderType === 'ebook' && (paymentMethod === 'cod' || paymentMethod === 'rocket')) {
      throw new Error(`❌ Payment method ${paymentMethod} is not available for ebook orders`);
    }
    
    if (!this[paymentMethod]) {
      throw new Error(`❌ Unknown payment method: ${paymentMethod}. Available methods: cod, bkash, nagad, rocket, card`);
    }
    
    await this[paymentMethod].waitFor({ state: 'visible', timeout: 5000 });
    await this[paymentMethod].click();
    
    // Wait for payment method selection to be processed
    await this.page.waitForTimeout(500);
  }

  async confirmOrder() {
    await this.confirmOrderButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.confirmOrderButton.click();
    log.success('✅ Confirm order button is clicked');
  }

  // Gift voucher order methods
  async verifyGiftVoucherForm() {
    log.info('Verifying gift voucher form elements');
    
    // Check if gift to section is visible
    await expect(this.giftVoucherToSection, 'Gift to section should be visible').toBeVisible({ timeout: 5000 });
    log.success('✅ Gift to section is visible');
    
    // Check if email field is visible
    await expect(this.giftVoucherEmailField, 'Email field should be visible').toBeVisible({ timeout: 5000 });
    log.success('✅ Email field is visible');
    
    // Check if name field is visible
    await expect(this.giftVoucherNameField, 'Name field should be visible').toBeVisible({ timeout: 5000 });
    log.success('✅ Name field is visible');
  }

  async fillGiftVoucherForm(email = 'test@example.com', name = 'Test Recipient', message = 'Test gift voucher message') {
    log.info('Filling gift voucher form');
    
    await this.verifyGiftVoucherForm();
    
    // Fill name field
    await this.giftVoucherNameField.fill(name);
    log.info(`Name filled: ${name}`);
    
    // Fill email field
    await this.giftVoucherEmailField.fill(email);
    log.info(`Email filled: ${email}`);
    
    // Fill message field (optional)
    await this.giftVoucherMessageField.fill(message);
    log.info(`Message filled: ${message}`);
    
    // Wait for form to process
    await this.page.waitForTimeout(500);
    log.success('✅ Gift voucher form filled successfully');
  }

  async verifyGiftVoucherTotals(expectedTotal) {
    log.info('Verifying gift voucher totals');
    
    // Verify summary total value
    const payableTotal = await this.getPayableTotal();
    expect.soft(payableTotal, 'Payable total should match expected value').toBe(expectedTotal);
    log.success(`✅ Summary total verified: ${payableTotal}`);
    
    // Verify confirm order button total
    const buttonTotal = await this.getConfimmOrderButtonTotal();
    expect.soft(buttonTotal, 'Confirm order button total should match expected value').toBe(expectedTotal);
    log.success(`✅ Confirm order button total verified: ${buttonTotal}`);
  }
}

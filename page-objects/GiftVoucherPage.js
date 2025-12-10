import { expect } from '@playwright/test';
import log from '../utils/logger.js';

export class GiftVoucherPage {
  constructor(page) {
    this.page = page;
  }

  get byEmail() {
    return this.page.getByAltText('Email');
  }

  get emailContainer() {
    return this.byEmail.locator('xpath=ancestor::div[contains(@class, "cursor-pointer")]').first();
  }

  get normalVoucher() {
    return this.page.getByAltText('Rokomari Voucher');
  }

  get amount500() {
    return this.page.locator('div.cursor-pointer:has-text("500")').first();
  }

  get orderButton() {
    return this.page.getByRole('button', { name: 'অর্ডার করুন' });
  }

  get totalValue() {
    return this.page.locator('div.flex.justify-between:has-text("Total:") p').nth(1);
  }

  async verifyDefaultSelections() {
    log.info('Verifying default selections on gift voucher page');

    // Check Email is selected - container has border-primary and bg-primary/10
    await this.byEmail.waitFor({ state: 'visible', timeout: 5000 });
    const emailContainer = this.emailContainer;
    await expect(emailContainer, 'Email container should be visible').toBeVisible();
    const emailClasses = await emailContainer.getAttribute('class');
    expect(emailClasses, 'Email should have border-primary class').toContain('border-primary');
    expect(emailClasses, 'Email should have bg-primary/10 class').toContain('bg-primary/10');
    log.success('✅ Email is selected by default');

    // Check Normal Voucher is selected - image has border-primary class
    await this.normalVoucher.waitFor({ state: 'visible', timeout: 5000 });
    await expect(this.normalVoucher, 'Voucher image should be visible').toBeVisible();
    const voucherClasses = await this.normalVoucher.getAttribute('class');
    expect(voucherClasses, 'Voucher should have border-primary class').toContain('border-primary');
    log.success('✅ Normal voucher is selected by default');

    // Check Amount 500 is selected - has border-primary and bg-primary/10
    await this.amount500.waitFor({ state: 'visible', timeout: 5000 });
    const amountClasses = await this.amount500.getAttribute('class');
    expect(amountClasses, 'Amount 500 should have border-primary class').toContain('border-primary');
    expect(amountClasses, 'Amount 500 should have bg-primary/10 class').toContain('bg-primary/10');
    log.success('✅ Amount 500 is selected by default');
  }

  async getTotalValue() {
    await expect(this.totalValue, 'Total value should be visible').toBeVisible();
    const totalText = await this.totalValue.innerText();
    expect(totalText.trim(), 'Total value should be ৳ 500').toBe('৳ 500');
    return totalText.trim();
  }

  async clickOrder() {
    log.info('Click order');
    await this.orderButton.click();
  }
}
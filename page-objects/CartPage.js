import { expect } from '@playwright/test';
import exp from 'constants';
export class CartPage {
  constructor(page) {
    this.page = page;
    this.selectAllCheckboxState = page.locator('#cartSelectAll').first();
    this.selectAllCheckbox = page
      .locator(`xpath=//*[contains(@class, 'cartHeader') and contains(@class, 'checkboxContainer')]`)
      .first();

    this.selectedProducts = page.locator('.cart-checked');
    this.cartItems = page.locator('.cart-item');

    this.emptyCartText = page.locator('text=Your Cart is Empty!');
    this.cartProductName = page.locator('.product-title');
    this.orderAsGiftButton = page.getByRole('button', { name: 'Order as a Gift' });
    this.proceedToCheckoutButton = page.getByRole('button', { name: 'Proceed to Checkout' });

    this.shippingAddressSection = page.locator('[id^="addressid-"]');

    this.shippingAddressHeader = page.locator(
      `xpath=//*[contains(@class, 'cartShippingAddress') and contains(@class, 'header')]`
    );

    this.addShippingAddressButton = page.locator('button:has-text("+ Add Shipping Address")');
    this.addAddressPopup = page.locator('.shippingAddressForm-module-scss-module__Hsp-IW__container');

    this.overlay = page.locator('#js--modal-overlay');
    this.addressModalCloseButton = page.locator(
      `xpath=//*[contains(@class, 'modal') and contains(@class, 'modalCloseButton')]`
    );

    this.addressForm = page.locator('.shippingAddressForm-module-scss-module__Hsp-IW__formsContainer');

    this.currentAddressSection = page.locator(
      `xpath=//*[contains(@class, 'cartShippingAddress') and contains(@class, 'addressCon')]`
    ).first();

    this.payableTotalRow = page.locator(
      `xpath=//*[contains(@class, "checkoutSummary") and contains(@class, "rowContainer") and .//span[contains(text(), "Payable Total")]]`
    );
  }
  async visit() {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('load');
  }

  async getPageTitle() {
    return await this.page.title();
  }

  /* **************************** Cart - all products section **************************** */
  async isCartEmpty() {
    return await this.emptyCartText.isVisible();
  }

  async isProductInCart(productId) {
    const productLocator = this.page.locator(`#js--cart-product-item-${productId}`);
    const isVisible = await productLocator.isVisible();
    return isVisible;
  }

  async selectProductById(productId) {
    await this.selectAllCheckbox.waitFor({ state: 'visible' });
    let isChecked = await this.selectAllCheckboxState.isChecked();
    if (isChecked) {
      await this.selectAllCheckbox.click();
    } else {
      await this.selectAllCheckbox.click();
      await this.page.waitForTimeout(2000);
      await this.selectAllCheckbox.click();
    }
    const productLocator = this.page.locator(
      `xpath=//*[@id="ts--cart-product-item-${productId}"]//*[contains(@class, "cartItem") and contains(@class, "checkboxContainer")]`
    );
    await productLocator.click();
    await this.page.waitForTimeout(2000);
  }

  async getCurrentAddress() {
    await expect(this.currentAddressSection, 'Current address section should be visible').toBeVisible({
      timeout: 2500
    });
    const currentAddress = await this.currentAddressSection.innerText();
    console.log('Current address: ', currentAddress);
    return currentAddress;
  }

  async changeShippingAddress(country) {
    await expect(this.currentAddressSection, 'Current address section should be visible').toBeVisible({
      timeout: 2500
    });
    const changeButton = await this.shippingAddressHeader.getByRole('button', { name: 'Change' });
    await changeButton.click();
    await expect(this.overlay, 'Overlay should be visible').toBeVisible({ timeout: 2500 });
    await expect(this.addressModalCloseButton, 'Address modal form should be visible').toBeVisible({ timeout: 2500 });
    //await this.page.waitForTimeout(3000);
    //await this.page.pause();
    let addressContainers = await this.page.locator(`xpath=//*[contains(@class, 'shippingAddressList') and contains(@class, 'popupaddressContainer')]`);
    let addressCount = await addressContainers.count();
    console.log(`Total addresses found: ${addressCount}`);
    for (let i = 0; i < addressCount; i++) {
      const addressContainer = addressContainers.nth(i);
      // Locate the text span containing the country name (e.g., "Bangladesh")
      const countryText = await addressContainer
        .locator(`xpath=//*[contains(@class, 'singleAddress') and contains(@class, 'userAddress')]//span[last()]`)
        .innerText();
      if (countryText.includes(country)) {
        console.log(`✅ Found address with country: ${country}`);
        const radioButton = addressContainer.locator(`xpath=//*[contains(@class, 'singleAddress') and contains(@class, 'customCheckbox')]`);
        await radioButton.click();
        await expect(this.overlay, 'Overlay should disappear after selecting address').toBeHidden({ timeout: 3000 });
        return;
      }
    }
    console.log(`❌ No address found with country: ${country}`);
  }

  async isEmployeeDiscountApplied(){
    const employeeDiscountBadge = await this.page.locator('.checkoutSummary-module-scss-module__LKFYTa__rowContainer:has-text("Employee Discount")');
    const isVisible = await employeeDiscountBadge.isVisible();
    console.log(`Employee Discount applied: ${isVisible}`);
    console.log(`Discounr value: ${await employeeDiscountBadge.locator('span').nth(1).innerText()}`);
    return isVisible;
  }

  async getPayableTotal() {
    
    await expect(this.payableTotalRow, 'Payable total row should be visible').toBeVisible({ timeout: 2500 });
    const [label, amount] = await Promise.all([
      this.payableTotalRow.locator('span').first().innerText(),
      this.payableTotalRow.locator('span').nth(1).innerText()
    ]);
    expect(label).toBe('Payable Total');
    expect(amount, 'Payable total amount should be greater than 0').not.toBe('৳0');
    return amount;
  }

  async clickProceedToCheckout() {
    console.log('Proceeding to checkout...');
    await this.proceedToCheckoutButton.scrollIntoViewIfNeeded();
    const isEnabled = await this.proceedToCheckoutButton.isEnabled();
    if (isEnabled) {
      await this.proceedToCheckoutButton.click();
      console.log('✅ Proceed to checkout button is enabled and clicked');
    } else {
      console.log('❌ Proceed to checkout button is disabled');
    }
  }
  async clickOrderAsGift() {
    console.log('Order as gift...');
    await this.orderAsGiftButton.scrollIntoViewIfNeeded();
    const isEnabled = await this.orderAsGiftButton.isEnabled();
    if (isEnabled) {
      await this.orderAsGiftButton.click();
      console.log('✅ Order as a gift button is enabled and clicked');
    } else {
      console.log('❌ Order as a gift button is disabled');
    }
    await this.page.waitForLoadState('load');
  }
}

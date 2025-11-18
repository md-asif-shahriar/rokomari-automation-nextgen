import { expect } from '@playwright/test';
export class CartPage {
  constructor(page) {
    this.page = page;
    this.selectAllCheckboxState = page.locator('#cartSelectAll');
    this.selectAllCheckbox = page.locator(
      `xpath=//*[contains(@class, 'cartHeader') and contains(@class, 'checkboxContainer')]`
    ).first();

    this.selectedProducts = page.locator('.cart-checked');
    this.cartItems = page.locator('.cart-item');

    this.emptyCartText = page.locator('text=Your Cart is Empty!');
    this.cartProductName = page.locator('.product-title');
    this.orderAsGiftButton = page.getByRole('button', { name: 'Order as a Gift' });
    this.proceedToCheckoutButton = page.getByRole('button', { name: 'Proceed to Checkout' });

    this.shippingAddressSection2 = page.locator('.cartShippingAddress-module-scss-module__PtBzOa__addressCon');
    this.shippingAddressSection = page.locator('[id^="addressid-"]');

    this.addShippingAddressButton = page.locator('button:has-text("+ Add Shipping Address")');
    this.addAddressPopup = page.locator('.shippingAddressForm-module-scss-module__Hsp-IW__container');

    this.overlay = page.locator('#js--modal-overlay');

    this.addressForm = page.locator('.shippingAddressForm-module-scss-module__Hsp-IW__formsContainer');
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
    console.log("Is 'Select All' checkbox checked? ", isChecked);
    if (isChecked) {
      await this.selectAllCheckbox.click();
    } else {
      await this.selectAllCheckbox.click();
      await this.page.waitForTimeout(2000);
      await this.selectAllCheckbox.click();
    }
    isChecked = await this.selectAllCheckboxState.isChecked();
    console.log("Is 'Select All' checkbox checked 2? ", isChecked);
    const productLocator = this.page.locator(
      `xpath=//*[@id="ts--cart-product-item-${productId}"]//*[contains(@class, "cartItem") and contains(@class, "checkboxContainer")]`
    );
    await productLocator.click();
    await this.page.waitForTimeout(2000);
  }

  async selectAddress(localAddress) {
    if (await this.shippingAddressSection.isVisible()) {
      console.log('✅ Shipping address is selected');
      return;
    }
    console.log('Selecting address: ', localAddress);
    const { name, phone, alternatePhone, country, city, area, addressLine, addressType } = localAddress;
    await this.page.pause();
    await this.addShippingAddressButton.click();
    await this.page.pause();
    await expect(this.overlay, 'Overlay should be visible').toBeVisible({ timeout: 2500 });
    await expect(this.addAddressPopup, 'Address modal form should be visible').toBeVisible({ timeout: 2500 });

    //this.addressForm = this.page.locator('.shippingAddressForm-module-scss-module__Hsp-IW__formsContainer');
    console.log(`address form visibility: ${await this.addressForm.isVisible()}`);
    await this.page.pause();

    await this.addressForm.getByPlaceholder('Name').fill(name);
    await this.addressForm.getByPlaceholder('Mobile (WhatsApp Number Preferable) *').fill(phone);
    await this.addressForm.getByPlaceholder('Alt. Mobile Number').fill(alternatePhone);
    await this.addressForm.getByRole('radio', { name: 'HOME' }).check();
    await this.page.pause();

    await addressForm.getByRole('combobox').selectOption('ভারত');
    await this.page.pause();
    await addressForm.getByRole('combobox').selectOption(city);
    await addressForm.getByRole('combobox').selectOption(area);
    await addressForm.getByPlaceholder('বাসা/ফ্ল্যাট নম্বর').fill(addressLine);
    await addressForm.getByRole('combobox').selectOption(addressType);
    await this.page.pause();

    await addressForm.getByRole('input', { name: 'Home' }).click();

    await addressForm.getByRole('button', { name: 'সেভ করে এগিয়ে যান' }).click();
    console.log('✅ Address selected/added successfully');
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
    console.log('Payable Total Label: ', label);
    console.log('Payable Total Amount: ', amount);
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
    await this.page.waitForLoadState('load');
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

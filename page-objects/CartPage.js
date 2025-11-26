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
    this.yourTotal = page.locator(
      `xpath=//*[contains(@class, 'cartHeader') and contains(@class, 'cartSummary')]`
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

  async selectProductById2(productId) {
    await this.selectAllCheckbox.waitFor({ state: 'visible' });
    let isChecked = await this.selectAllCheckboxState.isChecked();
    if (isChecked) {
      await this.selectAllCheckbox.click();
    } else {
      await this.selectAllCheckbox.click();
      await this.yourTotal.waitFor({ state: 'visible' });
      await this.selectAllCheckbox.click();
      await this.yourTotal.waitFor({ state: 'hidden' });
    }
    const productLocator = this.page.locator(
      `xpath=//*[@id="ts--cart-product-item-${productId}"]//*[contains(@class, "cartItem") and contains(@class, "checkboxContainer")]`
    );
    await productLocator.waitFor({ state: 'visible' });
    await productLocator.click();
    await this.yourTotal.waitFor({ state: 'visible' });
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
    try {
      console.log(`🔄 Changing shipping address to: ${country}`);
    const previousTotal = await this.getPayableTotal();
      console.log(`Previous payable total: ${previousTotal}`);
    await expect(this.currentAddressSection, 'Current address section should be visible').toBeVisible({
      timeout: 3000
    });
    const changeButton = await this.shippingAddressHeader.getByRole('button', { name: 'Change' });
    await changeButton.click();
    await expect(this.overlay, 'Overlay should be visible').toBeVisible({ timeout: 3000 });
    await expect(this.addressModalCloseButton, 'Address modal form should be visible').toBeVisible({ timeout: 3000 });
    //await this.page.waitForTimeout(3000);
    let addressContainers = await this.page.locator(`xpath=//*[contains(@class, 'shippingAddressList') and contains(@class, 'popupaddressContainer')]`);
    await addressContainers.first().waitFor({ state: 'visible',timeout: 5000 });
    let addressCount = await addressContainers.count();
    console.log(`Total addresses found: ${addressCount}`);
    if (addressCount === 0) {
        throw new Error('No addresses found in the list');
    }
    for (let i = 0; i < addressCount; i++) {
      const addressContainer = addressContainers.nth(i);
      // Locate the text span containing the country name (e.g., "Bangladesh")
      const countryText = await addressContainer
        .locator(`xpath=//*[contains(@class, 'singleAddress') and contains(@class, 'userAddress')]//span[last()]`)
        .innerText().catch(() => 'Error: Address not found in the list');
      if (countryText.includes(country)) {
        console.log(`✅ Found address with country: ${country}`);
        const radioButton = addressContainer.locator(`xpath=//*[contains(@class, 'singleAddress') and contains(@class, 'customCheckbox')]`);
        await radioButton.click();
        await this.page.waitForLoadState('networkidle', { timeout: 9000 });
        await expect(this.overlay, 'Overlay should disappear after selecting address').toBeHidden({ timeout: 3000 });
        await this.page.waitForLoadState('networkidle', { timeout: 9000 });
        //wait for payable total to update
        const newTotal = await this.payableTotalRow.locator('span').nth(1).innerText();
        console.log(`✅ Address changed successfully. New total: ${newTotal}`);
        return;
      }
    }
    console.log(`❌ No address found with country: ${country}`);
    } catch (error) {
      console.error(`❌ Error changing shipping address:`, error.message);
    }
  }

  async isEmployeeDiscountApplied(){
    const employeeDiscountBadge = await this.page.locator('.checkoutSummary-module-scss-module__LKFYTa__rowContainer:has-text("Employee Discount")');
    const isVisible = await employeeDiscountBadge.isVisible();
    console.log(`Employee Discount applied: ${isVisible}`);
    console.log(`Discounr value: ${await employeeDiscountBadge.locator('span').nth(1).innerText()}`);
    return isVisible;
  }

  async getPayableTotal() {
    await this.page.waitForLoadState('networkidle');
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




  //hhhhhhhhhhhhhhhhhhhhhhhh
  async selectProductById(productId) {
  try {
    // Step 1: Wait for page to be stable
    await this.page.waitForLoadState('domcontentloaded');
    
    // Step 2: Wait for the select all checkbox to be ready
    await this.selectAllCheckbox.waitFor({ 
      state: 'visible',
      timeout: 15000 
    });

    // Step 3: Check the current state
    const isChecked = await this.selectAllCheckboxState.isChecked();
    
    // Step 4: Handle the checkbox state properly
    if (isChecked) {
      // If checked, uncheck it
      await this.clickWithRetry(this.selectAllCheckbox);
      await this.waitForLoadingToFinish();
      await this.yourTotal.waitFor({ state: 'hidden', timeout: 10000 });
      
    } else {
      // If unchecked, check it first then uncheck it
      await this.clickWithRetry(this.selectAllCheckbox);
      await this.waitForLoadingToFinish();
      await this.yourTotal.waitFor({ state: 'visible', timeout: 10000 });
      
      // Now uncheck it
      await this.clickWithRetry(this.selectAllCheckbox);
      await this.waitForLoadingToFinish();
      await this.yourTotal.waitFor({ state: 'hidden', timeout: 10000 });
    }

    // Step 5: Wait for page to be fully stable before selecting product
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });

    // Step 6: Select the specific product
    const productLocator = this.page.locator(
      `xpath=//*[@id="ts--cart-product-item-${productId}"]//*[contains(@class, "cartItem") and contains(@class, "checkboxContainer")]`
    );

    // Wait for product element to be ready
    await productLocator.waitFor({ 
      state: 'attached',
      timeout: 15000 
    });

    await this.clickWithRetry(productLocator);
    await this.waitForLoadingToFinish();
    await this.yourTotal.waitFor({ state: 'visible', timeout: 10000 });

    console.log(`✅ Successfully selected product: ${productId}`);
    
  } catch (error) {
    console.error(`❌ Error selecting product ${productId}:`, error.message);
    
    // Debug information
    console.log('Page closed?', this.page.isClosed());
    console.log('Current URL:', this.page.url());
    
    throw error;
  }
}

// Helper method: Click with retry logic
async clickWithRetry(locator, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Wait for element to be visible and stable
      await locator.waitFor({ state: 'visible', timeout: 10000 });
      
      // Wait a bit for any animations to complete
      await this.page.waitForTimeout(300);
      
      // Try to click
      await locator.click({ 
        timeout: 10000,
        force: false // Don't force click, ensure element is actually clickable
      });
      
      // Click succeeded
      return;
      
    } catch (error) {
      console.log(`Click attempt ${i + 1} failed: ${error.message}`);
      
      if (i === maxRetries - 1) {
        // Last attempt failed, throw error
        throw new Error(`Failed to click after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retry
      await this.page.waitForTimeout(1000);
    }
  }
}

// Helper method: Wait for loading overlays to disappear
async waitForLoadingToFinish() {
  try {
    // Wait for common loading indicators to disappear
    const loadingOverlay = this.page.locator('.loading-outer-overlay');
    
    // If loading overlay exists, wait for it to disappear
    const isVisible = await loadingOverlay.isVisible().catch(() => false);
    
    if (isVisible) {
      await loadingOverlay.waitFor({ 
        state: 'hidden', 
        timeout: 15000 
      });
    }
    
    // Additional wait for network to be idle
    await this.page.waitForLoadState('networkidle', { 
      timeout: 10000 
    }).catch(() => {
      // Ignore timeout, continue anyway
      console.log('Network idle timeout, continuing...');
    });
    
    // Small buffer for DOM to stabilize
    await this.page.waitForTimeout(500);
    
  } catch (error) {
    // If waiting for loading fails, continue anyway after a delay
    console.log('Loading wait issue:', error.message);
    await this.page.waitForTimeout(1000);
  }
}

  //hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
}

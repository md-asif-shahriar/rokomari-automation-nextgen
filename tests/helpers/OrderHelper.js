import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/HomePage';
import { SignInPage } from '../../page-objects/SignInPage';
import testData from './testData.js';
import { BookDetailsPage } from '../../page-objects/BookDetailsPage';
import { SearchResultPage } from '../../page-objects/SearchResultPage';
import { CartPage } from '../../page-objects/CartPage';
import { PaymentPage } from '../../page-objects/PaymentPage';
import { ConfirmedOrderPage } from '../../page-objects/ConfirmedOrderPage';
import { TrackOrderPage } from '../../page-objects/TrackOrderPage';
import { MyOrderPage } from '../../page-objects/MyOrderPage';
import { CommonOptions } from '../../page-objects/CommonOptions';
import { OnlinePaymentPage } from '../../page-objects/OnlinePayment.js';
import { GiftVoucherPage } from '../../page-objects/GiftVoucherPage';
import log from '../../utils/logger.js';

export default class OrderHelper {
  constructor(page) {
    this.page = page;

    // Initialize page objects
    this.homePage = new HomePage(page);
    this.signInPage = new SignInPage(page);
    this.searchResultPage = new SearchResultPage(page);
    this.bookDetailsPage = new BookDetailsPage(page);
    this.cartPage = new CartPage(page);
    this.paymentPage = new PaymentPage(page);
    this.confirmedOrderPage = new ConfirmedOrderPage(page);
    this.trackOrderPage = new TrackOrderPage(page);
    this.myOrderPage = new MyOrderPage(page);
    this.commonOptions = new CommonOptions(page);
    this.onlinePaymentPage = new OnlinePaymentPage(page);
    this.giftVoucherPage = new GiftVoucherPage(page);

    // Page titles
    this.titles = testData.titles;

    // Page URL paths
    this.paths = testData.paths;

    //Save state
    this.resetState();
  }

  // Method to reset the state
  resetState() {
    this.state = {
      payableTotal: null,
      paymentMethod: null,
      orderId: null,
      orderStatus: null
    };
  }

  // Open Home Page
  async openHomePage() {
    this.resetState();
    log.step('Opening home page');
    await this.page.goto('/');
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.titles.homePage);
    expect.soft(this.page.url()).toMatch(this.paths.homePage);
    await this.page.keyboard.press('Escape');
    log.success('Home page loads successfully');
  }

  // Sign In
  async signIn(email, password, expectedPage) {
    if (expectedPage === 'cart') {
      log.step('In sign in page');
      await expect.soft(this.page).toHaveTitle(this.titles.signInPage);
      log.success('Sign in page loads successfully');
      await this.signInPage.login(email, password);
      log.info(`Landing on cart page after login`);
      await this.page.waitForLoadState('load');
      await expect.soft(this.page).toHaveTitle(this.titles.cartPage);
      log.success('Cart page loads successfully');
    } else if (expectedPage === 'home') {
      log.step('In home page');
      log.info('Click sign in button');
      await this.commonOptions.clickSignIn();
      await this.page.waitForLoadState('load');
      await expect.soft(this.page).toHaveTitle(this.titles.signInPage);
      log.success('Sign in page loads successfully');
      log.step('In sign in page');
      log.info('Perform sign in with email and password');
      await this.signInPage.login(email, password);
      log.info(`Landing on home page after login`);
      await this.page.waitForLoadState('load');
      await expect.soft(this.page).toHaveTitle(this.titles.homePage);
      log.success('Home page loads successfully');
    }
  }

  // Search for a Book
  async searchForABook(searchKeyword, productTitle) {
    log.info('Going to search result page');
    await this.homePage.search(searchKeyword);
    await expect.soft(this.page).toHaveTitle(this.titles.searchResultPage);
    log.success('Search result page loads successfully');
    log.step('In search result page');
    log.info(`Looking for a book named: ${productTitle}`);
    const productLocator = await this.searchResultPage.isProductFound(productTitle);

    if (productLocator && (await productLocator.count()) > 0) {
      log.success(`Search service is working properly. Product found: ${productTitle}`);
      log.info(`Go to book details from search result`);
      await this.searchResultPage.goToProductDetails(productLocator);
      await expect.soft(this.page).toHaveTitle(this.titles.bookDetailsPage);
      log.success('Book details page loads successfully');
    } else {
      const errorMsg = `Product Not Found or search service is not working properly for: ${productTitle}`;
      log.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  async bookDetails(type = 'book') {
    if (type === 'book') {
      log.step('In book details page');
      log.info(`Book Title: ${await this.bookDetailsPage.getBookTitle()}`);
      log.info(`Author Name: ${await this.bookDetailsPage.getAuthorName()}`);
    }
    else if(type === 'voucher'){
      log.step('In gift voucher page');
      await this.giftVoucherPage.verifyDefaultSelections();
      const totalValue = await this.giftVoucherPage.getTotalValue();
      log.info(`Total value: ${totalValue}`);
      this.state.payableTotal = totalValue;
      await this.giftVoucherPage.clickOrder();
      await this.page.waitForLoadState('load');
      await expect.soft(this.page).toHaveTitle(this.titles.paymentPage);
      log.success('Gift voucher payment page loads successfully');
    }
  }

  // Add Book to Cart
  async addToCart() {
    log.info('Click add to cart');
    await this.bookDetailsPage.clickAddToCart();
    //await this.page.pause();
  }

  // Go to Cart
  async goToCart() {
    log.info('Click go to cart');
    await this.bookDetailsPage.clickGoToCart();
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.titles.cartPage);
    log.success('Cart page loads successfully');
  }

  async buyEbook() {
    log.info('Buying ebook');
    const ebookPrice = await this.bookDetailsPage.getEbookPrice();
    log.info(`Ebook Price: ${ebookPrice}`);
    this.state.payableTotal = ebookPrice;
    log.info(`Payable Total set in state: ${this.state.payableTotal}`);
    await this.bookDetailsPage.clickBuyEbook();
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.titles.paymentPage);
    log.success('Payment page loads successfully');
    //await this.page.pause();
  }

  // Process Gift Voucher Order
  async processGiftVoucherOrder(email = 'test@example.com', name = 'Test Recipient', message = 'Test gift voucher message') {
    log.step('In gift voucher payment page');
    
    // Verify gift voucher form is visible
    await this.paymentPage.verifyGiftVoucherForm();
    
    // Fill the gift voucher form
    await this.paymentPage.fillGiftVoucherForm(email, name, message);
    
    // Verify totals match state
    await this.paymentPage.verifyGiftVoucherTotals(this.state.payableTotal);
    
    log.success('Gift voucher order form processed successfully');
  }

  async selectProduct(productId) {
    log.step('In cart page');
    await this.cartPage.selectProductById(productId);
    //await this.page.pause();
  }

  async selectShippingAddress(country = 'বাংলাদেশ') {
    log.info('Selecting shipping address');
    let currentAddress = await this.cartPage.getCurrentAddress();
    if (currentAddress.includes(country)) {
      log.success(`${country} address is already selected`);
    } else {
      await this.cartPage.changeShippingAddress(country);
      log.success(`Address changed for ${country} successfully`);
    }
    // After ensuring the correct address, wait for any pricing recalculation
    // and refresh the payable total in state.
    await this.page.waitForLoadState('networkidle');
    this.state.payableTotal = await this.cartPage.getPayableTotal();
    log.info(`Payable Total after selecting address: ${this.state.payableTotal}`);
  }

  async checkEmployeeDiscountApplied() {
    log.info('Checking employee discount in cart');
    const isEmployeeDiscountApplied = await this.cartPage.isEmployeeDiscountApplied();
    expect(isEmployeeDiscountApplied, 'Employee discount should be applied').toBeTruthy();
  }

  // Proceed to Checkout
  async proceedToCheckout() {
    const isEmpty = await this.cartPage.isCartEmpty();
    expect(isEmpty).toBeFalsy();
    const isSignInButtonPresent = await this.commonOptions.isSignInButtonPresent();

    if (isSignInButtonPresent) {
      log.info('Clicking proceed to checkout (User not logged in)');
      await this.cartPage.clickProceedToCheckout();
      await this.page.waitForLoadState('load');
      await expect.soft(this.page).toHaveTitle(this.titles.signInPage);
      log.success('Sign in page loads successfully');
    } else {
      this.state.payableTotal = await this.cartPage.getPayableTotal();
      log.info(`Payable Total in cart page: ${this.state.payableTotal}`);
      log.info('Clicking proceed to checkout');
      await this.cartPage.clickProceedToCheckout();
      await this.page.waitForLoadState('load');
      await expect.soft(this.page).toHaveTitle(this.titles.paymentPage);
      log.success('Payment page loads successfully');
    }
    //await this.page.pause();
  }

  async orderAsGift() {
    const isEmpty = await this.cartPage.isCartEmpty();
    expect(isEmpty).toBeFalsy();

    const isSignInButtonPresent = await this.commonOptions.isSignInButtonPresent();
    if (isSignInButtonPresent) {
      log.info('Clicking order as gift (User not logged in)');
      await this.cartPage.clickOrderAsGift();
      await this.page.waitForLoadState('load');
      await expect.soft(this.page).toHaveTitle(this.titles.signInPage);
      log.success('Sign in page loads successfully');
    }

    this.state.payableTotal = await this.cartPage.getPayableTotal();
    log.info(`Payable Total in cart page: ${this.state.payableTotal}`);
    log.info('Clicking order as a gift');
    await this.cartPage.clickOrderAsGift();
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.titles.paymentPage);
    log.success('Payment page loads successfully');
    log.step("In payment page")
    log.info('Filling gift from form ');
    await this.paymentPage.fillUpGiftToForm();
    log.info('Enabling gift wrap option');
    const isGiftWrapChanged = await this.paymentPage.toggleGiftWrap(true);

    // Update payable total for gift wrap
    if(isGiftWrapChanged){
    let base = Number(this.state.payableTotal.replace(/[^\d.]/g, '').trim());
    let updated = base + 20;
    this.state.payableTotal = `৳${updated}`;
    log.info(`New Payable Total after gift wrap: ${this.state.payableTotal}`);
    }
    await this.page.pause();
  }

  // Select Payment Method
  async selectPaymentMethod(paymentMethod = 'COD') {
    log.step('In payment page');
    log.info(`Selecting payment method: ${paymentMethod}`);
    this.state.paymentMethod = paymentMethod;
    await this.paymentPage.selectPaymentMethod(paymentMethod);

    //await this.page.pause();
  }

  async selectPaymentMethodForEbook(paymentMethod) {
    log.step('In payment page');
    log.info(`Selecting payment method for ebook: ${paymentMethod}`);
    this.state.paymentMethod = paymentMethod;
    await this.paymentPage.selectPaymentMethod(paymentMethod);
  }

  // Helper to extract order ID from URL
  async _extractOrderIdFromUrl() {
    try {
      await this.page.waitForURL('**/*orderid=*', { timeout: 15000 });
      const currentUrl = this.page.url();
      const urlParams = new URLSearchParams(new URL(currentUrl).search);
      const orderId = urlParams.get('orderid');

      if (orderId) {
        this.state.orderId = orderId;
        log.info(`Order ID extracted: ${this.state.orderId}`);
        return orderId;
      } else {
        log.warn('Order ID not found in URL parameters');
        return null;
      }
    } catch (error) {
      log.error(`Failed to extract order ID: ${error.message}`);
      return null;
    }
  }

  // Confirm Order (Unified for all order types: Normal, Gift, Ebook, Voucher)
  async confirmOrder(isEbook = false) {
    // Verify totals before confirming (ebook doesn't have payable total row)
    if (!isEbook) {
      const payableTotal = await this.paymentPage.getPayableTotal();
      log.info(`Payable Total in payment page: ${payableTotal}`);
      expect.soft(payableTotal, 'Payable total should be same in payment page').toBe(this.state.payableTotal);
    }

    const confirmOrderButtonTotal = await this.paymentPage.getConfimmOrderButtonTotal();
    expect
      .soft(confirmOrderButtonTotal, 'Confirm order button amount should be same in payment page')
      .toBe(this.state.payableTotal);

    log.info('Clicking confirm order');
    await this.paymentPage.confirmOrder();

    // Extract Order ID
    await this._extractOrderIdFromUrl();

    await this.page.waitForLoadState('load');

    // Verify navigation for COD/Rocket
    if (this.state.paymentMethod === 'cod' || this.state.paymentMethod === 'rocket') {
      await expect.soft(this.page).toHaveTitle(this.titles.confirmedOrderPage);
      log.success('Confirmed order page loads successfully');
    }
  }

  // Wrapper for Ebook confirmation to maintain API compatibility if needed
  async confirmOrderEbook() {
    return this.confirmOrder(true);
  }

  async handleOnlinePaymentGateway() {
    if (!this.state.paymentMethod) {
      throw new Error('Payment method is not set in state');
    }
    log.step(`In ${this.state.paymentMethod} payment gateway page`);

    await this.page.waitForLoadState('domcontentloaded');
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (e) {
      log.warn(`Network idle timeout, continuing...${e.message}`);
    }

    const currentUrl = this.page.url();
    const currentDomain = new URL(currentUrl).origin;
    const expectedDomain = testData.domain[this.state.paymentMethod];

    expect.soft(currentDomain, `Should navigate to ${this.state.paymentMethod} payment gateway`).toBe(expectedDomain);

    const expectedTitle = this.titles.paymentGatewayPage[this.state.paymentMethod];
    await expect.soft(this.page).toHaveTitle(expectedTitle);
    log.success(`${this.state.paymentMethod} payment gateway page loads successfully`);

    const specificItem = await this.page
      .locator(testData.locators.paymentGatewayPage[this.state.paymentMethod])
      .first();
    await specificItem.waitFor({ state: 'visible', timeout: 15000 });

    if (this.state.paymentMethod === 'card') {
      let cardAmount = await this.onlinePaymentPage.card();
      expect.soft(cardAmount, 'Payable total should match on card page').toBe(this.state.payableTotal);
      log.info(`Amount on card page: PAY ${cardAmount}`);
    } else if (this.state.paymentMethod === 'nagad') {
      let nagadAmount = await this.onlinePaymentPage.nagad();
      expect.soft(nagadAmount, 'Payable total should match on nagad page').toBe(this.state.payableTotal);
      log.info(`Amount on nagad page: BDT ${nagadAmount}.00`);
    }

    await this.page.goto(this.paths.myOrderPage);
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.titles.myOrderPage);
    log.success('Navigated to my order page after online payment successfully');
  }

  // Confirmed Order Page
  async confirmedOrderPageInfo() {
    await this.page.waitForLoadState('load');
    log.step('In confirmed order page');

    if (this.state.orderId === null) {
      log.info('Order ID is null, attempting to retrieve from page');
      this.state.orderId = await this.confirmedOrderPage.getOrderNumber();
      log.info(`Retrieved order ID: ${this.state.orderId}`);
    }

    const payableTotal = await this.confirmedOrderPage.getPayableTotal();
    log.info(`Payable Total in confirmed order page: ${payableTotal}`);
    expect.soft(payableTotal, 'Payable total should be same in confirmed order page').toBe(this.state.payableTotal);
    //await this.page.pause();
  }

  // Go to Track Order Page
  async trackOrder() {
    const currentPagePath = new URL(this.page.url()).pathname;
    log.info(`Current page path: ${currentPagePath}`);

    if (currentPagePath.includes(this.paths.myOrderPage)) {
      log.info('Going to track order from my order page');
      await this.myOrderPage.clickTrackMyOrder();
    } else {
      log.info('Going to track order from confirmed order page');
      await this.confirmedOrderPage.clickTrackOrder();
    }

    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.titles.trackOrderPage);
    log.success('Track order page loads successfully');

    log.step('In track order page');
    const orderNumber = await this.trackOrderPage.getOrderNumber();
    log.info(`Tracked Order Number: ${orderNumber}`);

    if (this.state.orderId === null) {
      log.warn(
        `No order id found (likely due to payment method ${this.state.paymentMethod}), collecting order id from track order page`
      );
      this.state.orderId = orderNumber;
    } else {
      expect(orderNumber, 'Order number in track order page should match the confirmed order page').toBe(
        this.state.orderId
      );
    }

    const payableTotal = await this.trackOrderPage.getPayableTotal();
    log.info(`Payable Total in track order page: ${payableTotal}`);
    expect.soft(payableTotal, 'Payable total should be same in track order page').toBe(this.state.payableTotal);
    //await this.page.pause();
  }

  // Go to My Orders Page
  async myOrder() {
    log.info('Open my section menu and go to My Orders page');
    await this.commonOptions.goToMyOrder();
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.titles.myOrderPage);
    log.success('My Orders page loads successfully');

    log.step('In my Orders page');
    const isOrderFound = await this.myOrderPage.isOrderFound(this.state.orderId);
    log.success(`Order id matched in My Orders page: ${isOrderFound}`);
    expect(isOrderFound, `Order ID ${this.state.orderId} should be found in My Orders`).toBeTruthy();

    const payable = await this.myOrderPage.getPayableTotal();
    log.info(`Payable Total in my order page: ${payable}`);
    expect.soft(payable, 'Payable total should be same in my order page').toBe(this.state.payableTotal);

    this.state.orderStatus = await this.myOrderPage.getOrderStatus();
    log.info(`Current order status of my order ${this.state.orderId} in my order page: ${this.state.orderStatus}`);
    expect.soft(this.state.orderStatus).toBe('PROCESSING');
    //await this.page.pause();
  }

  // Cancel Test Order
  async cancelTestOrder() {
    log.info('Canceling test order');
    await this.myOrderPage.cancelOrder();
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.titles.myOrderPage);

    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (e) {
      log.warn(`Network idle timeout after cancelling order, continuing... ${e.message}`);
    }

    await expect
      .poll(
        async () => {
          const status = await this.myOrderPage.getOrderStatus();
          log.info(`Polling order status: ${status}`);
          return status;
        },
        {
          message: 'Order status should be CANCELLED',
          timeout: 10000
        }
      )
      .toBe('CANCELLED');

    log.info(`Order ${this.state.orderId} cancelled successfully`);
  }
}

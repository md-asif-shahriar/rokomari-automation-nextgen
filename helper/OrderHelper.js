import { test, expect, playwright } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { SignInPage } from '../page-objects/SignInPage';
import testData from '../data/testData';
import { BookDetailsPage } from '../page-objects/BookDetailsPage';
import { SearchResultPage } from '../page-objects/SearchResultPage';
import { CartPage } from '../page-objects/CartPage';
import { PaymentPage } from '../page-objects/PaymentPage';
import { ConfirmedOrderPage } from '../page-objects/ConfirmedOrderPage';
import { TrackOrderPage } from '../page-objects/TrackOrderPage';
import { MyOrderPage } from '../page-objects/MyOrderPage';
import { CommonOptions } from '../page-objects/CommonOptions';
import { nagad, card } from '../page-objects/OnlinePayment.js';
import log from '../utils/logger.js';

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

    // Page titles
    this.homePageTitle = testData.titles.homePage;
    this.signInPageTitle = testData.titles.signInPage;
    this.searchResultPageTitle = testData.titles.searchResultPage;
    this.bookDetailsPageTitle = testData.titles.bookDetailsPage;
    this.cartPageTitle = testData.titles.cartPage;
    this.paymentPageTitle = testData.titles.paymentPage;
    this.confirmedOrderPageTitle = testData.titles.confirmedOrderPage;
    this.trackOrderPageTitle = testData.titles.trackOrderPage;
    this.myOrderPageTitle = testData.titles.myOrderPage;
    this.bkashPageTitle = testData.titles.bkashPage;
    this.nagadPageTitle = testData.titles.nagadPage;
    this.rocketPageTitle = testData.titles.rocketPage;
    this.sslPageTitle = testData.titles.sslPage;

    // Page URL paths
    this.homePagePath = testData.paths.homePage;
    this.myOrderPagePath = testData.paths.myOrderPage;
    this.cartPagePath = testData.paths.cartPage;

    //Save state
    this.state = {
      payableTotal: null,
      paymentMethod: null,
      orderId: null,
      orderStatus: null
    };
  }

  // Open Home Page
  async openHomePage() {
    log.step('Opening home page');
    await this.page.goto('/');
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.homePageTitle);
    expect.soft(this.page.url()).toMatch(this.homePagePath);
    log.success('Home page loads successfully');
  }

  // Sign In
  async signIn(email, password, expectedPage) {
    if (expectedPage === 'cart') {
      log.step('In sign in page');
      await expect.soft(this.page).toHaveTitle(this.signInPageTitle);
      log.success('Sign in page loads successfully');
      await this.signInPage.login(email, password);
      await this.page.waitForLoadState('load');
      await expect.soft(this.page).toHaveTitle(this.cartPageTitle);
      log.success('Cart page loads successfully');
    }
    else if (expectedPage === 'home') {
      log.step('In home page');
      log.info('Click sign in button');
      await this.commonOptions.clickSignIn();
      await this.page.waitForLoadState('load');
      await expect.soft(this.page).toHaveTitle(this.signInPageTitle);
      log.success('Sign in page loads successfully');
      log.step('In sign in page');
      log.info('Perform sign in with email and password');
      await this.signInPage.login(email, password);
      await this.page.waitForLoadState('load');
      await expect.soft(this.page).toHaveTitle(this.homePageTitle);
      log.success('Home page loads successfully');
    }
  }

  // Search for a Book
  async searchForABook(searchKeyword, productTitle) {
    log.info('Searching for a book, search using: ' + searchKeyword);
    await this.homePage.search(searchKeyword);
    await expect.soft(this.page).toHaveTitle(this.searchResultPageTitle);
    log.success('Search result page loads successfully');
    log.step('In search result page');
    test.info(`Looking for a book named: ${productTitle}`);
    const productLocator = await this.searchResultPage.isProductFound(productTitle);
    if (productLocator && (await productLocator.count()) > 0) {
      log.success(`Search service is working properly. Product found: ${productTitle}`);
      await this.searchResultPage.goToProductDetails(productLocator);
      await expect.soft(this.page).toHaveTitle(this.bookDetailsPageTitle);
      log.success('Book details page loads successfully');
    } else {
      log.error(`Product Not Found or search service is not working properly.`);
      return;
    }
  }

  async bookDetails() {
    log.step('In book details page');
    log.info(`Title: ${await this.bookDetailsPage.getTitle()}`);
    log.info(`Book Title: ${await this.bookDetailsPage.getBookTitle()}`);
    log.info(`Author Name: ${await this.bookDetailsPage.getAuthorName()}`);
    //await this.page.pause();
  }

  // Add Book to Cart
  async addToCart() {
    log.info('Adding book to cart');
    await this.bookDetailsPage.clickAddToCart();
    //await this.page.pause();
  }

  // Go to Cart
  async goToCart() {
    log.info('Go to cart');
    await this.bookDetailsPage.clickGoToCart();
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.cartPageTitle);
    log.success('Cart page loads successfully');
    //await this.page.pause();
  }

  async selectProduct(productId) {
    log.step('In cart page');
    log.info('Selecting one product in cart');
    await this.cartPage.selectProductById(productId);
    //await this.page.pause();
  }

  async selectShippingAddress(country = 'বাংলাদেশ') {
    log.info('Selecting shipping address');
    let currentAddress = await this.cartPage.getCurrentAddress();
    if (await currentAddress.includes(country)) {
      log.success(`${country} address is already selected`);
      return;
    } else {
      await this.cartPage.changeShippingAddress(country);
      log.success(`Address changed for ${country} successfully`);
    }
  }

  async checkEmployeeDiscountApplied() {
    log.info('Checking employee discount in cart');
    const isEmployeeDiscountApplied = await this.cartPage.isEmployeeDiscountApplied();
    expect(isEmployeeDiscountApplied, 'Employee discount should be applied').toBeTruthy();
  }

  // Proceed to Checkout
  async proceedToCheckout(expectedPage) {
    const isEmpty = await this.cartPage.isCartEmpty();
    expect(isEmpty).toBeFalsy();
    const isSignInButtonPresent = await this.commonOptions.isSignInButtonPresent();
    if (isSignInButtonPresent) {
      log.info('Clicking proceed to checkout');
      await this.cartPage.clickProceedToCheckout();
      await this.page.waitForLoadState('load');
      await expect.soft(this.page).toHaveTitle(this.signInPageTitle);
      log.success('Sign in page loads successfully');
      console.log(`Page url: ${await this.page.title()}`);
    } else {
      this.state.payableTotal = await this.cartPage.getPayableTotal();
      log.info(`Payable Total in cart page: ${this.state.payableTotal}`);
      log.info('Clicking proceed to checkout');
      await this.cartPage.clickProceedToCheckout();
      await this.page.waitForLoadState('load');
      await expect.soft(this.page).toHaveTitle(this.paymentPageTitle);
      log.success('Payment page loads successfully');
    }
    //await this.page.pause();
  }

  async orderAsGift(expectedPage) {
    log.info('Clicking order as a gift');
    const isEmpty = await this.cartPage.isCartEmpty();
    expect(isEmpty).toBeFalsy();
    const isSignInButtonPresent = await this.commonOptions.isSignInButtonPresent();
    if (isSignInButtonPresent) {
      await this.cartPage.clickOrderAsGift();
      await this.page.waitForLoadState('load');
      await expect.soft(this.page).toHaveTitle(this.signInPageTitle);
      log.success('Sign in page loads successfully');
      return;
    }
    this.state.payableTotal = await this.cartPage.getPayableTotal();
    log.info(`Payable Total in cart page: ${this.state.payableTotal}`);
    await this.cartPage.clickOrderAsGift();
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.paymentPageTitle);
    log.success('Payment page loads successfully');
    log.info('Filling gift from form ');
    await this.paymentPage.fillUpGiftToForm();
    log.info('Enabling gift wrap option');
    await this.paymentPage.toggleGiftWrap(true);
    await this.page.pause();
    let base = Number(this.state.payableTotal.replace('৳', '').trim());
    let updated = base + 20;
    this.state.payableTotal = `৳${updated}`;
    log.info(`New Payable Total after gift wrap: ${this.state.payableTotal}`);
    await this.page.pause();
  }

  // Select Payment Method
  async selectPaymentMethod(paymentMethod = 'COD') {
    log.step('In payment page');
    log.info(`Selecting payment method: ${paymentMethod}`);
    await this.paymentPage.selectPaymentMethod(paymentMethod);
    this.state.paymentMethod = paymentMethod;
    //await this.page.pause();
  }

  // Confirm Order
  async confirmOrder() {
    log.info('Clicking onfirm order');
    const payableTotal = await this.paymentPage.getPayableTotal();
    const confirmOrderButtonTotal = await this.paymentPage.getConfimmOrderButtonTotal();
    log.info(`Payable Total in payment page: ${payableTotal}`);
    expect(payableTotal, 'Payable total should be same in payment page').toBe(this.state.payableTotal);
    expect(confirmOrderButtonTotal, 'Confirm order button amount should be same in payment page').toBe(
      this.state.payableTotal
    );
    await this.paymentPage.confirmOrder();
    const urlObj = await this.page.waitForURL((url) => url.toString().includes('/confirmation?orderid='), {
      timeout: 3000
    });

    const orderId = new URL(urlObj.toString()).searchParams.get('orderid');

    if (!orderId) {
      throw new Error(`❌ Could not extract order id from URL: ${urlObj}`);
    }

    console.log('🧾 Captured Order ID before redirect:', orderId);

    await this.page.waitForLoadState('load');
    if (this.state.paymentMethod === 'cod' || this.state.paymentMethod === 'rocket') {
      await expect.soft(this.page).toHaveTitle(this.confirmedOrderPageTitle);
      log.success('Confirmed order page loads successfully');
    }
    await this.page.pause();
  }

  async handleOnlinePaymentGateway() {
    log.step(`In ${this.state.paymentMethod} payment gateway page`);
    const currentUrl = await this.page.url();
    const currentDomain = new URL(currentUrl).origin;
    const expectedDomain = testData.domain[this.state.paymentMethod];
    expect.soft(currentDomain, `Should navigate to ${this.state.paymentMethod} payment gateway`).toBe(expectedDomain);
    const expectedTitle = testData.titles.paymentGatewayPage[this.state.paymentMethod];
    await expect.soft(this.page).toHaveTitle(expectedTitle);
    log.success(`${this.state.paymentMethod} payment gateway page loads successfully`);
    const specificItem = await this.page
      .locator(testData.locators.paymentGatewayPage[this.state.paymentMethod])
      .first();
    await specificItem.waitFor({ state: 'visible', timeout: 9000 });
    if (this.state.paymentMethod === 'card') {
      let cardAmount = await card(this.page);
      expect.soft(cardAmount, 'Payable total should match on card page').toBe(this.state.payableTotal);
      log.info(`Amount on card page: PAY ${formattedAmount}`);
      await this.page.pause();
    } else if (this.state.paymentMethod === 'nagad') {
      let nagadAmount = await nagad(this.page);
      expect.soft(nagadAmount, 'Payable total should match on nagad page').toBe(this.state.payableTotal);
      log.info(`Amount on nagad page: BDT ${amount}.00`);
    }
    await this.page.pause();
    await this.page.goto(this.myOrderPagePath);
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.myOrderPageTitle);
    log.success('Navigated to my order page after online payment successfully');
  }

  // Confirmed Order Page
  async confirmedOrderPageInfo() {
    await this.page.waitForLoadState('load');
    log.step('In confirmed order page');
    log.info(`Expected order ID from confirmed order page: ${this.state.orderId}`);
    this.state.orderId = await this.confirmedOrderPage.getOrderNumber();
    const payableTotal = await this.confirmedOrderPage.getPayableTotal();
    log.info(`Payable Total in confirmed order page: ${payableTotal}`);
    expect(payableTotal, 'Payable total should be same in confirmed order page').toBe(this.state.payableTotal);
    //await this.page.pause();
  }

  // Go to Track Order Page
  async trackOrder() {
    const currentPagePath = new URL(await this.page.url()).pathname;
    log.info(`Current page path: ${currentPagePath}`);
    if (currentPagePath.includes(this.myOrderPagePath)) {
      log.info('Going to track order from my order page');
      await this.myOrderPage.clickTrackMyOrder();
    } else {
      log.info('Going to track order from confirmed order page');
      await this.confirmedOrderPage.clickTrackOrder();
    }
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.trackOrderPageTitle);
    log.success('Track order page loads successfully');
    log.step('In track order page');
    const orderNumber = await this.trackOrderPage.getOrderNumber();
    log.info(`Tracked Order Number: ${orderNumber}`);
    if (this.state.orderId === null) {
      log.warn(
        `No order id found because of payment method ${this.state.paymentMethod}, collecting order id from track order page`
      );
      this.state.orderId = orderNumber;
    } else {
      expect(orderNumber, 'Order number in track order page should match the confirmed order page').toBe(
        this.state.orderId
      );
    }
    const payableTotal = await this.trackOrderPage.getPayableTotal();
    log.info(`Payable Total in track order page: ${payableTotal}`);
    expect(payableTotal, 'Payable total should be same in track order page').toBe(this.state.payableTotal);
    //await this.page.pause();
  }

  // Go to My Orders Page
  async myOrder() {
    log.info('Open my section menu and go to My Orders page');
    await this.commonOptions.goToMyOrder();
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.myOrderPageTitle);
    log.success('My Orders page loads successfully');
    log.info('In my Orders page');
    const isOrderFound = await this.myOrderPage.isOrderFound(this.state.orderId);
    log.success(`Order id matched in My Orders page: ${isOrderFound}`);
    expect(isOrderFound, `Order ID ${this.state.orderId} should be found in My Orders`).toBeTruthy();
    const payable = await this.myOrderPage.getPayableTotal();
    log.info(`Payable Total in my order page: ${payable}`);
    expect(payable, 'Payable total should be same in my order page').toBe(this.state.payableTotal);
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
    await expect.soft(this.page).toHaveTitle(this.myOrderPageTitle);
    const orderStatus = await this.myOrderPage.getOrderStatus();
    expect.soft(orderStatus).toBe('CANCELLED');
    log.info(
      `After cancelling, Current order status of my order ${this.state.orderId} in my order page: ${orderStatus}`
    );
    await this.page.pause();
  }
}

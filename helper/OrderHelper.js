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
    this.commonOptions = new CommonOptions(page); // Assuming you have a CommonOptions helper

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

    // Page URL paths
    this.homePagePath = testData.paths.homePage;

    this.expectedPayableTotal = '';
    this.expectedOrderId = '';
    this.expectedOrderStatus = '';
  }

  // Open Home Page
  async openHomePage() {
    console.log('➡ Opening home page');
    await this.page.goto('/');
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.homePageTitle);
    expect.soft(this.page.url()).toMatch(this.homePagePath);
    console.log('✅ Home page loads successfully');
  }

  // Sign In
  async signIn(email, password, expectedPage) {
    console.log('➡ Go to sign-in page and perform sign in');
    await this.page.goto('/login');
    await this.signInPage.login(email, password); // Assuming you have a signInPage helper
    await this.page.waitForLoadState('load');

    if (expectedPage === 'home') {
      await expect.soft(this.page).toHaveTitle(this.homePageTitle);
    } else if (expectedPage === 'cart') {
      await expect.soft(this.page).toHaveTitle(this.cartPageTitle);
    }
  }

  // Search for a Book
  async searchForABook(searchKeyword) {
    console.log('➡ Searching for a book');
    await this.homePage.search(searchKeyword);
    await expect.soft(this.page).toHaveTitle(this.searchResultPageTitle);
  }

  // Go to Book Details Page
  async goToBookDetails(productTitle) {
    console.log(`➡ Going to book details for: ${productTitle}`);
    const productLocator = await this.searchResultPage.isProductFound(productTitle);
    //expect(productLocator.trim().length).toBeGreaterThan(0);

    if (productLocator && (await productLocator.count()) > 0) {
      console.log(`✅ Search service is working properly. Product found: ${productTitle}`);
      await this.searchResultPage.goToProductDetails(productLocator);
      await expect.soft(this.page).toHaveTitle(this.bookDetailsPageTitle);
    } else {
      console.log(`❌ Product Not Found or search service is not working properly.`);
      return;
    }
    //await this.page.pause();
  }
  async displayBookInformations() {
    console.log('➡ Book informations');
    console.log(`Title: ${await this.bookDetailsPage.getTitle()}`);
    console.log(`Book Title: ${await this.bookDetailsPage.getBookTitle()}`);
    console.log(`Author Name: ${await this.bookDetailsPage.getAuthorName()}`);
    //await this.page.pause();
  }

  // Add Book to Cart
  async addToCart() {
    console.log('➡ Adding book to cart');
    await this.bookDetailsPage.clickAddToCart();
    //await this.page.pause();
  }

  // Go to Cart
  async goToCart() {
    console.log('➡ Go to cart');
    await this.bookDetailsPage.clickGoToCart();
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.cartPageTitle);
    //await this.page.pause();
  }
  async selectProduct(productId) {
    console.log('➡ Select product in cart');
    await this.cartPage.selectProductById(productId);
    //await this.page.pause();
  }

  async selectAddress(addressType = 'local') {
    console.log('➡ Select shipping address');
    if (addressType == 'foreign') {
      //await this.cartPage.selectAddress(foreignAddress);
      return;
    }
    //await this.cartPage.selectAddress(localAddress);
    //await this.page.pause();
  }

  // Proceed to Checkout
  async proceedToCheckout() {
    console.log('➡ Proceed to checkout');
    const isEmpty = await this.cartPage.isCartEmpty();
    expect(isEmpty).toBeFalsy();
    this.expectedPayableTotal = await this.cartPage.getPayableTotal();
    console.log(`Payable Total in cart page: ${this.expectedPayableTotal}`);
    await this.cartPage.clickProceedToCheckout();
    await expect.soft(this.page).toHaveTitle(this.paymentPageTitle);
    //await this.page.pause();
  }

  // Select Payment Method
  async selectPaymentMethod(paymentMethod = 'COD') {
    console.log(`➡ Selecting payment method: ${paymentMethod}`);
    //const paymentMethod = 'COD';
    await this.paymentPage.selectPaymentMethod(paymentMethod);
  }

  // Confirm Order
  async confirmOrder() {
    console.log('➡ Confirm order');
    const payableTotal = await this.paymentPage.getPayableTotal();
    const confirmOrderButtonTotal = await this.paymentPage.getConfimmOrderButtonTotal();
    console.log(`Payable Total in payment page: ${payableTotal}`);
    //expect(payableTotal, 'Payable total should be same in payment page').toBe(this.expectedPayableTotal);
    //expect(confirmOrderButtonTotal, 'Confirm order button amount should be same in payment page').toBe(this.expectedPayableTotal);
    await this.paymentPage.confirmOrder();
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.confirmedOrderPageTitle);
    await this.page.pause();
  }

  // Confirmed Order Page
  async confirmedOrderPageInfo() {
    await this.page.waitForLoadState('load');
    console.log('➡ Confirmed order page informations');
    this.expectedOrderId = await this.confirmedOrderPage.getOrderNumber();
    console.log(`Expected order ID in confirmed order page: ${this.expectedOrderId}`);
    const payableTotal = await this.confirmedOrderPage.getPayableTotal();
    console.log(`Payable Total in confirmed order page: ${payableTotal}`);
    //expect(payableTotal, 'Payable total should be same in confirmed order page').toBe(this.expectedPayableTotal);
    console.log(`Expected Order ID: ${this.expectedOrderId}`);
    await this.page.pause();
  }

  // Go to Track Order Page
  async goToTrackOrder() {
    console.log('➡ Go to track order');
    await this.confirmedOrderPage.clickTrackOrder();
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.trackOrderPageTitle);
    await this.page.pause();
  }

  // Track Order Page
  async trackOrderPageInfo() {
    console.log('➡ Track order informations');
    const orderNumber = await this.trackOrderPage.getOrderNumber();
    console.log(`Tracked Order Number: ${orderNumber}`);
    await this.page.pause();
    expect(orderNumber, 'Order number in track order page should match the confirmed order page').toBe(
      this.expectedOrderId
    );
    const payableTotal = await this.trackOrderPage.getPayableTotal();
    console.log(`Payable Total in track order page: ${payableTotal}`);
    //expect(payableTotal, 'Payable total should be same in track order page').toBe(this.expectedPayableTotal);
    await this.page.pause();
  }

  // Go to My Orders Page
  async goToMyOrder() {
    console.log('➡ Go to My Orders');
    await this.commonOptions.goToMyOrder();
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.myOrderPageTitle);
    await this.page.pause();
  }

  // My Order Page
  async myOrderPageInfo() {
    console.log('➡ My Orders page informations');
    const isOrderFound = await this.myOrderPage.isOrderFound(this.expectedOrderId);
    console.log(`Order matched in My Orders page: ${isOrderFound}`);
    await this.page.pause();
    expect(isOrderFound, `Order ID ${this.expectedOrderId} should be found in My Orders`).toBeTruthy();
    const payable = await this.myOrderPage.getPayableTotal();
    console.log(`Payable Total in my order page: ${payable}`);
    expect(payable, 'Payable total should be same in my order page').toBe(this.expectedPayableTotal);
    this.expectedOrderStatus = await this.myOrderPage.getOrderStatus();
    console.log(`Current order status of my order ${this.expectedOrderId} in my order page: ${this.expectedOrderStatus}`);
    expect.soft(this.expectedOrderStatus).toBe('PROCESSING');
    await this.page.pause();
  }

  // Cancel Test Order
  async cancelTestOrder() {
    console.log('➡ Canceling test order');
    await this.myOrderPage.cancelOrder();
    await this.page.waitForLoadState('load');
    await expect.soft(this.page).toHaveTitle(this.myOrderPageTitle);
    const orderStatus = await this.myOrderPage.getOrderStatus();
    expect.soft(orderStatus).toBe('CANCELLED');
    console.log(`After cancelling, Current order status of my order ${this.expectedOrderId} in my order page: ${orderStatus}`);
    await this.page.pause();
  }
}

import { test, expect, playwright } from '@playwright/test';
import OrderHelper  from '../helper/OrderHelper';
import { openHomePage, signIn, addToCart } from './allTestMethods';
import testData from '../data/testData';
let browser;

  // User credentials from environment variables
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  const username = process.env.USERNM;

  let paymentMethod = process.env.PAYMENT_METHOD; // Cash on Delivery

  let searchKeyword = testData.searchKeyword;

  let productId = testData.cartProductId;
  let productTitle = testData.productTitle;



// test.beforeAll(async () => {
//   // Setup code if needed (like initializing a browser or logging in)
//   console.log('Running before all tests');
//   browser = await playwright.chromium.launch({ headless: false });
// });

// test.afterAll(async () => {
//   // Cleanup code if needed
//   console.log('Running after all tests');
//   await page.close();
// });

test.describe('Master Order Flow', () => {
  test.skip('Normal Order Flow (COD)', async ({ page }) => {
    const helper = new OrderHelper(page);
    await helper.openHomePage();
    await helper.goToSignIn();
    await helper.signIn(email, password, 'home');
    await helper.searchForABook(searchKeyword);
    await helper.goToBookDetails(productTitle);
    await helper.displayBookInformations();
    await helper.addToCart();
    await helper.goToCart();
    await helper.selectProduct(productId);
    await helper.selectAddress('local');
    await helper.proceedToCheckout();
    await helper.selectPaymentMethod(paymentMethod);
    await helper.confirmOrder();
    await helper.confirmedOrderPageInfo();
    await helper.goToTrackOrder();
    await helper.trackOrderPageInfo();
    await helper.goToMyOrder();
    await helper.myOrderPageInfo();
    await page.pause();
    await page.close();
    //await helper.cancelTestOrder();
    //await page.pause();
    //await page.close();
  });
  test.skip('Sign in after place order flow', async ({ page }) => {
    const helper = new OrderHelper(page);
    await helper.openHomePage();
    await helper.searchForABook(searchKeyword);
    await helper.goToBookDetails(productTitle);
    await helper.displayBookInformations();
    await helper.addToCart();
    await helper.goToCart();
    await helper.proceedToCheckout('login');
    await helper.signIn(email, password, 'cart');
    await helper.selectProduct(productId);
    await helper.selectAddress('local');
    await helper.proceedToCheckout('payment');
    await helper.selectPaymentMethod(paymentMethod);
    await helper.confirmOrder();
    await helper.confirmedOrderPageInfo();
    await helper.goToTrackOrder();
    await helper.trackOrderPageInfo();
    await helper.goToMyOrder();
    await helper.myOrderPageInfo();
    await page.pause();
    await page.close();
    //await helper.cancelTestOrder();
    //await page.pause();
    //await page.close();
  });
  test.skip('Abroad/Foreign order', async ({ page }) => {
    const helper = new OrderHelper(page);
    await helper.openHomePage();
    await helper.searchForABook(searchKeyword);
    await helper.goToBookDetails(productTitle);
    await helper.displayBookInformations();
    await helper.addToCart();
    await helper.goToCart();
    await helper.proceedToCheckout('login');
    await helper.signIn(email, password, 'cart');
    await helper.selectProduct(productId);
    await helper.selectAddress('local');
    await helper.proceedToCheckout('payment');
    await helper.selectPaymentMethod(paymentMethod);
    await helper.confirmOrder();
    await helper.confirmedOrderPageInfo();
    await helper.goToTrackOrder();
    await helper.trackOrderPageInfo();
    await helper.goToMyOrder();
    await helper.myOrderPageInfo();
    await page.pause();
    await page.close();
    //await helper.cancelTestOrder();
    //await page.pause();
    //await page.close();
  });

  test('Test order', async ({ page }) => {
    const helper = new OrderHelper(page);
    await helper.openHomePage(page);
    await helper.goToSignIn();
    await helper.signIn(email, password, 'home');
    await page.waitForLoadState('load');
    await page.goto('http://94.74.82.109:3000/cart');
    await page.waitForLoadState('load');
    
    await helper.selectAddress('local');
    await page.pause();

    // Add assertions or further test steps
  });
});

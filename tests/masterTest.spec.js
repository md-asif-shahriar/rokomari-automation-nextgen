import { test, expect, playwright } from '@playwright/test';
import OrderHelper  from '../helper/OrderHelper';
import { openHomePage, signIn, addToCart } from './allTestMethods';
import testData from '../data/testData';
let browser;

  // User credentials from environment variables
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  const username = process.env.USERNM;

  let paymentMethodCOD = testData.paymentMethod.cod;
  let paymentMethodBkash = testData.paymentMethod.bkash;
  let paymentMethodNagad = testData.paymentMethod.nagad;
  let paymentMethodRocket = testData.paymentMethod.rocket;
  let paymentMethodCard = testData.paymentMethod.card;

  let sslDomain = testData.domain.card;

  let searchKeyword = testData.searchKeyword;
  let countryBD = testData.localAddress.countryBD;
  let countryIndia = testData.localAddress.countryIndia;

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
    await helper.selectShippingAddress(countryBD);
    await helper.proceedToCheckout();
    await helper.selectPaymentMethod(paymentMethodCOD);
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
    await helper.selectShippingAddress(countryBD);
    await helper.proceedToCheckout('payment');
    await helper.selectPaymentMethod(paymentMethodCOD);
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
  test('Abroad/Foreign order', async ({ page }) => {
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
    await helper.selectShippingAddress(countryIndia);
    await helper.proceedToCheckout('payment');
    await helper.selectPaymentMethod(paymentMethodCard);
    await page.pause();
    await helper.confirmOrder();
    await helper.handleOnlinePaymentGateway(paymentMethodCard, sslDomain);
    await page.pause();
    await helper.confirmedOrderPageInfo();
    await page.pause();
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

  test.skip('Test order', async ({ page }) => {
    const helper = new OrderHelper(page);
    await helper.openHomePage(page);
    await helper.goToSignIn();
    await helper.signIn(email, password, 'home');
    await page.waitForLoadState('load');
    await page.goto('http://94.74.82.109:3000/cart');
    await page.waitForLoadState('load');
    
    await helper.selectShippingAddress(countryBD);
    await helper.selectShippingAddress(countryIndia);
    await helper.selectShippingAddress(countryBD);
    await page.pause();

    // Add assertions or further test steps
  });
});

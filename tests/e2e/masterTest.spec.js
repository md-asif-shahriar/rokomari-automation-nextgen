import { test, expect, playwright } from '@playwright/test';
import OrderHelper from '../helpers/OrderHelper';
import testData from '../helpers/testData';

let browser;

// User credentials from environment variables
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const username = process.env.USERNM;
const apiKey = process.env.API_KEY;

let paymentMethodCOD = testData.paymentMethod.cod;
let paymentMethodBkash = testData.paymentMethod.bkash;
let paymentMethodNagad = testData.paymentMethod.nagad;
let paymentMethodRocket = testData.paymentMethod.rocket;
let paymentMethodCard = testData.paymentMethod.card;

let searchKeyword = testData.searchKeyword;
let countryBD = testData.localAddress.countryBD;
let countryIndia = testData.localAddress.countryIndia;

let productId = testData.cartProductId;
let productTitle = testData.productTitle;

let searchKeywordEbook = testData.searchKeywordEbook;
let productTitleEbook = testData.productTitleEbook;

test.describe('Master Order Flow', () => {
  // This runs after each test automatically
  let context;
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    console.log(`Opening browser for: ${testInfo.title}`);
  });
  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Closing browser for: ${testInfo.title}`);
    await page.close();
    console.log('Browser closed after test');
  });

  // This runs after all tests in this describe block
  test.afterAll(async () => {
    console.log('✅ All tests done!');
  });

  test.describe.configure({ retries: 2 });

  test.skip('Normal Order Flow (COD)', async ({ page }) => {
    const helper = new OrderHelper(page);
    await helper.openHomePage();
    await helper.signIn(email, password, 'home');
    await helper.searchForABook(searchKeyword, productTitle);
    await helper.bookDetails();
    await helper.addToCart();
    await helper.goToCart();
    await helper.selectProduct(productId);
    await helper.selectShippingAddress(countryBD);
    await helper.proceedToCheckout();
    await helper.selectPaymentMethod(paymentMethodCOD);
    await helper.confirmOrder();
    await helper.confirmedOrderPageInfo();
    await helper.trackOrder();
    await helper.myOrder();
    //await page.pause();
    //await helper.cancelTestOrder();
  });
  test.skip('Sign in after place order flow', async ({ page }) => {
    const helper = new OrderHelper(page);
    await helper.openHomePage();
    await helper.searchForABook(searchKeyword, productTitle);
    await helper.bookDetails();
    await helper.addToCart();
    await helper.goToCart();
    await helper.proceedToCheckout('login');
    await helper.signIn(email, password, 'cart');
    await helper.selectProduct(productId);
    await helper.selectShippingAddress(countryBD);
    await helper.proceedToCheckout('payment');
    await helper.selectPaymentMethod(paymentMethodCOD);
    await page.pause();
    await helper.confirmOrder();
    await helper.confirmedOrderPageInfo();
    await helper.trackOrder();
    await helper.myOrder();
    //await page.pause();
    //await helper.cancelTestOrder();
    //await page.pause();
    //await page.close();
  });
  test.skip('Abroad/Foreign order', async ({ page }) => {
    const helper = new OrderHelper(page);
    await helper.openHomePage();
    await helper.searchForABook(searchKeyword, productTitle);
    await helper.bookDetails();
    await helper.addToCart();
    await helper.goToCart();
    await helper.proceedToCheckout('login');
    await helper.signIn(email, password, 'cart');
    await helper.selectProduct(productId);
    await helper.selectShippingAddress(countryIndia);
    await helper.proceedToCheckout('payment');
    await helper.selectPaymentMethod(paymentMethodCard);
    await helper.confirmOrder();
    await helper.handleOnlinePaymentGateway();
    await helper.myOrder();
    await helper.trackOrder();
    await page.close();
    //await helper.cancelTestOrder();
    //await page.pause();
    //await page.close();
  });

  test.skip('Ebook order (Bkash)', async ({ page }) => {
    const helper = new OrderHelper(page);
    await helper.openHomePage();
    await helper.signIn(email, password, 'home');
    await helper.searchForABook(searchKeywordEbook, productTitleEbook);
    await helper.bookDetails();
    await helper.buyEbook();
    await helper.selectPaymentMethodForEbook(paymentMethodBkash);
    await helper.confirmOrderEbook();
    await helper.handleOnlinePaymentGateway(paymentMethodBkash);
    await helper.myOrder();
    await page.pause();
    await helper.cancelTestOrder();
  });
  test.skip('Bkash order', async ({ page }) => {
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
    await helper.selectPaymentMethod(paymentMethodBkash);
    await page.pause();
    await helper.confirmOrder();
    await helper.handleOnlinePaymentGateway(paymentMethodBkash);
    await page.pause();
    await helper.myOrderPageInfo();
    await helper.goToTrackOrder();
    await helper.trackOrderPageInfo(paymentMethodBkash);
    await page.pause();
    await page.close();
    //await helper.cancelTestOrder();
    //await page.pause();
    //await page.close();
  });
  test.skip('Nagad order', async ({ page }) => {
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
    await helper.selectPaymentMethod(paymentMethodNagad);
    await page.pause();
    await helper.confirmOrder();
    await helper.handleOnlinePaymentGateway(paymentMethodNagad);
    await page.pause();
    await helper.myOrderPageInfo();
    await helper.goToTrackOrder();
    await helper.trackOrderPageInfo(paymentMethodNagad);
    await page.pause();
    await page.close();
    //await helper.cancelTestOrder();
    //await page.pause();
    //await page.close();
  });

  test.skip('Rocket order', async ({ page }) => {
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
    await helper.selectPaymentMethod(paymentMethodRocket);
    await helper.confirmOrder();
    await helper.confirmedOrderPageInfo();
    await helper.goToTrackOrder();
    await helper.trackOrderPageInfo(paymentMethodRocket);
    await helper.goToMyOrder();
    await helper.myOrderPageInfo();
    await page.pause();
    await page.close();
    //await helper.cancelTestOrder();
    //await page.pause();
    //await page.close();
  });

  test.skip('Order as gift (Bkash)', async ({ page }) => {
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
    await helper.orderAsGift();
    await helper.selectPaymentMethod(paymentMethodBkash);
    await page.pause();
    await helper.confirmOrder();
    await helper.handleOnlinePaymentGateway(paymentMethodBkash);
    await page.pause();
    await helper.myOrderPageInfo();
    await helper.goToTrackOrder();
    await helper.trackOrderPageInfo(paymentMethodBkash);
    await page.pause();
    await page.close();
    //await helper.cancelTestOrder();
    //await page.pause();
    //await page.close();
  });

  test.skip('OG order', async ({ page }) => {
    const helper = new OrderHelper(page);
    await helper.openHomePage();
    await helper.goToSignIn();
    await helper.signIn(email, password, 'home');
    await helper.searchForABook(searchKeyword);
    await helper.goToBookDetails(productTitle);
    await helper.displayBookInformations();
    await helper.addToCart();
    await helper.goToCart();
    await helper.proceedToCheckout('login');
    await helper.signIn(email, password, 'cart');
    await helper.selectProduct(productId);
    await helper.selectShippingAddress(countryBD);
    await helper.checkEmployeeDiscountApplied();
    await helper.proceedToCheckout('payment');
    await helper.selectPaymentMethod(paymentMethodCOD);
    await page.pause();
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

  test.skip('Affiliate order', async ({ page }) => {
    const helper = new OrderHelper(page);
    await helper.openBookdetailswithAffiliateLink(username, searchKeyword, productTitle);
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

  test('Test 1', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const helper = new OrderHelper(page);
    await page.goto('http://94.74.82.109:3000/book/340716');
    await page.waitForLoadState('load');
    console.log("Test 1 is loaded");
  });

  test('API test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const helper = new OrderHelper(page);
    await page.goto('http://94.74.82.109:3000/book/340716');
    await page.waitForLoadState('load');
    console.log("Test 2 is loaded");
  });
});

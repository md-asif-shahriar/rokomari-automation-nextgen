import { test, expect, playwright } from '@playwright/test';
import OrderHelper from '../helper/OrderHelper';
import testData from '../data/testData';

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
  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Closing browser for: ${testInfo.title}`);
    await page.close();
    console.log('Browser closed after test');
  });

  // This runs after all tests in this describe block
  test.afterAll(async () => {
    console.log('✅ All tests done!');
  });

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

  test('API test', async ({ page }) => {
    const helper = new OrderHelper(page);
    await page.route('http://94.74.82.109:3000/ecom/api/product/269176', async (route) => {
      console.log('Intercepted API Request URL:', route.request().url());
      const response = await route.fetch({
        headers: {
          ...route.request().headers(),
          app_api_key: apiKey
        }
      });
      console.log('Intercepted API Response Status:', response.status());
      const data = await response.json();
      console.log('API Response:', data);
      console.log('📦 Original API Response:', JSON.stringify(data, null, 2));
      await route.fulfill({ response });
    });
    await page.goto('http://94.74.82.109:3000/book/340716');
    await page.waitForLoadState('load');
    await page.pause();
  });
});

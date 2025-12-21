import { test, expect } from '@playwright/test';
import OrderHelper from '../helpers/OrderHelper';
import testData from '../helpers/testData';
import log from '../../utils/logger';

// User credentials from environment variables
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const username = process.env.USERNM;

let paymentMethodCOD = testData.paymentMethod.cod;
let paymentMethodBkash = testData.paymentMethod.bkash;
let paymentMethodNagad = testData.paymentMethod.nagad;
let paymentMethodRocket = testData.paymentMethod.rocket;
let paymentMethodCard = testData.paymentMethod.card;

let searchKeyword = testData.searchKeyword;
let countryBD = testData.localAddress.countryBD;
let countryIndia = testData.localAddress.countryIndia;

let productTitle = testData.productTitle;

let searchKeywordEbook = testData.searchKeywordEbook;
let productTitleEbook = testData.productTitleEbook;

// Helper function for common order preparation steps
async function prepareOrder(helper, signIn = true, country = countryBD) {
  await helper.openHomePage();
  if (signIn) {
    await helper.signIn(email, password, 'home');
  }
  await helper.searchForABook(searchKeyword, productTitle);
  await helper.bookDetails();
  await helper.addToCart();
  await helper.goToCart();
  await helper.selectProduct();
  
  // Only select shipping address if signed in, as address selection requires login
  if (signIn) {
    await helper.selectShippingAddress(country);
  }
}

test.describe('Master Order Flow', () => {
  //test.describe.configure({ retries: 1 });

  let helper;

  test.beforeEach(async ({ page }, testInfo) => {
    log.info(`🚀 Starting test: ${testInfo.title}`);
    helper = new OrderHelper(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    log.info(`🏁 Finished test: ${testInfo.title} - Status: ${testInfo.status}`);
    
    // page is closed automatically by Playwright
  });

  

  test('Normal Order Flow (COD)', async ({ page }) => {
    await prepareOrder(helper, true, countryBD);
    await helper.proceedToCheckout();
    await helper.selectPaymentMethod(paymentMethodCOD);
    await helper.confirmOrder();
    await helper.confirmedOrderPageInfo();
    await helper.trackOrder();
    await helper.myOrder();
    await helper.cancelTestOrder();
  });

  test('Sign in after place order flow (COD)', async ({ page }) => {
    await prepareOrder(helper, false);
    
    // Proceed to checkout (will redirect to login)
    await helper.proceedToCheckout();
    await helper.signIn(email, password, 'cart');
    
    // After login, we might need to select product again if session didn't persist selection perfectly
    // or just proceed. Based on original test, it selects product again.
    await helper.selectProduct();
    await helper.selectShippingAddress(countryBD);
    await helper.proceedToCheckout();
    
    await helper.selectPaymentMethod(paymentMethodCOD);
    await helper.confirmOrder();
    await helper.confirmedOrderPageInfo();
    await helper.trackOrder();
    await helper.myOrder();
    await helper.cancelTestOrder();
  });

  test('Ebook order (Bkash)', async ({ page }) => {
    await helper.openHomePage();
    await helper.signIn(email, password, 'home');
    await helper.searchForABook(searchKeywordEbook, productTitleEbook);
    await helper.bookDetails();
    await helper.buyEbook();
    await helper.selectPaymentMethodForEbook(paymentMethodBkash);
    await helper.confirmOrderEbook();
    await helper.handleOnlinePaymentGateway();
    await helper.myOrder();
    await helper.cancelTestOrder();
  });

   test('Order as gift (Bkash)', async ({ page }) => {
    await prepareOrder(helper, true);
    await helper.orderAsGift();
    await helper.selectPaymentMethod(paymentMethodBkash);
    await helper.confirmOrder();
    await helper.handleOnlinePaymentGateway();
    await helper.myOrder();
    await helper.trackOrder();
    await helper.myOrder();
    await helper.cancelTestOrder();
    await page.pause();
  });

  test.skip('OG order (COD)', async ({ page }) => {
    await prepareOrder(helper, true);
    await helper.proceedToCheckout();
    await helper.selectPaymentMethod(paymentMethodBkash);
    await helper.confirmOrder();
    await helper.handleOnlinePaymentGateway();
    await helper.myOrder();
    await helper.trackOrder();
    await helper.cancelTestOrder();
  });

  test('Gift Voucher Order (Nagad)', async ({ page }) => {
    await helper.openHomePage();
    await helper.signIn(email, password, 'home');
    await helper.searchForABook('gift voucher', 'Rokomari Voucher');
    await helper.bookDetails('voucher');
    await helper.processGiftVoucherOrder('test@example.com', 'Test Recipient', 'Test gift voucher message');
    await helper.selectPaymentMethod(paymentMethodNagad);
    await helper.confirmOrder();
    await helper.handleOnlinePaymentGateway();
    await helper.myOrder();
    await helper.trackOrder();
    await helper.cancelTestOrder();
  });


  test('Abroad/Foreign order (Card)', async ({ page }) => {
    // Prepare order without signing in initially
    await prepareOrder(helper, false);
    await helper.proceedToCheckout();
    await helper.signIn(email, password, 'cart');
    await helper.selectProduct();
    await helper.selectShippingAddress(countryIndia);
    await helper.proceedToCheckout();
    await helper.selectPaymentMethod(paymentMethodCard);
    await helper.confirmOrder();
    await helper.handleOnlinePaymentGateway();
    await helper.myOrder();
    await helper.trackOrder();
    await helper.myOrder();
    await helper.cancelTestOrder();
    await page.pause();
  });

  test('Affiliate Order (Rocket)', async ({ page }) => {
    await prepareOrder(helper, true);
    await helper.proceedToCheckout();
    await helper.selectPaymentMethod(paymentMethodRocket);
    await helper.confirmOrder();
    await helper.confirmedOrderPageInfo();
    await helper.trackOrder();
    await helper.myOrder();
    await helper.cancelTestOrder();
  });

  test.only('Pre-order book (Rocket)', async ({ page }) => {
    await helper.openHomePage();
    await helper.signIn(email, password, 'home');

    // Pre-order specific flow
    await helper.preOrderFirstBook();

    // Rest of the flow is similar: select address, proceed, pay with Rocket
    await helper.selectShippingAddress(countryBD);
    await helper.proceedToCheckout();
    await helper.selectPaymentMethod(paymentMethodRocket);
    await page.pause();
    await helper.confirmOrder();
    await helper.confirmedOrderPageInfo();
    await helper.trackOrder();
    await helper.myOrder();
    await helper.cancelTestOrder();
  });

  test.skip('Affiliate order test', async ({ page }) => {
    // Note: openBookdetailswithAffiliateLink is not in current OrderHelper
    // Keeping skipped as requested to only refactor structure for now
    /*
    const helper = new OrderHelper(page);
    await helper.openBookdetailswithAffiliateLink(username, searchKeyword, productTitle);
    await helper.bookDetails();
    await helper.addToCart();
    await helper.goToCart();
    await helper.proceedToCheckout();
    await helper.signIn(email, password, 'cart');
    await helper.selectProduct(productId);
    await helper.selectShippingAddress(countryBD);
    await helper.proceedToCheckout();
    await helper.selectPaymentMethod(paymentMethodCOD);
    await helper.confirmOrder();
    await helper.confirmedOrderPageInfo();
    await helper.trackOrder();
    await helper.myOrder();
    */
  });

});

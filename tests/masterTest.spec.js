import { test, expect, playwright } from '@playwright/test';
import OrderHelper  from '../helper/OrderHelper';
import { openHomePage, signIn, addToCart } from './allTestMethods';

let browser;

// test.beforeAll(async () => {
//   // Setup code if needed (like initializing a browser or logging in)
//   console.log('Running before all tests');
//   browser = await playwright.chromium.launch({ headless: false });
// });

// test.afterAll(async () => {
//   // Cleanup code if needed
//   console.log('Running after all tests');
//   await browser.close();
// });

test.describe('Master Order Flow', () => {
  test('Normal Order Flow (COD)', async ({ page }) => {
    const helper = new OrderHelper(page);

    await helper.openHomePage();
    await page.pause();
    // await helper.signIn('user@example.com', 'password123', 'cart'); // Expecting to land on cart page
    // await helper.addToCart();
    // await helper.proceedToCheckout();
    // await helper.selectPaymentMethod('credit-card'); // Select Credit Card
    // await helper.confirmOrder();
    // await helper.confirmedOrderPage();
  });

  test.skip('Sign in after place order flow', async ({ page }) => {
    await openHomePage(page);
    await signIn(page, 'user@example.com', 'password123');
    await addToCart(page);
    // Add assertions or further test steps
  });
});

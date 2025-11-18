import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { SignInPage } from '../page-objects/SignInPage';
import testData from '../data/testData';
import { BookDetailsPage } from '../page-objects/BookDetailsPage';
import { SearchResultPage } from '../page-objects/SearchResultPage';
import { CartPage } from '../page-objects/CartPage';
import { PaymentPage } from '../page-objects/PaymentPage';
import { ConfirmedOrderPage } from '../page-objects/ConfirmedOrderPage';
import exp from 'constants';


test.beforeAll(async () => {
  // Setup: Launch the browser before all tests
  browser = await playwright.chromium.launch({ headless: false });  // Set headless to false for UI debug
});

test.afterAll(async () => {
  // Cleanup: Close the browser after all tests
  await browser.close();
});

test('Normal Order Flow (COD) - User Sign in through place order', async ({ page }) => {
  // Initialize page objects
  const homePage = new HomePage(page);
  
  await test.step('Open Home', async () => {
    console.log(`Logic goes here`);
  });
  await test.step('Sign in', async () => {
    console.log(`Logic goes here`);
  });
  await test.step('Product Search', async () => {
    console.log(`Logic goes here`);
  });
  await test.step('Go to details', async () => {
    console.log(`Logic goes here`);
  });
  await test.step('Add to cart', async () => {
    console.log(`Logic goes here`);
  });
  await test.step('Go to cart', async () => {
    console.log(`Logic goes here`);
  });
  await test.step('Place order', async () => {
    console.log(`Logic goes here`);
  });
  await test.step('Give payment', async () => {
    console.log(`Logic goes here`);
  });
});

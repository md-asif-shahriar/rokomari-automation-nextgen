import { test, expect } from '@playwright/test';
import { openHomePage, signIn, addToCart } from '../helpers/orderHelpers';

test.beforeAll(async () => {
  // Setup code if needed (like initializing a browser or logging in)
  console.log('Running before all tests');
  browser = await playwright.chromium.launch({ headless: false });
});

test.afterAll(async () => {
  // Cleanup code if needed
  console.log('Running after all tests');
    await browser.close();
});

test.describe('Master Order Flow', () => {
  
  test('Normal Order Flow (COD)', async ({ page }) => {
    await openHomePage(page);
    await signIn(page, 'user@example.com', 'password123');
    await addToCart(page);
    // Add assertions or further test steps
  });

  test('Foreign Order Flow', async ({ page }) => {
    await openHomePage(page);
    await signIn(page, 'user@example.com', 'password123');
    await addToCart(page);
    // Add assertions or further test steps
  });

});

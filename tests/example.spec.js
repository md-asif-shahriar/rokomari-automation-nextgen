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

test('Normal Order Flow (COD) - User Sign in through place order', async ({ page }) => {
  // Initialize page objects
  const homePage = new HomePage(page);
  const signInPage = new SignInPage(page);
  const searchResultPage = new SearchResultPage(page);
  const bookDetailsPage = new BookDetailsPage(page);
  const cartPage = new CartPage(page);
  const paymentPage = new PaymentPage(page);
  const confirmedOrderPage = new ConfirmedOrderPage(page);

  // Page titles
  const homePageTitle = testData.titles.homePage;
  const signInPageTitle = testData.titles.signInPage;
  const searchResultPageTitle = testData.titles.searchResultPage;

  // Page URL paths
  const homePagePath = testData.paths.homePage;

  // User credentials from environment variables
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  const username = process.env.USERNM;

  // Others
  const productId = testData.cartProductId;
  const productTitle = testData.productTitle;
  const localAddress = testData.localAddress;


  // Perform login steps
  
  await test.step('Sign in', async () => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.goto('/login');
    await signInPage.login(email, password);
    await expect(page).toHaveURL('/');
    await page.waitForLoadState('load');
    await page.goto('/cart');
    await page.waitForLoadState('load');
    await cartPage.selectProductById(productId);
    //await cartPage.selectAddress(localAddress);
    console.log(`Cart page payable total: ${await cartPage.getPayableTotal()}`);
    await cartPage.clickProceedToCheckout();
    await page.waitForLoadState('load');
    console.log(`Payment page payable total: ${await paymentPage.getPayableTotal()}`);
    console.log(`Payment page confirm order total: ${await paymentPage.getConfimmOrderButtonTotal()}`);
    await page.pause();
    //await page.pause();
    await page.close();
  });
  // await test.step('Sign in', async () => {
  //   await page.goto('/book/147520/ডাবল-স্ট্যান্ডার্ড');
  //   await page.waitForLoadState('load');
  //   console.log(`Title: ${await bookDetailsPage.getTitle()}`);
  //   console.log(`Book Title: ${await bookDetailsPage.getBookTitle()}`);
  //   console.log(`Author Name: ${await bookDetailsPage.getAuthorName()}`);
  //   await page.goto('/cart');
  //   await page.waitForLoadState('load');
  //   console.log(`Cart empty: ${await cartPage.isCartEmpty()}`);
  //   await page.pause();
  //   await page.close();
  //   //await page.pause();
  // });

  
});

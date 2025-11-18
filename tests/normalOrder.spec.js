import { test, expect } from '@playwright/test';
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
  const trackOrderPage = new TrackOrderPage(page);
  const myOrderPage = new MyOrderPage(page);

  // Page titles
  const homePageTitle = testData.titles.homePage;
  const signInPageTitle = testData.titles.signInPage;
  const searchResultPageTitle = testData.titles.searchResultPage;
  const bookDetailsPageTitle = testData.titles.bookDetailsPage;
  const cartPageTitle = testData.titles.cartPage;
  const paymentPageTitle = testData.titles.shippingPage;
  const confirmedOrderPageTitle = testData.titles.confirmedOrderPage;
  const trackOrderPageTitle = testData.titles.trackOrderPage;
  const myOrdersPageTitle = testData.titles.myOrdersPage;

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
  let expectedPayabaleTotal = '';
  let expectedOrderId = '';



  // Perform login steps
  await test.step('Open homepage', async () => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await expect.soft(page).toHaveTitle(homePageTitle);
    expect.soft(page.url()).toMatch(homePagePath);
    console.log('✅ Home page loads successfully');
    //await page.pause();
  });

  await test.step('Sign in', async () => {
    await page.goto('/login');
    await signInPage.login(email, password);
    await expect.soft(page).toHaveTitle(cartPageTitle);
    //expect(page.url()).toMatch(/\/cart/);
    //await page.pause();
  });

  await test.step('Search for a book', async () => {
    const searchKeyword = testData.searchKeyword;
    await homePage.search(searchKeyword);
    await expect.soft(page).toHaveTitle(searchResultPageTitle);
    //await page.pause();
  });

  await test.step('Search product and go to product details', async () => {
    const productLocator = await searchResultPage.isProductFound(productTitle);
    //expect(productLocator.trim().length).toBeGreaterThan(0);

    if (productLocator && (await productLocator.count()) > 0) {
      console.log(`✅ Search service is working properly. Product found: ${productTitle}`);
      await searchResultPage.goToProductDetails(productLocator);
      await expect.soft(page).toHaveTitle(bookDetailsPageTitle);
    } else {
      console.log(`❌ Product Not Found or search service is not working properly.`);
      return;
    }
    //await page.pause();
  });
  
  await test.step('Book details page', async () => {
    console.log(`Title: ${await bookDetailsPage.getTitle()}`);
    console.log(`Book Title: ${await bookDetailsPage.getBookTitle()}`);
    console.log(`Author Name: ${await bookDetailsPage.getAuthorName()}`);
    //await page.pause();
  });
  await test.step('Add to cart', async () => {
    await bookDetailsPage.clickAddToCart();
    //await page.pause();
  });
  

  await test.step('Go to cart', async () => {
    await bookDetailsPage.clickGoToCart();
    await expect.soft(page).toHaveTitle(cartPageTitle);
    //await page.pause();
  });

  await test.step('Select specific product', async () => {
    await cartPage.selectProductById(productId);
    //await page.pause();
  });

  await test.step('Select address', async () => {
    await cartPage.selectAddress(localAddress);
    //await page.pause();
  });

  await test.step('Proceed to checkout', async () => {
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeFalsy();
    expectedPayabaleTotal = await cartPage.getPayableTotal();
    console.log(`Payable Total in cart page: ${expectedPayabaleTotal}`);
    await cartPage.clickProceedToCheckout();
    await expect.soft(page).toHaveTitle(paymentPageTitle);
    //await page.pause();
  });

  await test.step('Choose payment method', async () => {
    const paymentMethod = 'COD';
    await paymentPage.selectPaymentMethod(paymentMethod);
    //await page.pause();
  });

  await test.step('Confirm order', async () => {
    const payableTotal = await paymentPage.getPayableTotal();
    const confirmOrderButtonTotal = await paymentPage.getConfimmOrderButtonTotal();
    console.log(`Payable Total before confirming order: ${payableTotal}`);
    expect(payableTotal, 'Payable total should be same in payment page').toBe(expectedPayabaleTotal);
    expect(confirmOrderButtonTotal, 'Confirm order button amount should be same in payment page').toBe(expectedPayabaleTotal);
    await paymentPage.confirmOrder();
    await page.waitForLoadState('load');
    await expect.soft(page).toHaveTitle(confirmedOrderPageTitle);
    //await page.pause();
  });


  await test.step('Check confirm order details', async () => {
    expectedOrderId = await confirmedOrderPage.getOrderNumber();
    const payableTotal = await confirmedOrderPage.getPayableTotal();
    console.log(`Payable Total in confirmed order page: ${payableTotal}`);
    expect(payableTotal, 'Payable total should be same in confirmed order page').toBe(expectedPayabaleTotal);
    console.log(`Expected Order ID: ${expectedOrderId}`);
    await confirmedOrderPage.clickTrackOrder();
    await page.waitForLoadState('load');
    await expect.soft(page).toHaveTitle(trackOrderPageTitle);
    await page.pause();
    await page.close();
  });
  await test.step.skip('Track Order', async () => {
    const orderNumber = await trackOrderPage.getOrderNumber();
    console.log(`Tracked Order Number: ${orderNumber}`);
    expect(orderNumber, 'Order number in track order page should match the confirmed order page').toBe(expectedOrderId);
    const payableTotal = await trackOrderPage.getPayableTotal();
    console.log(`Payable Total in track order page: ${payableTotal}`);
    //expect(payableTotal, 'Payable total should be same in track order page').toBe(expectedPayabaleTotal);
    await commonOptions.clickMyOrder();
    await page.waitForLoadState('load');
    await expect.soft(page).toHaveTitle(myOrderPageTitle);
    await page.pause();
  });

  await test.step.skip('My order', async () => {
    // const orderNumber = await myOrderPage.getOrderNumber();
    // console.log(`My Order Number: ${orderNumber}`);
    // expect(orderNumber, 'Order number in my order page should match the confirmed order page').toBe(expectedOrderId);
    // const payableTotal = await trackOrderPage.getPayableTotal();
    // console.log(`Payable Total in track order page: ${payableTotal}`);
    //expect(payableTotal, 'Payable total should be same in track order page').toBe(expectedPayabaleTotal);
    //await myOrderPage.openOrderDetails();
    await myOrderPage.clickTrackOrder();
    await page.waitForLoadState('load');
    await expect.soft(page).toHaveTitle(trackOrderPageTitle);
    await page.pause();
  });

});

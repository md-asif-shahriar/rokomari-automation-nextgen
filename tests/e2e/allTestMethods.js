export async function openHomePage(page) {
  console.log('➡ Opening home page');
  await page.goto('/');
  await page.waitForLoadState('load');
  await expect.soft(page).toHaveTitle(homePageTitle);
  expect.soft(page.url()).toMatch(homePagePath);
  console.log('✅ Home page loads successfully');
  //await page.pause();
}
export async function signIn(page, email, password, expectedPage) {
  console.log('➡ Go to sign in page and perform sign in');
  await page.goto('/login');
  await signInPage.login(email, password);
  await page.waitForLoadState('load');
  if (expectedPage === 'home') {
    await expect.soft(page).toHaveTitle(homePageTitle); 
  } else if (expectedPage === 'cart') {
    await expect.soft(page).toHaveTitle(cartPageTitle);
  }
  
  //expect(page.url()).toMatch(/\/cart/);
  //await page.pause();
}
export async function searchForABook(page, searchKeyword) {
    //const searchKeyword = testData.searchKeyword;
    console.log('➡ Searching for a book');
    await homePage.search(searchKeyword);
    await expect.soft(page).toHaveTitle(searchResultPageTitle);
    //await page.pause();
}
export async function goToBookDetails(page, productTitle) {

}
export async function verifyBookInfo(page) {}
export async function addToCart(page) {}
export async function goToCart(page) {}
export async function selectProduct(page) {}
export async function selectAddress(page) {}
export async function proceedToCheckout(page) {}
export async function selectPaymentMethod(page) {}
export async function confirmOrder(page) {}
export async function confirmedOrderPage(page) {}
export async function goToTrackOrder(page) {}
export async function trackOrderPage(page) {}
export async function goToMyOrder(page) {}
export async function myOrderPage(page) {}
export async function cancelTestOrder(page) {}

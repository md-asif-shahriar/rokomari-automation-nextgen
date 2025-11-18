import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { SearchResultPage } from '../page-objects/SearchResultPage';
import testData from '../data/testData';


test('Log in test', async ({ page }) => {
    // Initialize page objects
    const homePage = new HomePage(page);
    const searchResultPage = new SearchResultPage(page);

    // Page titles
    const homePageTitle = testData.titles.homePage;
    const searchResultPageTitle = testData.titles.searchResultPage;
    const bookDetailsPageTitle = testData.titles.bookDetailsPage;

     // Others
    let productId;
    let productTitle;

    await test.step('Open homepage', async () => {
      await homePage.visit();
      await expect.soft(page).toHaveTitle(homePageTitle);
      console.log('✅ Home page loads successfully');
    });
    
     await test.step('Search for a book', async () => {
      const searchKeyword = testData.searchKeyword;
      await homePage.search(searchKeyword);
      await expect.soft(page).toHaveTitle(searchResultPageTitle);
      console.log('✅ Search result shows successfully');
      await page.pause();
    });

    await test.step('Verify if the searched product is found', async () => {
      productTitle = testData.productTitle;
      const { found, product } = await searchResultPage.isProductFound(productTitle);
      if (!found) {
        console.log(`❌ ${productTitle} - not found in search results`);
        return;
      }
      console.log(`✅ ${productTitle} - not found in search results`);
      console.log("✅ Product: ", product);  
      await page.pause();
    });

    await test.step('Open the book details page', async () => {
      page = await searchResultPage.goToProductDetails2();
      await expect.soft(page).toHaveTitle(bookDetailsPageTitle);
      console.log('✅ Book details page loaded successfully');
      await page.pause();
    });
});

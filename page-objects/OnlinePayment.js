export async function sslPage(page, expectedDomain, pageTitle, myOrderPagePath, expectedPayableTotal) {
  const currentUrl = await page.url();
  const currentDomain = new URL(currentUrl).origin;
  expect.soft(currentDomain, 'Should navigate to SSLCommerz payment gateway').toBe(expectedDomain);
  let tapImage = page.locator('#tapImg');
  await tapImage.waitFor({ state: 'visible', timeout: 9000 });
  expect.soft(page).toHaveTitle(pageTitle);
  let amount = await page.locator('.loading-btn__text span').innerText();
  let numericAmount = parseFloat(amount);
  let formattedAmount = `৳${numericAmount.toFixed(0)}`;
  await expect.soft(formattedAmount, 'Payable total should match on BKash page').toBe(expectedPayableTotal);
  await page.goTo(myOrderPagePath);
}

export async function nagadPage(page, expectedDomain, bkashPageTitle, myOrderPagePath, expectedPayableTotal) {
  console.log(`Handling online payment gateway for method: ${paymentMethod}`);
}

export async function rocketPage(paymentMethod) {
  console.log(`Handling online payment gateway for method: ${paymentMethod}`);
}

export async function bkashPage(page, expectedDomain, pageTitle, myOrderPagePath, expectedPayableTotal) {
  const currentUrl = await page.url();
  const currentDomain = new URL(currentUrl).origin;
  expect.soft(currentDomain, 'Should navigate to bkash payment gateway').toBe(expectedDomain);
  let tapImage = page.locator('.footer__copyright');
  await tapImage.waitFor({ state: 'visible', timeout: 9000 });
  expect.soft(page).toHaveTitle(pageTitle);
  let amount = await page.locator('.loading-btn__text span').innerText();
  let numericAmount = parseFloat(amount);
  let formattedAmount = `৳${numericAmount.toFixed(0)}`;
  await expect.soft(formattedAmount, 'Payable total should match on BKash page').toBe(expectedPayableTotal);
  await page.goTo(myOrderPagePath);
}

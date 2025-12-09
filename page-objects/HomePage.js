import { expect } from '@playwright/test';
import log from '../utils/logger.js';

export class HomePage {
  constructor(page) {
    this.page = page;
  }

  get signInButton() {
    return this.page.getByRole('link', { name: 'Sign In' });
  }

  get username() {
    return this.page.locator(`xpath=//*[contains(@class, 'userContainer')]//span`);
  }

  get searchField() {
    return this.page.locator('input[placeholder^="Search by"]');
  }

  async visit() {
    log.info('Visiting Rokomari homepage...');
    await this.page.goto('/');
    await this.page.waitForLoadState('load');
  }

  async getTitle() {
      return await this.page.title();
  }

  async getUrlPath() {
    //await expect.soft(this.page).toHaveURL('/');
    const fullUrl = this.page.url();  // Get the full URL of the page
    const url = new URL(fullUrl);  // Parse the full URL
    // Get the path excluding query parameters and fragments
    const exactPath = url.pathname.split('/')[1] ? `/${url.pathname.split('/')[1]}` : '/';
    log.info(`Homepage path: ${exactPath}`);
    return exactPath;
  }

  async gotoLogin() {
    try {
      //await this.page.locator('.modal_modal__RCZrz > .absolute').click();
      await this.signInButton.click();
      await this.page.waitForLoadState('load')
    } catch (error) {
      log.warn("Using direct URL to login....");
      await this.page.goto('/login');
      await this.page.waitForLoadState('load')
    }
    
  }

  async getUserName() {
        await this.username.waitFor({ state: 'visible' });
        const fullText =  await this.username.innerText();
        return await fullText.split(',')[1].trim();
    }

    async search(keyword) {
        await this.searchField.waitFor();
        await this.searchField.fill(keyword);
        await this.searchField.press('Enter');
        await this.page.waitForLoadState('load');
    }

  }
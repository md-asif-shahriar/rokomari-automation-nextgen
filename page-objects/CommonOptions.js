import { expect } from '@playwright/test';
import log from '../utils/logger.js';

export class CommonOptions {
    constructor(page){
        this.page = page;
    }

    get cartIcon() {
        return this.page.locator(`xpath=//*[contains(@class, 'navigation') and contains(@class, 'cartContainer')]`);
    }

    get signInButton() {
        //this.signInButton = page.locator('a[href="/login"]'); navigation-module-scss-module__FAVpgG__SignIn
        return this.page.locator(`xpath=//*[contains(@class, 'navigation') and contains(@class, 'SignIn')]`);
    }

    get userName() {
        return this.page.locator(`xpath=//*[contains(@class, 'navigation') and contains(@class, 'userContainer')]//span`);
    }

    get mySectionDropDownMenu() {
        return this.page.locator(`xpath=//*[contains(@class, 'navigation') and contains(@class, 'dropdownContainer')]`);
    }

    get mySectionDropDownContainer() {
        return this.page.locator(`.js--user-menu`);
    }

    get myOrderMenu() {
        return this.page.locator('a[href="/my-section/orders"]').nth(1);
    }

    async isSignInButtonPresent() {
        return await this.signInButton.isVisible();
    }

    async clickSignIn() {
        await expect(this.signInButton, 'Sign In button is visible').toBeVisible();
        await this.signInButton.click();
    }
    async goToCartPage() {
        await this.cartIcon.click();
        await this.page.waitForLoadState('load');
        log.success('✅ Navigated to Cart page');
    }

    async getUserName() {
        const name = await this.userName.innerText();
        log.info(`✅ Logged in user name: ${name}`);
        return name;
    }
    async goToMyOrder() {
        await this.mySectionDropDownMenu.click();
        await expect(this.mySectionDropDownContainer, 'Opening my section dropdown menu').toBeVisible();
        await this.myOrderMenu.click();
        log.success('✅ Navigated to My Order page');
    }

}
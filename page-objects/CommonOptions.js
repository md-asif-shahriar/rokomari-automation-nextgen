import { expect } from '@playwright/test';
export class CommonOptions {
    constructor(page){
        this.page = page;
        this.cartIcon = page.locator(`xpath=//*[contains(@class, 'navigation') and contains(@class, 'cartContainer')]`);
        this.signInButton = page.locator('a[href="/login"]');
        this.userName = page.locator(`xpath=//*[contains(@class, 'navigation') and contains(@class, 'userContainer')]//span`);
        this.mySectionDropDownMenu = page.locator(`xpath=//*[contains(@class, 'navigation') and contains(@class, 'dropdownContainer')]`);
        this.mySectionDropDownContainer = page.locator(`.js--user-menu`);
        this.myOrderMenu = page.locator('a[href="/my-section/orders"]');
    }

    async goToCartPage() {
        await this.cartIcon.click();
        await this.page.waitForLoadState('load');
        console.log('✅ Navigated to Cart page');
    }

    async getUserName() {
        const name = await this.userName.innerText();
        console.log(`✅ Logged in user name: ${name}`);
        return name;
    }
    async goToMyOrder() {
        await this.mySectionDropDownMenu.click();
        await expect(this.mySectionDropDownContainer, 'Opening my section dropdown menu').toBeVisible();
        await this.myOrderMenu.click();
        console.log('✅ Navigated to My Order page');
    }
}
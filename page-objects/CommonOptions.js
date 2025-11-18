import { expect } from '@playwright/test';
export class CommonOptions {
    constructor(page){
        this.page = page;
        this.cartIcon = page.locator(`xpath=//*[contains(@class, 'navigation') and contains(@class, 'cartContainer')]`);
        this.userName = page.locator(`xpath=//*[contains(@class, 'navigation') and contains(@class, 'userContainer')]//span`);
    }

    async goToCartPage() {
        await this.cartIcon.click();
        await this.page.waitForLoadState('load');
        console.log('✅ Navigated to Cart page');
    }
}
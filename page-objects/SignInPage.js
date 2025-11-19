import { expect } from '@playwright/test';
export class SignInPage {
    constructor(page) {
        this.page = page;
        this.emailField = page.locator("#emailOrPhone").first();
        this.passwordField = page.locator("#password").first();
        this.nextButton = page.getByRole("button", { name: "পরবর্তী" });
        this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
      }

     async visit() {
        await this.page.goto('/login');
        await this.page.waitForLoadState('load');
    }

    async getTitle() {
        return await this.page.title();
    }

    async login(email, password) {
        await this.page.waitForLoadState('load');
        await this.emailField.fill(email);
        await this.page.waitForTimeout(1000);
        await this.nextButton.click();
        await this.passwordField.waitFor({ state: 'visible' });
        await this.passwordField.fill(password);
        await this.loginButton.waitFor({ state: 'visible' });
        await this.loginButton.click();
    }

    async signInWithGoogle() {
        console.log('Signing in with Google account...');
    }
    async signInWithFacebook() {
        console.log('Signing in with Facebook account...');
    }

}
import { expect } from '@playwright/test';
import log from '../utils/logger.js';

export class SignInPage {
  constructor(page) {
    this.page = page;
  }

  get emailField() {
    return this.page.locator('#emailOrPhone').first();
  }
  get passwordField() {
    return this.page.locator('#password').first();
  }
  get nextButton() {
    return this.page.getByRole('button', { name: 'পরবর্তী' });
  }
  get loginButton() {
    return this.page.getByRole('button', { name: 'Login', exact: true });
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
    log.info(`Log in with email and password`);
    await this.emailField.fill(email);
    await this.page.waitForTimeout(1000);
    await this.nextButton.click();
    await this.passwordField.waitFor({ state: 'visible' });
    await this.passwordField.fill(password);
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
  }

  async signInWithGoogle() {
    log.info('Signing in with Google account...');
  }
  async signInWithFacebook() {
    log.info('Signing in with Facebook account...');
  }
}

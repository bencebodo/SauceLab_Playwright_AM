import {type Page, type Locator} from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage_Container: Locator;
    readonly errorMassage_CloseButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.errorMessage_Container = page.getByTestId('error');
        this.errorMassage_CloseButton = page.getByTestId('error-button');
    }
    async enterUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }
    async enterPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async clickLoginButton(): Promise<void> {
        await this.loginButton.click();
    }

    async clickErrorMessageCloseButton(): Promise<void> {
        await this.errorMassage_CloseButton.click();
    }

    async getLoginErrorMessage(): Promise<string | null> {
        return await this.errorMessage_Container.textContent();
    }
}
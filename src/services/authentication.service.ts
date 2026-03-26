import {LoginPage} from '../pages/login.page';

export class UiAuthenticationService {
    private loginPage: LoginPage;

    constructor(loginPage: LoginPage) {
        this.loginPage = loginPage;
    }

    async performLogin(username: string, password: string): Promise<void> {
        await this.loginPage.enterUsername(username);
        await this.loginPage.enterPassword(password);
        await this.loginPage.clickLoginButton();
    }

    async closeLoginErrorMessage(): Promise<void> {
        await this.loginPage.clickErrorMessageCloseButton();
    }

    async getLoginErrorMessage(): Promise<string | null> {
        return await this.loginPage.getLoginErrorMessage();
    }
}
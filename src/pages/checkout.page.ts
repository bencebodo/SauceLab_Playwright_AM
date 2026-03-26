import {type Page, Locator} from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('#first-name');
        this.lastNameInput = page.locator('#last-name');
        this.postalCodeInput = page.locator('#postal-code');
        this.continueButton = page.locator('#continue');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async enterFirsName(firstName: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
    }

    async enterLastName(lastName: string): Promise<void> {
        await this.lastNameInput.fill(lastName);
    }

    async enterPostalCode(postalCode: string): Promise<void> {
        await this.postalCodeInput.fill(postalCode);
    }

    async clickContinueButton(): Promise<void> {
        await this.continueButton.click();
    }
}
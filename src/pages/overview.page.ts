import { type Page, type Locator } from '@playwright/test';

export class OverviewPage {
    readonly page: Page;
    readonly subtotalLabel: Locator;
    readonly finishButton: Locator;
    readonly backHomeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.subtotalLabel = page.getByTestId('subtotal-label');
        this.finishButton = page.getByTestId('finish');
        this.backHomeButton = page.getByTestId('back-to-products');
    }

    async clickOnFinishButton(): Promise<void> {
        await this.finishButton.click();
    }

    async getSubtotal(): Promise<string | null> {
        return await this.subtotalLabel.textContent();
    
    }

    async clickOnBackHomeButton(): Promise<void> {
        await this.backHomeButton.click();
    }
}
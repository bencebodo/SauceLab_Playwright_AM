import { type Page, type Locator } from "@playwright/test";

export class ThankYouPage {
    readonly page: Page
    readonly succesfulOrderImg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.succesfulOrderImg = page.getByTestId('pony-express');
    }
}
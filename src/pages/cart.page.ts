import { type Page, type Locator } from '@playwright/test';
import { ProductComponent } from '../components/product.component';

export class CartPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;
    readonly resetAppStateButton: Locator;
    readonly burgerMenuButton: Locator;
    readonly cartCounter: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('.cart_item');
        this.continueShoppingButton = page.locator('#continue-shopping');
        this.checkoutButton = page.locator('#checkout');
        this.resetAppStateButton = page.locator('#reset_sidebar_link');
        this.burgerMenuButton = page.locator('#react-burger-menu-btn');
        this.cartCounter = page.locator('.shopping_cart_badge');
    }

    async getProductByName(productName: string): Promise<ProductComponent> {
        const productElement = this.cartItems.filter({ hasText: productName }).first();
        return new ProductComponent(productElement);
    }

    async getAllProductsInCart(): Promise<ProductComponent[]> {
        const productElements = await this.cartItems.all();
        return productElements.map(item => new ProductComponent(item));
    }

    async clickContinueShoppingButton(): Promise<void> {
        await this.continueShoppingButton.click();
    }

    async clickCheckoutButton(): Promise<void> {
        await this.checkoutButton.click();
    }

    async clickResetAppStateButton(): Promise<void> {
        await this.resetAppStateButton.click();
    }

    async clickBurgerMenuButton(): Promise<void> {
        await this.burgerMenuButton.click();
    }
}
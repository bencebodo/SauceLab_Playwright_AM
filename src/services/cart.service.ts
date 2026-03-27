import { ProductComponent } from '../components/product.component';
import { CartPage } from '../pages/cart.page';
import { ProductDetails } from '../domain/models/product-details.model';
import { Locator } from 'playwright-core';

export class UiCartService {
    private cartPage: CartPage;

    constructor(cartPage: CartPage) {
        this.cartPage = cartPage;
    }

    async removeProductFromCart(productName: string): Promise<void> {
        const product = await this.cartPage.getProductByName(productName);
        await product.removeFromCart();
    }

    async getProductDescriptionByName(productName: string): Promise<string | null> {
        const product = await this.cartPage.getProductByName(productName);
        return await product.descElement.textContent();
    }

    async getProductPriceByName(productName: string): Promise<number | null> {
        const product = await this.cartPage.getProductByName(productName);
        return await product.priceElement.textContent() ? parseFloat((await product.priceElement.textContent())!.replace('$', '')) : null;
    }

    async getAllProductsInCart(): Promise<ProductComponent[]> {
        return await this.cartPage.getAllProductsInCart();
    }

    async goToCheckout(): Promise<void> {
        await this.cartPage.clickCheckoutButton();
    }

    async resetAppState(): Promise<void> {
        await this.cartPage.clickBurgerMenuButton();
        await this.cartPage.clickResetAppStateButton();
    }

    async returnToShopping(): Promise<void> {
        await this.cartPage.clickContinueShoppingButton();
    }

    async getCartCounter(): Promise<Locator> {
        return await this.cartPage.cartCounter;
    }

    async getProductDetailsByName(productName: string): Promise<ProductDetails> {
        const product = await this.cartPage.getProductByName(productName);

        return await product.getProductDetails();
    }
}
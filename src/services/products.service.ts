import { Locator } from "@playwright/test";
import { ProductComponent } from "../components/product.component";
import { ProductDetails } from "../domain/models/product-details.model";
import { ProductsPage } from "../pages/products.page";

export class UiProductsService {
    private productsPage: ProductsPage;

    constructor(productsPage: ProductsPage) {
        this.productsPage = productsPage;
    }

    async goToCart(): Promise<void> {
        await this.productsPage.clickOnCartLink();
    }

    async selectSortingByPriceLowToHigh(): Promise<void> {
        await this.productsPage.sortByPrice();
    }

    async getCartCounter(): Promise<Locator> {
        return await this.productsPage.cartCounter;
    }

    async addProductToCart(productName: string): Promise<void> {
        const product = await this.productsPage.getProductByName(productName);
        await product.addToCart();
    }

    async removeProductFromCart(productName: string): Promise<void> {
        const product = await this.productsPage.getProductByName(productName);
        await product.removeFromCart();
    }

    async getProductsDescriptionByName(productName: string): Promise<string | null> {
        const product = await this.productsPage.getProductByName(productName);
        return await product.descElement.textContent();
    }

    async getProductsPriceByName(productName: string): Promise<number | null> {
        const product = await this.productsPage.getProductByName(productName);
        return await product.priceElement.textContent() ? parseFloat((await product.priceElement.textContent())!.replace('$', '')) : null;
    }

    async isProductAddedToCart(productName: string): Promise<boolean> {
        const product = await this.productsPage.getProductByName(productName);
        return await product.isAddedToCart();
    }

    async getAllProducts(): Promise<ProductComponent[]> {
        return await this.productsPage.getallProducts();
    }

    async getProductDetailsByName(productName: string): Promise<ProductDetails> {
        const product = await this.productsPage.getProductByName(productName);

        return await product.getProductDetails();
    }
}
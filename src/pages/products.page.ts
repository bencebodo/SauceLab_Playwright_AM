import { type Page, type Locator } from '@playwright/test';
import { ProductComponent } from '../components/product.component';

export class ProductsPage {
    readonly page: Page;
    readonly cartCounter: Locator;
    readonly productSortingContainer: Locator;
    readonly cartLink: Locator;
    readonly invenoryItems: Locator;
    readonly inventoryContainerItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartCounter = page.getByTestId('shopping-cart-badge');
        this.productSortingContainer = page.getByTestId('product-sort-container');
        this.cartLink = page.getByTestId('shopping-cart-link');
        this.invenoryItems = page.locator('.inventory_item');
        this.inventoryContainerItems = page.locator('#inventory_container');
    }

    async getProductByName(productName: string): Promise<ProductComponent> {
        const productElement = this.invenoryItems.filter({ hasText: productName }).first();
        return new ProductComponent(productElement);
    }

    async getallProducts(): Promise<ProductComponent[]> {
        const productElements = await this.invenoryItems.all();
        return productElements.map(item => new ProductComponent(item));
    }

    async sortByPrice(): Promise<void> {
        await this.productSortingContainer.selectOption('lohi');
    }

    async clickOnCartLink(): Promise<void> {
        await this.cartLink.click();
    }
}
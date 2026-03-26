import {test as base} from '@playwright/test';
import {LoginPage} from '../../pages/login.page';
import {ProductsPage} from '../../pages/products.page';
import { CartPage } from '../../pages/cart.page';
import {CheckoutPage} from '../../pages/checkout.page';
import {OverviewPage} from '../../pages/overview.page';
import {ThankYouPage} from '../../pages/thank-you.page';
import {UiAuthenticationService} from '../../services/authentication.service';
import {UiProductsService} from '../../services/products.service';
import {UiCheckoutService} from '../../services/checkout.service';
import { UiCartService } from '../../services/cart.service';

type MyFixtures = {
    loginPage: LoginPage;
    productsPage: ProductsPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    overviewPage: OverviewPage;
    thankYouPage: ThankYouPage;
    uiAuthenticationService: UiAuthenticationService;
    uiProductsService: UiProductsService;
    uiCheckoutService: UiCheckoutService;
    uiCartService: UiCartService;
};

export const test = base.extend<MyFixtures>({
    loginPage: async ({page}, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    productsPage: async ({page}, use) => {
        const productsPage = new ProductsPage(page);
        await use(productsPage);
    },
    cartPage: async ({page}, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },
    checkoutPage: async ({page}, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },
    overviewPage: async ({page}, use) => {
        const overviewPage = new OverviewPage(page);
        await use(overviewPage);
    },
    thankYouPage: async ({page}, use) => {
        const thankYouPage = new ThankYouPage(page);
        await use(thankYouPage);
    },
    uiAuthenticationService: async ({loginPage}, use) => {
        const uiAuthenticationService = new UiAuthenticationService(loginPage);
        await use(uiAuthenticationService);
    },
    uiProductsService: async ({productsPage}, use) => {
        const uiProductsService = new UiProductsService(productsPage);
        await use(uiProductsService);
    },
    uiCheckoutService: async ({checkoutPage, overviewPage, thankYouPage}, use) => {
        const uiCheckoutService = new UiCheckoutService(checkoutPage, overviewPage, thankYouPage);
        await use(uiCheckoutService);
    },
    uiCartService: async ({cartPage}, use) => {
        const uiCartService = new UiCartService(cartPage);
        await use(uiCartService);
    }
});

export {expect} from '@playwright/test';

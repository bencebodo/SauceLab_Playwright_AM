import { test, expect } from './fixtures/fixtures';
import { APP_CONFIG } from '../utils/constants';
import { CheckoutDetails } from '../domain/models/checkout-details.model';

let testIndex: number | null = 0;

test.beforeEach(async ({ page, uiAuthenticationService }) => {
    await page.goto(APP_CONFIG.baseurl);
    await uiAuthenticationService.performLogin(APP_CONFIG.userCredentials.standardUser, APP_CONFIG.userCredentials.password);
});

const checkoutTestData: CheckoutDetails[] = [
    { firstName: 'John', lastName: 'Doe', postalCode: '12345', shouldPass: true },
    { firstName: '!.*', lastName: '3:a8', postalCode: '?()ZIP2', shouldPass: true },
    { firstName: `<script>alert('XSS Teszt')</script>`, lastName: `<script>alert('XSS Teszt')</script>`, postalCode: `<script>alert('XSS Teszt')</script>`, shouldPass: true },
    { firstName: '', lastName: '', postalCode: '', shouldPass: false },
    { firstName: 'John', lastName: 'Doe', postalCode: '', shouldPass: false },
    { firstName: 'John', lastName: '', postalCode: '12345', shouldPass: false },
    { firstName: '', lastName: 'Doe', postalCode: '12345', shouldPass: false }
];

test.describe('Termék hozzáadása a kosárhoz, különböző vásárlói adatok kitöltése', () => {
    for (const checkoutData of checkoutTestData) {
        test(`Egy termék hozzáadása a kosárhoz, vásárló adatok kitöltése: ${checkoutData.firstName} ${checkoutData.lastName} ${checkoutData.postalCode}`, { tag: `@SD-CHECKOUT-VALIDATION-${testIndex!++}` },
            async ({page, uiProductsService, uiCartService, uiCheckoutService }) => {
                const productName = "Test.allTheThings() T-Shirt (Red)";
                let alertTriggered = false;

                page.on('dialog', async dialog => {
                    alertTriggered = true;
                    await dialog.dismiss();
                });

                await test.step(`Termék hozzáadása a kosárhoz: ${productName}`, async () => {
                    await uiProductsService.addProductToCart(productName);
                });

                await test.step('Tovább a kosárhoz, majd a checkout oldalra', async () => {
                    await uiProductsService.goToCart();
                    await uiCartService.goToCheckout();
                });

                await test.step(`Vásárlói adatok kitöltése [Keresztnév: ${checkoutData.firstName}, Vezetéknév: ${checkoutData.lastName}, Irányítószám: ${checkoutData.postalCode}] és vásárlás véglegesítése`, async () => {
                    await uiCheckoutService.fillInCheckoutInformation(checkoutData.firstName!, checkoutData.lastName!, checkoutData.postalCode!);
                    await uiCheckoutService.continueToOverview();

                    if (checkoutData.shouldPass) {
                        expect(alertTriggered).toBeFalsy();
                        expect(await uiCheckoutService.isOverviewPageDisplayed()).toBeTruthy();

                        await uiCheckoutService.finishOrder();
                        await expect(await uiCheckoutService.succesfulOrderImg()).toBeVisible();
                    } else {
                        expect(await uiCheckoutService.isErrorMessageDisplayed()).toBeTruthy();
                    }
                });
            });
    }
});
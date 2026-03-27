import { test, expect } from './fixtures/fixtures';
import { APP_CONFIG } from '../utils/constants';
import { ProductDetails } from '../domain/models/product-details.model';

let testIndex: number | null = 0;

test.beforeEach(async ({ page, uiAuthenticationService }) => {
  await page.goto(APP_CONFIG.baseurl);
  await uiAuthenticationService.performLogin(APP_CONFIG.userCredentials.standardUser, APP_CONFIG.userCredentials.password);
});


const productTestData = [
  "Test.allTheThings() T-Shirt (Red)",
  "Sauce Labs Fleece Jacket",
  "Sauce Labs Bike Light"
]

for (const productName of productTestData) {
  test.describe(`Vásárlás teljes folyamata a következő termékre: ${productName}`, () => {
    test(`Termék hozzáadása a kosárhoz, ellenőrzés, majd eltávolítás és visszatérés a vásárláshoz: ${productName}`, { tag: [`@SD-FLOW-${testIndex!++}`, `@PRODUCT-${productName}`] },
      async ({ uiProductsService, uiCartService }) => {
        let productDetails: ProductDetails;
        await test.step(`Termék adatainak lekérése a termékoldalon: ${productName}`, async () => {

          productDetails = {
            price: await uiProductsService.getProductsPriceByName(productName),
            description: await uiProductsService.getProductsDescriptionByName(productName)
          };

          await expect(await uiProductsService.getCartCounter()).toBeHidden();

          return productDetails;
        });

        await test.step(`Termék hozzáadása a kosárhoz: ${productName} és kosár számláló ellenőrzése`, async () => {
          await uiProductsService.addProductToCart(productName);
          await expect(await uiProductsService.getCartCounter()).toHaveText('1');
        });

        await test.step(`Tovább a kosárhoz, termék adatainak ellenőrzése: ${productName}`, async () => {
          await uiProductsService.goToCart();
          const cartProductPrice = await uiCartService.getProductPriceByName(productName);
          const cartProductDescription = await uiCartService.getProductDescriptionByName(productName);

          expect(cartProductPrice).toBe(productDetails.price);
          expect(cartProductDescription).toBe(productDetails.description);
        });

        await test.step(`Termék eltávolítása a kosárból: ${productName}, kosár számláló ellenőrzése, majd visszatérés a vásárláshoz`, async () => {
          await uiCartService.removeProductFromCart(productName);
          await expect(await uiProductsService.getCartCounter()).toBeHidden();

          await uiCartService.returnToShopping();
        });
      })

    test(`Termék hozzáadása a kosárhoz, vásárló adatok kitöltése, vásárlás véglegesítése: ${productName}`, { tag: [`@SD-FLOW-${testIndex!++}`, `@PRODUCT-${productName}`] },
      async ({ uiProductsService, uiCartService, uiCheckoutService }) => {
        let productDetails: ProductDetails;
        await test.step(`Termék hozzáadása a kosárhoz: ${productName} és kosár számláló ellenőrzése`, async () => {
          productDetails = {
            price: await uiProductsService.getProductsPriceByName(productName),
            description: await uiProductsService.getProductsDescriptionByName(productName)
          };
          await uiProductsService.addProductToCart(productName);
        });

        await test.step('Tovább a kosárhoz, majd a checkout oldalra', async () => {
          await uiProductsService.goToCart();
          await uiCartService.goToCheckout();
        });

        await test.step(`Vásárlói adatok kitöltése [Keresztnév: John, Vezetéknév: Doe, Irányítószám: 12345] és vásárlás véglegesítése`, async () => {
          await uiCheckoutService.fillInCheckoutInformation('John', 'Doe', '12345');
          await uiCheckoutService.continueToOverview();

          expect(await uiCheckoutService.getSubtotal()).toBe(productDetails.price);

          await uiCheckoutService.finishOrder();
          await expect(await uiCheckoutService.succesfulOrderImg()).toBeVisible();
        });
      })
    test(`Egy termék hozzáadása a kosárhoz, vásárló adatok kitöltése, vásárlás véglegesítése, majd visszatérés a vásárláshoz`, { tag: [`@SD-FLOW-${testIndex!++}`, `@PRODUCT-${productName}`] },
      async ({ uiProductsService, uiCartService, uiCheckoutService }) => {

        await test.step(`Termék hozzáadása a kosárhoz: ${productName}, majd a Checkout oldalra lépés`, async () => {
          await uiProductsService.addProductToCart(productName);
          await uiProductsService.goToCart();
          await uiCartService.goToCheckout();
        });

        await test.step(`Vásárlói adatok kitöltése [Keresztnév: John, Vezetéknév: Doe, Irányítószám: 12345], vásárlás véglegesítése, majd visszatérés a vásárláshoz`, async () => {
          await uiCheckoutService.fillInCheckoutInformation('John', 'Doe', '12345');
          await uiCheckoutService.continueToOverview();
          await uiCheckoutService.finishOrder();

          await expect(await uiCheckoutService.succesfulOrderImg()).toBeVisible();
        });

        await test.step('Visszatérés a vásárláshoz, és a kosár állapotának ellenőrzése', async () => {
          await uiCheckoutService.clickOnBackHomeButton();

          expect(await uiProductsService.isProductAddedToCart(productName)).toBeFalsy();
          await expect(await uiProductsService.getCartCounter()).toBeHidden();
        });

        await test.step('Termék ismételt kosárba helyezése', async () => {
          await uiProductsService.addProductToCart(productName);

          expect(await uiProductsService.isProductAddedToCart(productName)).toBeTruthy();
          expect(await uiProductsService.getCartCounter()).toHaveText('1');
        });
      })
  })
};

test.describe('Vásárlás teljes folyamata több termékre', () => {
  const twoProducts = productTestData.slice(0, 2);
  const threeProducts = productTestData.slice(0, 3);
  const selectedProducts = [twoProducts, threeProducts];
  for (const products of selectedProducts) {
    test(`Több termék hozzáadása a kosárhoz, vásárló adatok kitöltése, vásárlás véglegesítése: ${products.join(', ')}`, { tag: [`@SD-FLOW-${testIndex!++}`, `@PRODUCT-${products.join(', ')}`] },
      async ({ uiProductsService, uiCartService, uiCheckoutService }) => {
        let totalPrice = 0;

        await test.step(`Több termék hozzáadása a kosárhoz: ${products.join(', ')} és kosár számláló ellenőrzése`, async () => {
          for (const productName of products) {
            await uiProductsService.addProductToCart(productName);
            const productPrice = await uiProductsService.getProductsPriceByName(productName);
            totalPrice += productPrice!;
          }
        });

        await test.step('Tovább a kosárhoz, majd a checkout oldalra', async () => {
          await uiProductsService.goToCart();
          const allProductsInCart = await uiCartService.getAllProductsInCart();

          expect(allProductsInCart.length).toBe(products.length);

          await uiCartService.goToCheckout();
        });

        await test.step(`Vásárlói adatok kitöltése [Keresztnév: John, Vezetéknév: Doe, Irányítószám: 12345] és vásárlás véglegesítése`, async () => {
          await uiCheckoutService.fillInCheckoutInformation('John', 'Doe', '12345');
          await uiCheckoutService.continueToOverview();

          expect(await uiCheckoutService.getSubtotal()).toBe(totalPrice);

          await uiCheckoutService.finishOrder();
          await expect(await uiCheckoutService.succesfulOrderImg()).toBeVisible();
        });
      });
  };
  
  test('Egy termék hozzáadása a kosárhoz, visszatérés a Főoldalra egy másik termék kiválasztása és a vásárlás véglegesítése', { tag: [`@SD-FLOW-${testIndex!++}`, `@PRODUCT-${twoProducts[0]}`, `@PRODUCT-${twoProducts[1]}`] },
    async ({ uiProductsService, uiCartService, uiCheckoutService }) => {
      await test.step(`Első termék hozzáadása a kosárhoz: ${twoProducts[0]} és kosár megnyitása`, async () => {
        await uiProductsService.addProductToCart(twoProducts[0]);
        await uiProductsService.goToCart();
      })
      await test.step(`Visszatérés vásárláshoz, első termék ellenőrzése`, async () => {
        await uiCartService.returnToShopping();
        expect(await uiProductsService.isProductAddedToCart(twoProducts[0])).toBeTruthy();
      })
      await test.step(`Második termék hozzáadása a kosárhoz: ${twoProducts[1]}`, async () => {
        await uiProductsService.addProductToCart(twoProducts[1]);
        await uiProductsService.goToCart();
      })
      await test.step(`Kosárban lévő termékek ellenőrzése, majd vásárlás véglegesítése`, async () => {
        expect(await uiCartService.getAllProductsInCart()).toHaveLength(2);
        await uiCartService.goToCheckout();

        await uiCheckoutService.fillInCheckoutInformation('John', 'Doe', '12345');
        await uiCheckoutService.continueToOverview();
        await uiCheckoutService.finishOrder();
        await expect(await uiCheckoutService.succesfulOrderImg()).toBeVisible();
      })
    });
});
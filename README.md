# SauceDemo E2E Tesztautomatizációs Projekt

Ez a projekt a [SauceDemo (Swag Labs)](https://www.saucedemo.com/) webalkalmazás automatizált End-to-End (E2E) tesztjeit tartalmazza. A keretrendszer **Playwright** és **TypeScript** alapokon nyugszik, és a jól karbantartható **Page Object Model (POM)** architektúrát használja.

## Lefedett Tesztesetek

A tesztcsomag az alábbi kritikus üzleti folyamatokat (Happy Path és Negative Path) fedi le:

1. **Vásárlási folyamatok (Checkout Flow)**
   - Egyedi termékek hozzáadása a kosárhoz, és a teljes vásárlási folyamat végigvitele.
   - Kosár matek (Subtotal) ellenőrzése több termék (2 db és 3 db) egyidejű vásárlása esetén.
   - Vásárlás befejezése utáni "Back Home" funkció és a kosár alapállapotba kerülésének ellenőrzése.

2. **Kosár manipuláció**
   - Termékek kosárba tétele és eltávolítása (a főoldalról és a kosár nézetből is).
   - A kosár ikonon lévő számláló (badge) dinamikus megjelenésének és eltűnésének validálása.

3. **Form Validáció és Biztonság**
   - Vásárlói adatok (Checkout form) tesztelése hiányos bemenetekkel (pl. hiányzó keresztnév, üres irányítószám) és speciális karakterekkel.
   - Negatív tesztek biztonsági (XSS) bemenetekkel és speciális karakterekkel.

---

## Telepítés

A projekt futtatásához [Node.js](https://nodejs.org/) szükséges.
Klónozás vagy letöltés után futtasd az alábbi parancsokat a projekt gyökerében a függőségek és a böngészők telepítéséhez:

```bash
npm install
npx playwright install
```

## Tesztek Futtatása
A teszteket többféleképpen is elindíthatod attól függően, hogy milyen módot preferálsz.

1. Alapértelmezett futtatás (Gyors, háttérben futó)
Ez a parancs headless (láthatatlan) módban, a maximális sebesség érdekében több szálon (párhuzamosan) futtatja le a teszteket az összes beállított böngészőn.

```bash
npx playwright test
```

2. Vizuális futtatás (Látványos mód)
Ha látni szeretnéd a böngészőt működés közben, egymás után (1 szálon) futtatva a teszteket:

```bash
npx playwright test --headed --workers=1
```

> 💡 **Tipp a lassításhoz (slowMo):**
> Ha az automatizáció túl gyors, és emberi szemmel is követhetővé akarod tenni a kattintásokat, nyisd meg a `playwright.config.ts` fájlt, és a `use` blokkba tedd be a `launchOptions` beállítást 500ms-os lassítással:
> ```typescript
> use: {
>   launchOptions: {
>     slowMo: 500,
>   },
>   // ... többi beállítás
> }
> ```

3. Futtatás UI módban
A Playwright beépített vizuális felületének megnyitása, ahol lépésenként tudod futtatni és debugolni a teszteket:

```bash
npx playwright test --ui
```

### Riportok megtekintése
A Playwright minden futtatás után egy nagyon részletes, emberi nyelven is könnyen olvasható (test.step alapú) HTML riportot generál.

A futtatás befejeztével a riport automatikusan megnyílik, de ha később szeretnéd visszanézni, használd ezt a parancsot:

```bash
npx playwright show-report
```

### Tagek
A riportban különböző tesztesetek tagekkel vannak ellátva:

@SD_FLOW és @SD_CHECKOUT_VALIDATION - Teszt ID, filterezésével a különböző tesztesetek láthatóak minden letesztelt böngészőmotorral
@PRODUCT - Vizsgált termék nevére szabott tag, kijelölésével a termékkel kapcsolatos teszteseteket szürhetjük


### Projekt Struktúra (Architektúra)
- /src/pages/ - Page Object Model osztályok (UI elemek és lokátorok).

- /src/services/ - Üzleti logikát megvalósító réteg (műveletek összefogása).

- /src/tests/ - Maguk a tesztfájlok (.spec.ts), amik a folyamatokat validálják.

***

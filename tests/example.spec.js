import { test, expect } from '@playwright/test';

// test('home page and searchbar', async ({ page }) => { //NO TERMINADA
//     await page.goto('https://chabacano.mx/', { timeout: 40000 });
//     await expect(page).toHaveTitle(/Joyería Chabacano México – Chabacano MX/);
    
//     await page.goto('https://chabacano.mx/', { timeout: 30000 });
//     const searchInput = page.locator('input[id="SearchInput--mobile"]');
//     await expect(searchInput).toBeVisible();
//     await searchInput.fill('aretes');
//     await page.keyboard.press('Enter');
//     await expect(page.locator("p[class='search__caption caps']")).toContainText('Se han encontrado 165 resultados para "aretes"');
//     // await expect(page.locator("button[class='popout__toggle popout__toggle--filters']")).toBeVisible();
//     await first.locator("button[class='popout__toggle popout__toggle--filters']").click();
//     await expect(page.locator("div[class='collection__sidebar__slider expanded drawer--animated']")).toBeVisible();
//     await expect(page.locator("h3[class='a-color-state a-text-bold']")).toContainText("Filtros");
//     await expect(page.locator("div[class='collection__sidebar']")).toBeVisible();

//     await expect(page.locator("button[class='popout__toggle']")).toBeVisible();
// });

test('navigation links', async ({ page }) => {
    await page.goto('https://chabacano.mx/', { timeout: 30000 });
    const links = [
        { href: '/collections/aretes', title: 'Aretes' },
        { href: '/collections/anillos', title: 'Anillos' },
        { href: '/collections/collares', title: 'Collares' },
        { href: '/collections/pulseras', title: 'Pulseras' },
    ];
    for (const link of links) {
        await page.click(`a[href="${link.href}"]`);
        await expect(page).toHaveURL(`https://chabacano.mx${link.href}`);
    }
});

test('add to cart', async ({ page }) => {
    await page.goto('https://chabacano.mx/', { timeout: 30000 });
    await page.waitForSelector('a.navlink:has(span.navtext:has-text("ARETES"))');
    const link = page.locator('a.navlink:has(span.navtext:has-text("ARETES"))');
    await link.click();
    await page.waitForSelector('a.product-link:has(p.product-item__title:has-text("Aretes Enola"))');
    const productLink = page.locator('a.product-link:has(p.product-item__title:has-text("Aretes Enola"))');
    await productLink.click();
    await page.click('button[name="add"]');
});

test('add to cart with login', async ({ page }) => {
    await page.goto('https://chabacano.mx/', { timeout: 40000 });
    await expect(page).toHaveTitle(/Joyería Chabacano México – Chabacano MX/);

    const accountLink = page.locator('a[title="Mi cuenta"]');
    await accountLink.click();
    await expect(page).toHaveURL(/.*account/);
    const loginForm = page.locator('form#customer_login');
    await expect(loginForm).toBeVisible();
    const emailField = loginForm.locator('input[name="customer[email]"]');
    await expect(emailField).toBeVisible();
    const passwordField = loginForm.locator('input[name="customer[password]"]');
    await expect(passwordField).toBeVisible();

    await page.fill('input[name="customer[email]"]', 'alexia.eg.0731@gmail.com');
    await page.fill('input[name="customer[password]"]', 'aamaeagz239#');
    const loginButton = page.locator('button', { hasText: 'Iniciar sesión' });
    await loginButton.click();

    await page.goto('https://chabacano.mx/', { timeout: 40000 });
    const link = page.locator('a.navlink:has(span.navtext:has-text("ARETES"))');
    await link.click();

    await page.waitForSelector('a.product-link:has(p.product-item__title:has-text("Aretes Enola"))');
    const productLink = page.locator('a.product-link:has(p.product-item__title:has-text("Aretes Enola"))');
    await productLink.click();
    await page.click('button[name="add"]');

    const popup = page.locator('div#corner-cowi-cart-overlay-reward-chooser-card');
    await popup.waitFor({ state: 'visible', timeout: 10000 });
    const option = popup.locator('p:has-text("Aretes Freya")');
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
    const confirmButton = popup.locator('button:has-text("Confirmar")');
    await confirmButton.click();
    await expect(popup).toBeHidden();
    const purchasedItem = page.locator('p.text-md.leading-snug.text-cowi-primary-type:has-text("Aretes Freya")', { timeout: 60000 });
    await expect(purchasedItem).toBeVisible();
});

test('product', async ({ page }) => {
    await page.goto('https://chabacano.mx/', { timeout: 40000 });
    await expect(page).toHaveTitle(/Joyería Chabacano México – Chabacano MX/);
    const ProductLink = page.locator('a.product-link:has(p.product-item__title:has-text("Aretes Acuata"))');
    await expect(ProductLink).toBeVisible();
    const NameProduct = ProductLink.locator('p.product-item__title')
    const NameText = await NameProduct.innerText()
    console.log('Nombre del producto: ', NameText);
    const ProductPrice = ProductLink.locator('.new-price');
    const priceText = await ProductPrice.innerText();
    console.log('El precio del producto es:', priceText);
    await ProductLink.click();
    await expect(page).toHaveURL(/.*aretes-acuata/);
    const productTitle = page.locator('h1.product__title span');
    await expect(productTitle).toBeVisible();
    const titleText = await productTitle.innerText();
    expect(titleText).toContain('Aretes Acuata');
    console.log('El título del producto es:', titleText);
    const productPriceContainer = page.locator('div.product__price').first();
    await expect(productPriceContainer).toBeVisible();
    const originalPrice = page.locator('s.product__price--strike').first();
    await expect(originalPrice).toBeVisible();
    const originalPriceText = await originalPrice.innerText();
    console.log('El precio original del producto es:', originalPriceText);
    const discountBadge = page.locator('span.discount-badge');
    await expect(discountBadge).toBeVisible();
    const discountText = await discountBadge.innerText();
    console.log('El descuento es:', discountText);
    const discountedPrice = page.locator('span.product__price--sale').first(); 
    await expect(discountedPrice).toBeVisible(); 
    const discountedPriceText = await discountedPrice.innerText(); 
    console.log('El precio final del producto es:', discountedPriceText); 
    if (priceText && originalPriceText && discountText) {
        console.log('El producto tiene precio actual, precio original y descuento visible.');
    } else {
        console.log('Faltan elementos de precio o descuento en el producto.');
    }
    const addToCartButton = page.locator('#AddToCart--template--23824221897016__main');
    await expect(addToCartButton).toBeVisible();
    console.log('El botón de "Agregar al carrito" está visible.');
});

test('login', async ({ page }) => {
    await page.goto('https://chabacano.mx/', { timeout: 40000 });
    await expect(page).toHaveTitle(/Joyería Chabacano México – Chabacano MX/);

    const accountLink = page.locator('a[title="Mi cuenta"]');
    await accountLink.click();
    await expect(page).toHaveURL(/.*account/);
    const loginForm = page.locator('form#customer_login');
    await expect(loginForm).toBeVisible();
    const emailField = loginForm.locator('input[name="customer[email]"]');
    await expect(emailField).toBeVisible();
    const passwordField = loginForm.locator('input[name="customer[password]"]');
    await expect(passwordField).toBeVisible();

    await page.fill('input[name="customer[email]"]', 'alexia.eg.0731@gmail.com');
    await page.fill('input[name="customer[password]"]', 'aamaeagz239#');
    const loginButton = page.locator('button', { hasText: 'Iniciar sesión' });
    await loginButton.click();
});

test('login failed', async ({ page }) => {
    await page.goto('https://chabacano.mx/', { timeout: 40000 });
    await expect(page).toHaveTitle(/Joyería Chabacano México – Chabacano MX/);

    const accountLink = page.locator('a[title="Mi cuenta"]');
    await accountLink.click();
    await expect(page).toHaveURL(/.*account/);
    const loginForm = page.locator('form#customer_login');
    await expect(loginForm).toBeVisible();
    const emailField = loginForm.locator('input[name="customer[email]"]');
    await expect(emailField).toBeVisible();
    const passwordField = loginForm.locator('input[name="customer[password]"]');
    await expect(passwordField).toBeVisible();

    await page.fill('input[name="customer[email]"]', 'alexia.eg.0731@gmail.com');
    await page.fill('input[name="customer[password]"]', 'aamaeagz239');
    const loginButton = page.locator('button', { hasText: 'Iniciar sesión' });
    await loginButton.click();

    const errorMessage = page.locator('li:has-text("Correo electrónico o contraseña incorrectos")', { timeout: 40000 });
    await expect(errorMessage).toBeVisible();
    const errorText = await errorMessage.innerText();
    expect(errorText).toContain('Correo electrónico o contraseña incorrectos');
});

test('register failed', async ({ page }) => {
    await page.goto('https://chabacano.mx/', { timeout: 30000 });
    await expect(page).toHaveTitle(/Joyería Chabacano México – Chabacano MX/);

    const accountLink = page.locator('a[title="Mi cuenta"]');
    await accountLink.click();
    await expect(page).toHaveURL(/.*account/);
    const registerButton = page.locator('a[href="/account/register"]');
    await expect(registerButton).toHaveText("Registrate aquí");
    await registerButton.click();
    await expect(page).toHaveURL('https://chabacano.mx/account/register');

    // await expect(page.locator('div[class="customer-register"]').toBeVisible());
    const createAccount = page.locator('form#create_customer');
    await expect(createAccount).toBeVisible();
    const firstName = page.locator('input[id="first_name"]');
    await expect(firstName).toBeVisible();
    await firstName.fill('Miroslava');
    const lastName = page.locator('input[id="last_name"]');
    await expect(lastName).toBeVisible();
    await lastName.fill('Evangelista');
    const email = page.locator('input[id="email"]');
    await expect(email).toBeVisible();
    await email.fill('alexia.eg.0731@gmail.com');
    const password = page.locator('input[id="password"]');
    await expect(password).toBeVisible();
    await password.fill('hola123');

    const create = page.locator('button[class="btn btn--primary btn--solid"]'); 
    await create.click();
    const errors = page.locator('div[class="errors"]');
    await expect(errors).toBeVisible();
    const errorList = errors.locator('ul');
    await expect(errorList).toBeVisible();
    const errorItems = errorList.locator('li');
    await expect(errorItems.nth(0)).toHaveText('Esta dirección de e‑mail ya ha sido asociada con una cuenta. Si la cuenta es tuya, puedes restablecer tu contraseña aquí');
});

test('add new address', async ({ page }) => {
    await page.goto('https://chabacano.mx/');
    await expect(page).toHaveTitle(/Joyería Chabacano México – Chabacano MX/);

    const accountLink = page.locator('a[title="Mi cuenta"]');
    await accountLink.click();
    await expect(page).toHaveURL(/.*account/);
    const loginForm = page.locator('form#customer_login');
    await expect(loginForm).toBeVisible();
    const emailField = loginForm.locator('input[name="customer[email]"]');
    await expect(emailField).toBeVisible();
    const passwordField = loginForm.locator('input[name="customer[password]"]');
    await expect(passwordField).toBeVisible();
    await page.fill('input[name="customer[email]"]', 'alexia.eg.0731@gmail.com');
    await page.fill('input[name="customer[password]"]', 'aamaeagz239#');
    const loginButton = page.locator('button', { hasText: 'Iniciar sesión' });
    await loginButton.click();

    await page.goto('https://chabacano.mx/account', { timeout: 40000 });
    const aside = page.locator('aside[class="account-sidebar"]'); 
    await expect(aside).toBeVisible();
    const asideLink = page.locator('aside a[href="/account/addresses"]');
    await expect(asideLink).toBeVisible();
    await asideLink.click();
    await expect(page).toHaveURL('https://chabacano.mx/account/addresses');
    await expect(page).toHaveTitle(/Direcciones - Chabacano MX/);
    await expect(page.locator('h2["Sus direcciones"]')).toBeVisible();
    const newAddressButton = page.locator('button[class="btn btn--solid btn--primary address-new-toggle"]'); 
    await newAddressButton.click();

    const addressForm = page.locator('form#address_form_new');
    await expect(addressForm).toBeVisible();
    const firstName = page.locator('input[id="AddressFirstNameNew"]');
    await expect(firstName).toBeVisible();
    await firstName.fill('Alexia');
    const lastName = page.locator('input[id="AddressLastNameNew"]');
    await expect(lastName).toBeVisible();
    await lastName.fill('Evangelista');
    const company = page.locator('input[id="AddressCompanyNew"]');
    await expect(company).toBeVisible();
    await company.fill('Empresa ejemplo');
    const address1 = page.locator('input[id="AddressAddress1New"]');
    await expect(address1).toBeVisible();
    await address1.fill('Calle Falsa 123');
    const address2 = page.locator('input[id="AddressAddress2New"]');
    await expect(address2).toBeVisible();
    await address2.fill('Calle Real 123');
    const city = page.locator('input[id="AddressCityNew"]');
    await expect(city).toBeVisible();
    await city.fill('Aguascalientes');
    const addressZip = page.locator('input[id="AddressZipNew"]');
    await expect(addressZip).toBeVisible();
    await addressZip.fill('20907');
    const phone = page.locator('input[id="AddressPhoneNew"]');
    await expect(phone).toBeVisible();
    await phone.fill('4491234567');

    const addAddress = page.locator('button[class="btn btn--black btn--solid"]'); 
    await addAddress.click();
    await expect(page).toHaveTitle(/Direcciones - Chabacano MX/);
});

import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { setTimeout as pause } from 'node:timers/promises';
import { chromium } from 'playwright-core';
import { after, before, test } from 'node:test';

let root;
let origin;
let server;
let browser;
let serverLog = '';

before(async () => {
  root = await mkdtemp(join(tmpdir(), 'nira-smoke-'));
  const socket = createServer().listen(0, '127.0.0.1');
  await once(socket, 'listening');
  const { port } = socket.address();
  await new Promise((resolve) => socket.close(resolve));
  origin = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port)], {
    env: {
      ...process.env,
      NIRA_SQLITE_ONLY: '1',
      NIRA_SQLITE_PATH: join(root, 'smoke.db'),
      OPENROUTER_API_KEY: '',
      NEXT_PUBLIC_OPENROUTER_API_KEY: '',
      GEMINI_API_KEY: '',
      NEXT_PUBLIC_GEMINI_API_KEY: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  for (const stream of [server.stdout, server.stderr]) {
    stream.on('data', (data) => { serverLog = (serverLog + data).slice(-6000); });
  }
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const response = await fetch(origin).catch(() => null);
    if (response?.ok) break;
    if (server.exitCode !== null || attempt === 79) throw new Error(`Test server failed to start. Run npm run build first.\n${serverLog}`);
    await pause(250);
  }
  const systemChromium = spawnSync('which', ['chromium'], { encoding: 'utf8' }).stdout?.trim();
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || systemChromium || undefined });
});

after(async () => {
  await browser?.close();
  if (server && server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill();
    await exited;
  }
  if (root) await rm(root, { recursive: true, force: true });
});

async function request(path, method = 'GET', payload, expectedStatus = 200) {
  const res = await fetch(`${origin}/api/v1/${path}`, {
    method,
    signal: AbortSignal.timeout(15_000),
    ...(payload && { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  });
  const body = await res.json();
  assert.equal(res.status, expectedStatus, `${method} ${path}: ${JSON.stringify(body)}`);
  if (expectedStatus < 400) assert.equal(body.success, true, JSON.stringify(body));
  return body;
}

test('SQLite crop create, read, update, delete and COD checkout through delivery', async () => {
  const { crop } = await request('crops', 'POST', {
    cropName: 'Tomato', quantityKg: 100, priceRupees: 25, farmerId: 'u_farmer_1', location: 'Nashik',
  });
  const { id } = crop;
  assert.ok((await request('crops?farmerId=u_farmer_1')).crops.some((row) => row.id === id));
  await request('crops', 'PUT', { id, quantityKg: 90, priceRupees: 30 });
  assert.equal((await request('crops')).crops.find((row) => row.id === id).quantity_available, 90);

  await request('orders', 'POST', { items: [] }, 400);
  const order = await request('orders', 'POST', {
    buyerId: 'u_buyer_smoke',
    deliveryAddress: '10 Test Road, Nashik, Maharashtra 422001',
    paymentMethod: 'COD',
    items: [{ listingId: id, cropName: 'Tomato', quantity: 5, unitPricePaise: 3000 }],
  });
  const { orderId, pickupOtp, deliveryOtp } = order;
  assert.equal(order.subtotalPaise, 15000);
  assert.equal(order.totalAmountPaise, 18500);
  assert.match(pickupOtp, /^\d{4}$/);
  assert.match(deliveryOtp, /^\d{4}$/);
  const partnerId = 'u_partner_1';
  await request('orders/accept-delivery', 'POST', { orderId, partnerId, driverName: 'Local Test Driver' });
  await request('orders/verify-otp', 'POST', { orderId, partnerId, otpType: 'pickup', enteredOtp: '0000' }, 400);
  const pickup = await request('orders/verify-otp', 'POST', { orderId, partnerId, otpType: 'pickup', enteredOtp: pickupOtp });
  assert.equal(pickup.deliveryStatus, 'IN_TRANSIT');
  await request('orders/verify-otp', 'POST', { orderId, partnerId, otpType: 'delivery', enteredOtp: deliveryOtp, codCollected: false }, 400);
  const delivery = await request('orders/verify-otp', 'POST', { orderId, partnerId, otpType: 'delivery', enteredOtp: deliveryOtp, codCollected: true });
  assert.equal(delivery.deliveryStatus, 'DELIVERED');
  assert.equal(delivery.paymentStatus, 'PAID');
  assert.equal((await request(`orders?role=BUYER&userId=u_buyer_smoke`)).orders.find((row) => row.id === orderId).status, 'Delivered');
  const removable = await request('crops', 'POST', { cropName: 'Potato', quantityKg: 40, priceRupees: 20, farmerId: 'u_farmer_1' });
  await request(`crops?id=${removable.crop.id}`, 'DELETE');
  assert.ok(!(await request('crops')).crops.some((row) => row.id === removable.crop.id));
});

async function verifyViewport(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const clippedControls = await page.evaluate(() =>
    [...document.querySelectorAll('header button, main button, main select, main input')]
      .filter((control) => {
        const rect = control.getBoundingClientRect();
        return rect.width > 0 && (rect.left < -2 || rect.right > innerWidth + 2)
          && !control.parentElement?.closest('.overflow-x-auto');
      })
      .map((control) => control.textContent.trim() || control.getAttribute('aria-label'))
  );
  assert.deepEqual(clippedControls, [], `Clipped controls at ${page.url()}`);
  const header = await page.locator('header').first().boundingBox();
  assert.ok(header && header.x >= 0 && header.x + header.width <= page.viewportSize().width + 1);
}

test('marketplace and all portals render at phone and desktop widths', async () => {
  for (const width of [320, 390, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 840 }, isMobile: width < 768, hasTouch: width < 768 });
    page.setDefaultTimeout(10_000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    assert.equal((await page.goto(origin)).status(), 200);
    for (const path of ['/farmer', '/fpo', '/buyer', '/hub', '/transporter', '/admin', '/forecast', '/']) {
      const navigation = width < 1280 ? page.getByRole('navigation', { name: 'Mobile portals' }) : page.locator('header nav').first();
      if (width < 1280) await page.getByText('Portal menu', { exact: true }).click();
      await navigation.locator(`a[href="${path}"]`).click();
      await page.waitForURL(`${origin}${path}`);
      await page.locator('main').waitFor();
      if (width < 1280) assert.equal(await navigation.isVisible(), false);
      if (path === '/forecast') {
        const trajectory = page.getByRole('button', { name: '7-Day Price & Arrival Trajectory Curve' });
        await trajectory.waitFor();
        await verifyViewport(page);
        await page.getByRole('button', { name: 'AI Agronomic & Dispatch Advice' }).click();
        await trajectory.click();
      }
      await verifyViewport(page);
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
});

test('buyer filters, saved lots and per-account cart survive a reload on mobile', async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  page.setDefaultTimeout(10_000);
  await page.route('**/api/v1/crops', (route) => route.fulfill({ json: { success: true, crops: [
    { id: 'sample-a', crop_name: 'Tomato', farmer_name: 'Test Grower', location: 'Nashik', category: 'Vegetables', quantity_available: 60, price_paise: 3000 },
    { id: 'sample-b', crop_name: 'Mango', farmer_name: 'Test Orchard', location: 'Pune', category: 'Fruits', quantity_available: 20, price_paise: 1500 },
    { id: 'sample-c', crop_name: 'Potato', farmer_name: 'Test Grower', location: 'Nashik', category: 'Vegetables', quantity_available: 0, price_paise: 1000 },
  ] } }));
  await page.goto(origin);
  await page.getByText('Portal menu', { exact: true }).click();
  await page.getByRole('navigation', { name: 'Mobile portals' }).locator('a[href="/buyer"]').click();
  const tomato = page.locator('#produce-card-sample-a');
  const mango = page.locator('#produce-card-sample-b');
  const potato = page.locator('#produce-card-sample-c');
  const cards = page.locator('[id^="produce-card-sample-"]');
  await tomato.waitFor();
  await page.getByRole('searchbox', { name: 'Search produce' }).fill('Pune');
  await mango.waitFor();
  await tomato.waitFor({ state: 'detached' });
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await page.getByLabel('Sort by').selectOption('price-asc');
  assert.equal(await cards.first().getAttribute('id'), 'produce-card-sample-c');
  await page.getByLabel('Sort by').selectOption('stock');
  assert.equal(await cards.first().getAttribute('id'), 'produce-card-sample-a');
  assert.ok(await potato.getByRole('button', { name: 'Out of stock' }).isDisabled());
  await page.getByLabel('In stock').check();
  await potato.waitFor({ state: 'detached' });
  await page.getByLabel('Category').selectOption('Fruits');
  await tomato.waitFor({ state: 'detached' });
  await page.getByLabel('Saved lots').check();
  await page.getByText('No lots match these filters.').waitFor();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  const save = mango.getByRole('button', { name: /^Save / });
  await save.click();
  assert.equal(await save.getAttribute('aria-pressed'), 'true');
  await mango.getByRole('spinbutton').fill('12');
  await mango.getByRole('button', { name: /add to cart/i }).click();
  await page.getByText('Your Shopping Cart').waitFor();
  await page.getByRole('button', { name: 'Close cart' }).click();
  await page.reload();
  await save.waitFor();
  await page.waitForFunction(() => document.querySelector('#produce-card-sample-b button[aria-pressed]')?.getAttribute('aria-pressed') === 'true');
  await page.getByLabel('Saved lots').check();
  await tomato.waitFor({ state: 'detached' });
  await page.getByText('Portal menu', { exact: true }).click();
  await page.getByRole('navigation', { name: 'Mobile portals' }).locator('a[href="/farmer"]').click();
  await page.waitForURL(`${origin}/farmer`);
  await page.getByTitle('Shopping Cart (0 items)').waitFor();
  await page.getByText('Portal menu', { exact: true }).click();
  await page.getByRole('navigation', { name: 'Mobile portals' }).locator('a[href="/buyer"]').click();
  await page.waitForURL(`${origin}/buyer`);
  await page.getByTitle(/Shopping Cart \(12 items\)/).click();
  await page.getByText('Your Shopping Cart').waitFor();
  assert.ok(await page.getByTitle('Remove').isVisible());
  await page.getByTitle('Remove').click();
  await page.getByText('Empty Cart', { exact: false }).first().waitFor();
  await page.getByRole('button', { name: 'Close cart' }).click();
  await mango.getByRole('spinbutton').fill('12');
  await mango.getByRole('button', { name: /add to cart/i }).click();
  await page.getByRole('button', { name: /Proceed to Checkout/ }).click();
  const review = page.getByRole('button', { name: 'Review & Confirm Order' });
  await review.click();
  await page.getByText('Please enter recipient full name (Mandatory)').waitFor();

  for (const [placeholder, value] of [
    ['e.g. Rahul Sharma', 'Local Test Buyer'], ['e.g. 9876543210', '9876543210'],
    ['e.g. 411014', '422001'], ['e.g. Flat 402, Green Acres Apt', 'Flat 2'],
    ['e.g. Viman Nagar Main Road, Clover Park', 'Test Road'], ['e.g. Near Agri Mandi Gate', 'Market Gate'],
    ['e.g. Main Post Office / Town', 'Nashik'], ['e.g. Pune / Indore / Nashik', 'Nashik'],
  ]) {
    await page.getByPlaceholder(placeholder, { exact: true }).fill(value);
  }
  await page.locator('select').filter({ has: page.locator('option[value="Maharashtra"]') }).selectOption('Maharashtra');
  await page.getByRole('button', { name: /Cash on Delivery/ }).click();
  await review.click();
  assert.ok(await page.getByText('₹215.00', { exact: true }).last().isVisible());
  const [orderResponse] = await Promise.all([
    page.waitForResponse((response) => response.url().endsWith('/api/v1/orders') && response.request().method() === 'POST'),
    page.getByRole('button', { name: /Confirm & Place Order/ }).click(),
  ]);
  const order = await orderResponse.json();
  assert.equal(orderResponse.status(), 200, JSON.stringify(order));
  assert.equal(order.totalAmountPaise, 21500);
  await page.getByRole('heading', { name: 'Order confirmed' }).waitFor();
  await page.reload();
  await page.getByTitle('Shopping Cart (0 items)').waitFor();
  await page.close();
});

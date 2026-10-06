import { test, expect } from "@playwright/test";

test("public routes render with preserved images and metadata", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const routes = ["/", "/about", "/events", "/experiences", "/experiences/sauna-dip",
    "/experiences/fishing", "/experiences/camping", "/lakes", "/lakes/willow",
    "/lakes/oak", "/lakes/pine", "/book", "/book/swim", "/contact",
    "/privacy", "/cookies", "/terms", "/health-safety", "/sentinal"];
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
  }
  await page.goto("/");
  await expect(page.locator('img[src="/images/hero-aerial.jpg"]').first()).toBeVisible();
  await expect.poll(() => page.locator('img[src="/images/hero-aerial.jpg"]').first()
    .evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test("client navigation, dynamic routes and direct reload work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Experiences", exact: true }).first().click();
  await expect(page).toHaveURL(/\/experiences$/);
  await expect(page.locator("h1")).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/lakes/pine");
  await page.reload();
  await expect(page.locator("h1").first()).toContainText(/Pine/i);
  await page.goto("/experiences/does-not-exist");
  await expect(page.getByRole("heading", { name: "This page has wandered off." })).toBeVisible();
});

test("sauna booking ticket selection and calendar remain interactive", async ({ page }) => {
  await page.goto("/book/sauna");
  await expect(page.getByRole("heading", { name: "Choose your ticket" })).toBeVisible();
  await page.getByRole("button", { name: /Weekly Pass/i }).click();
  await expect(page.getByRole("button", { name: /Weekly Pass/i })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /^Continue/ }).click();
  await expect(page.getByRole("button", { name: "Next month" })).toBeVisible();
  await page.getByRole("button", { name: "Next month" }).click();
  const day = page.locator("#booking-datetime button").filter({ hasText: /^15$/ });
  await expect(day).toBeEnabled();
  await day.click();
  await expect(page.locator("#booking-datetime")).toContainText(/15/);
  // Stop before creating a real booking or payment.
});

test("mobile menu navigation and contact form are usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.locator("nav").getByRole("link", { name: /^Contact/ }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  const name = page.locator("form input").first();
  await expect(name).toBeVisible();
  await name.fill("Migration test");
  await expect(name).toHaveValue("Migration test");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test("APIs preserve content, authorization, input validation and search assets", async ({ request }) => {
  const bootstrap = await request.get("/api/content/bootstrap");
  expect(bootstrap.status()).toBe(200);
  const data = await bootstrap.json();
  expect(data.lakes).toHaveLength(3);
  expect(data.pages.home.content.hero).toBeTruthy();
  expect((await request.get("/api/admin/bookings")).status()).toBe(401);
  expect((await request.post("/api/auth/login", { data: {} })).status()).toBe(400);
  expect((await request.post("/api/contact", { data: {} })).status()).toBe(400);
  expect((await request.post("/api/sauna/checkout", { data: {} })).status()).toBe(400);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
});

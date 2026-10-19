/**
 * Browser smoke test for the standalone hand-off prototype.
 * Run from the prototype root: node _build/verify-prototype.js
 */
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "_verify");
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const checks = [];
const failures = [];

const record = (name, ok, detail = "") => {
  checks.push({ name, ok: Boolean(ok), detail });
  if (!ok) failures.push(`${name}${detail ? `: ${detail}` : ""}`);
};

const attachErrors = (page, bucket) => {
  page.on("pageerror", (error) => bucket.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (/favicon|ERR_FILE_NOT_FOUND.*favicon/.test(text)) return;
    bucket.push(`console: ${text}`);
  });
};

const open = async (page, file, hash = "", query = "") => {
  const url = pathToFileURL(file).href + (query || `?t=${Date.now()}`) + hash;
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(420);
};

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: chrome });

  const hub = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const hubErrors = [];
  attachErrors(hub, hubErrors);
  await open(hub, path.join(ROOT, "index.html"));
  record("handoff hub renders", await hub.locator(".hero h1").count() === 1);
  record("handoff hub has four entries", await hub.locator(".entry-card").count() === 4);
  const hubAdminLinks = await hub.locator('a[href*="#admin/"]').evaluateAll((items) =>
    [...new Set(items.map((item) => item.getAttribute("href")))]
  );
  record("handoff hub lists every admin view", hubAdminLinks.length === 21, `${hubAdminLinks.length} unique links`);
  const brokenImages = await hub.locator("img").evaluateAll((items) =>
    items.filter((item) => !item.complete || !item.naturalWidth).map((item) => item.src)
  );
  record("handoff hub preview images load", brokenImages.length === 0, brokenImages.join(", "));
  record("handoff hub has no browser errors", hubErrors.length === 0, hubErrors.join(" | "));
  await hub.close();

  for (const pageName of ["index.html", "showcase.html"]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    attachErrors(page, errors);
    await open(page, path.join(ROOT, "official", pageName));
    record(`official ${pageName} renders`, await page.locator("h1, h2").count() > 0);
    record(
      `official ${pageName} reveals all sections`,
      await page.locator(".reveal").evaluateAll((items) => items.every((item) => getComputedStyle(item).opacity === "1"))
    );
    record(`official ${pageName} has no browser errors`, errors.length === 0, errors.join(" | "));
    await page.close();
  }

  const publicRoutes = [
    "home", "tools", "tool/boundary", "datasets", "dataset/survey-points",
    "requests", "pricing", "help", "about", "terms", "privacy"
  ];
  const authRoutes = ["login", "register", "forgot"];
  const accountRoutes = [
    "account/entitlements", "account/profile", "account/security", "account/orders", "account/invoices"
  ];
  const adminRoutes = [
    "tools", "tags", "labels", "tool_media", "tool_updates", "tool_docs", "datasets",
    "help", "requests", "site", "products", "billing_plans", "coupons", "users",
    "sites", "feedback", "orders", "invoices", "refunds", "policies", "stats"
  ];
  const fighubFile = path.join(ROOT, "fighub", "index.html");

  const userContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await userContext.addInitScript(() => localStorage.setItem("yykj-ui-prototype-mode", "authed"));
  const userPage = await userContext.newPage();
  const userErrors = [];
  attachErrors(userPage, userErrors);
  for (const route of [...publicRoutes, ...accountRoutes]) {
    await open(userPage, fighubFile, `#${route}`);
    await userPage.waitForTimeout(240);
    const contentLength = await userPage.locator("#app").innerText().then((text) => text.trim().length).catch(() => 0);
    record(`user route ${route}`, contentLength > 20, `content length ${contentLength}`);
  }
  record("user routes have no browser errors", userErrors.length === 0, userErrors.join(" | "));

  for (const route of authRoutes) {
    await open(userPage, fighubFile, `#${route}`, `?mode=guest&t=${Date.now()}`);
    await userPage.waitForTimeout(700);
    record(`auth route ${route}`, await userPage.locator(".auth-card").count() === 1);
  }
  await userContext.close();

  const adminContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await adminContext.addInitScript(() => localStorage.setItem("yykj-ui-prototype-mode", "admin"));
  const adminPage = await adminContext.newPage();
  const adminErrors = [];
  attachErrors(adminPage, adminErrors);
  for (const route of adminRoutes) {
    await open(adminPage, fighubFile, `#admin/${route}`);
    await adminPage.waitForTimeout(320);
    const adminReady = await adminPage.locator(".admin-sidebar").count() === 1;
    record(
      `admin route ${route}`,
      adminReady,
      adminReady ? "" : "sidebar missing"
    );
  }
  record("admin routes have no browser errors", adminErrors.length === 0, adminErrors.join(" | "));
  await adminContext.close();

  const scenarioContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await scenarioContext.addInitScript(() => localStorage.setItem("yykj-ui-prototype-mode", "authed"));
  const scenarioPage = await scenarioContext.newPage();
  const scenarioErrors = [];
  attachErrors(scenarioPage, scenarioErrors);

  const scenarioChecks = [
    ["#home", "[data-share-open]", "[data-share-modal]:not([hidden])", "share modal"],
    ["#requests", "[data-open-request-form]", "[data-request-modal]:not([hidden])", "request modal"],
    ["#tool/boundary", "[data-buy-now]", "[data-pay-modal]", "purchase pay sheet"],
    ["#tool/boundary", "[data-pay-open]", "[data-pay-modal]", "pay method modal"],
    ["#tool/boundary", "[data-vip-open]", "[data-vip-modal]", "VIP modal"],
    ["#pricing", "[data-buy-plan]", "[data-plan-modal]", "price confirm modal"],
    ["#account/security", '[data-security-open="password"]', '[data-security-dialog="password"]:not([hidden])', "password dialog"],
    ["#account/security", '[data-security-open="email"]', '[data-security-dialog="email"]:not([hidden])', "email dialog"],
    ["#account/security", "[data-wechat-bind]", "[data-qr-modal]:not([hidden])", "wechat bind QR"],
    ["#account/security", "[data-account-deactivate]", "[data-deactivate-modal]", "deactivate modal"],
    ["#account/orders", "[data-refund-apply]", "[data-refund-modal]", "refund modal"]
  ];

  for (const [hash, trigger, expected, label] of scenarioChecks) {
    await open(scenarioPage, fighubFile, hash);
    await scenarioPage.waitForTimeout(650);
    const triggerNode = scenarioPage.locator(trigger).first();
    if (await triggerNode.count()) {
      await triggerNode.click();
      await scenarioPage.waitForTimeout(780);
      record(`scenario ${label}`, await scenarioPage.locator(expected).count() > 0);
    } else {
      record(`scenario ${label}`, false, `trigger ${trigger} missing`);
    }
  }
  await open(scenarioPage, fighubFile, "#tool/boundary");
  await scenarioPage.waitForTimeout(650);
  await scenarioPage.locator("[data-buy-now]").click();
  await scenarioPage.waitForTimeout(250);
  await scenarioPage.locator("[data-pay-confirm]").click();
  await scenarioPage.waitForTimeout(1000);
  record("purchase completion state", await scenarioPage.locator(".purchase-success").count() === 1);
  record("scenario checks have no browser errors", scenarioErrors.length === 0, scenarioErrors.join(" | "));
  await scenarioContext.close();

  const boundary = await browser.newPage({ viewport: { width: 1920, height: 1080 }, acceptDownloads: true });
  const boundaryErrors = [];
  attachErrors(boundary, boundaryErrors);
  await open(boundary, path.join(ROOT, "boundary", "index.html"));
  record("boundary map initializes", await boundary.locator(".leaflet-container").count() === 1);
  await boundary.locator("[data-proto-sample]").click();
  await boundary.waitForTimeout(1400);
  record("boundary sample preview", await boundary.locator("#ydmj").inputValue() === "110559.30");
  record("boundary region autofill", (await boundary.locator("#xzqmc").inputValue()).includes("乡宁县"));
  const downloadPromise = boundary.waitForEvent("download", { timeout: 5000 }).catch(() => null);
  await boundary.locator("[data-proto-process]").click();
  const download = await downloadPromise;
  await boundary.waitForTimeout(1000);
  record("boundary output download", Boolean(download), download ? "" : "no download event");
  record(
    "boundary completion log",
    (await boundary.locator("#console").innerText()).includes("已生成并下载")
  );
  record("boundary has no browser errors", boundaryErrors.length === 0, boundaryErrors.join(" | "));
  await boundary.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const mobileErrors = [];
  attachErrors(mobile, mobileErrors);
  await open(mobile, fighubFile, "#home");
  await mobile.waitForTimeout(700);
  await mobile.locator("[data-nav-toggle]").click();
  await mobile.waitForTimeout(250);
  record("mobile navigation drawer", await mobile.locator("[data-nav-drawer]:not([hidden])").count() === 1);
  record("mobile route has no browser errors", mobileErrors.length === 0, mobileErrors.join(" | "));
  await mobile.close();
  const mobileAdmin = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const mobileAdminErrors = [];
  attachErrors(mobileAdmin, mobileAdminErrors);
  await mobileAdmin.addInitScript(() => localStorage.setItem("yykj-ui-prototype-mode", "admin"));
  await open(mobileAdmin, fighubFile, "#admin/tools");
  await mobileAdmin.waitForTimeout(700);
  const adminWidth = await mobileAdmin.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth
  }));
  record("mobile admin avoids page-level horizontal scroll", adminWidth.scroll <= adminWidth.client + 2, JSON.stringify(adminWidth));
  record("mobile admin route has no browser errors", mobileAdminErrors.length === 0, mobileAdminErrors.join(" | "));
  await mobileAdmin.close();

  await browser.close();

  const report = {
    generated_at: new Date().toISOString(),
    passed: checks.filter((check) => check.ok).length,
    failed: checks.filter((check) => !check.ok).length,
    checks
  };
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2), "utf8");
  fs.writeFileSync(
    path.join(OUT, "report.md"),
    `# Prototype verification\n\n- Passed: ${report.passed}\n- Failed: ${report.failed}\n\n` +
      checks.map((check) => `- ${check.ok ? "PASS" : "FAIL"} ${check.name}${check.detail ? ` — ${check.detail}` : ""}`).join("\n") +
      "\n",
    "utf8"
  );
  console.log(`Prototype checks: ${report.passed} passed, ${report.failed} failed`);
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

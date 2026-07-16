

import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const FRONTEND = "http://localhost:3000";
const API_LOG =
  process.env.API_LOG ??
  "/tmp/claude-1000/-home-joshnick-Desktop-edutechproject/ed6c1b0f-3659-4f14-a3c8-1aefc05c20be/scratchpad/api.log";
const ART = resolve(import.meta.dirname, "artifacts");
mkdirSync(ART, { recursive: true });

const PASSWORD = "Password123!";
const run = { pass: [], fail: [] };
let page; 

const freshPhone = () =>
  `081${String(Math.floor(10000000 + Math.random() * 89999999))}`; // 0 + 10 digits

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
);
const PDF = Buffer.from("%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF");

function otpFor(phone, purpose = "") {
  // last [DEV SMS] to this phone (+234 form), newest wins
  const intl = `+234${phone.slice(1)}`;
  const lines = readFileSync(API_LOG, "utf8")
    .split("\n")
    .filter((l) => l.includes("[DEV SMS]") && l.includes(intl));
  const line = lines.at(-1) ?? "";
  const m = line.match(/code is (\d{4,6})/) ?? line.match(/\b(\d{6})\b/);
  if (!m) throw new Error(`No OTP found for ${phone} in ${API_LOG}`);
  return m[1];
}

function inviteLinkFor(phone) {
  const intl = `+234${phone.slice(1)}`;
  const lines = readFileSync(API_LOG, "utf8")
    .split("\n")
    .filter((l) => l.includes("[DEV SMS]") && l.includes(intl));
  for (const line of lines.reverse()) {
    const m = line.match(/https?:\/\/[^\s"\\]+token=[A-F0-9]+/i);
    if (m) return m[0].replace(/\\u0026/g, "&");
  }
  throw new Error(`No invite link SMS found for ${phone}`);
}

async function step(name, fn) {
  try {
    await fn();
    run.pass.push(name);
    console.log(`  ✓ ${name}`);
  } catch (err) {
    run.fail.push({ name, err: String(err?.message ?? err) });
    const slug = name.replace(/\W+/g, "-").toLowerCase();
    try {
      await page.screenshot({ path: `${ART}/${slug}.png`, fullPage: true });
      writeFileSync(`${ART}/${slug}.html`, await page.content());
    } catch {}
    console.log(`  ✗ ${name}\n    ${String(err?.message ?? err).split("\n")[0]}`);
    throw err; // a journey stops at its first failure
  }
}

async function registerAndVerify(pg, { first, last, phone }) {
  await pg.goto(`${FRONTEND}/register`);
  await pg.getByPlaceholder("e.g. Ada").fill(first);
  await pg.getByPlaceholder("e.g. Obi").fill(last);
  await pg.getByPlaceholder("e.g. 08012345678").fill(phone);
  await pg.getByPlaceholder("At least 8 characters").fill(PASSWORD);
  await pg.locator('button[type="submit"]').click();
  await pg.waitForURL(/verify-phone/, { timeout: 15000 });
  await pg.waitForTimeout(1200); // let the SMS hit the log
  await pg.locator('input[autocomplete="one-time-code"], [data-input-otp="true"], input').first().click();
  await pg.keyboard.type(otpFor(phone), { delay: 40 });
  // verify screens usually auto-submit on the 6th digit; give it a moment, click if a button remains
  await pg.waitForTimeout(800);
  const cont = pg.getByRole("button", { name: /verify|continue/i }).first();
  if (await cont.isVisible().catch(() => false)) await cont.click();
}

async function loginAs(pg, phone) {
  await pg.goto(`${FRONTEND}/login`);
  await pg.getByPlaceholder("e.g. 08012345678").fill(phone);
  await pg.locator('input[type="password"]').fill(PASSWORD);
  await pg.locator('button[type="submit"]').click();
  await pg.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 15000 });
}

// ── Journey 1: OWNER — register → create school → workspace nav → invite staff ──
async function ownerJourney(browser, shared) {
  console.log("\n── OWNER journey");
  const ctx = await browser.newContext();
  page = await ctx.newPage();
  const phone = freshPhone();
  shared.ownerPhone = phone;
  shared.schoolName = `QA Sunrise ${phone.slice(-4)}`;

  await step("owner: register + verify OTP", async () => {
    await registerAndVerify(page, { first: "Qa", last: "Owner", phone });
    await page.waitForURL(/login|dashboard/, { timeout: 15000 });
  });

  await step("owner: login lands on the Platform Home (no contexts)", async () => {
    if (!page.url().includes("/dashboard")) await loginAs(page, phone);
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    await page.getByText("Create a school").waitFor({ timeout: 10000 });
  });

  await step("owner: create school (form-first) → lands in /o/{slug}", async () => {
    await page.getByText("Create a school", { exact: false }).first().click();
    await page.getByPlaceholder("e.g. Divine Wisdom Citadel School").fill(shared.schoolName);
    await page.locator("select").first().selectOption({ index: 1 });
    await page.getByPlaceholder("e.g. Lagos").fill("Lagos");
    await page.getByRole("button", { name: "Create school" }).click();
    await page.waitForURL(/\/o\/[^/]+/, { timeout: 20000 });
    shared.slug = page.url().match(/\/o\/([^/?]+)/)[1];
  });

  await step("owner: workspace shell shows the school", async () => {
    await page.getByText(shared.schoolName, { exact: false }).first().waitFor({ timeout: 15000 });
  });

  await step("owner: dashboard shows LIVE stats (not mock)", async () => {
    await page.goto(`${FRONTEND}/o/${shared.slug}`);
    await page.getByText("Students Enrolled").waitFor({ timeout: 15000 });
    // A fresh school must show honest zeros — the old mock showed fabricated numbers.
    const stat = page
      .locator("div", { has: page.getByText("Students Enrolled") })
      .getByText(/^\d[\d,]*$/)
      .first();
    const value = (await stat.textContent())?.trim();
    if (value !== "0") throw new Error(`expected 0 enrolled students, saw "${value}" (mock data?)`);
  });

  for (const item of ["Students", "Classes"]) {
    await step(`owner: sidebar → ${item} stays inside /o/{slug}`, async () => {
      await page.getByRole("link", { name: item, exact: false }).first().click();
      await page.waitForTimeout(2500);
      if (!page.url().includes(`/o/${shared.slug}`)) {
        throw new Error(`left the workspace: ${page.url()}`);
      }
    });
  }

  await step("owner: sidebar → Finance ▸ Fee Types stays inside /o/{slug}", async () => {
    await page
      .getByRole("button", { name: /^Finance$/ })
      .or(page.locator('button:has-text("Finance"), [role="button"]:has-text("Finance")'))
      .first()
      .click(); // expand the group
    await page.getByRole("link", { name: "Fee Types" }).first().click();
    await page.waitForTimeout(2500);
    if (!page.url().includes(`/o/${shared.slug}`)) {
      throw new Error(`left the workspace: ${page.url()}`);
    }
  });

  await step("owner: attendance overview is LIVE (fresh school shows no mock arms)", async () => {
    await page.goto(`${FRONTEND}/o/${shared.slug}/attendance`);
    await page.getByText("Overall attendance").waitFor({ timeout: 15000 });
    // The old mock injected fabricated arms (JSS 1A…) into every school; a fresh school has none.
    const mockArm = await page.getByText(/JSS \d/).first().isVisible().catch(() => false);
    if (mockArm) throw new Error("attendance page shows arms a fresh school cannot have (mock data?)");
  });

  await step("owner: invite a staff member", async () => {
    shared.staffPhone = freshPhone();
    await page.goto(`${FRONTEND}/o/${shared.slug}/staff`);
    const inviteBtn = page.getByRole("button", { name: /invite staff/i }).first();
    await inviteBtn.waitFor({ timeout: 15000 });
    await inviteBtn.click();
    await page.getByPlaceholder("e.g. Amaka").fill("Qa");
    await page.getByPlaceholder("e.g. Adeyemi").fill("Teacher");
    await page.getByPlaceholder("e.g. 08012345678").fill(shared.staffPhone);
    // Role/Employment selects default to Teacher / Full-time — keep them.
    await page.getByRole("button", { name: "Send invitation" }).click();
    await page.waitForTimeout(2500); // SMS → log
    inviteLinkFor(shared.staffPhone); // throws if the invite SMS never appeared
  });

  await ctx.close();
}

// ── Journey 2: STAFF — /join with the SMS link → accept → same workspace ──
async function staffJourney(browser, shared) {
  console.log("\n── STAFF journey");
  const ctx = await browser.newContext();
  page = await ctx.newPage();

  await step("staff: invite link opens /join", async () => {
    const link = inviteLinkFor(shared.staffPhone);
    const url = new URL(link);
    await page.goto(`${FRONTEND}${url.pathname}${url.search}`);
    await page.waitForTimeout(2500);
  });

  await step("staff: enter the auto-sent OTP", async () => {
    const send = page.getByRole("button", { name: /send verification code/i });
    if (await send.isVisible().catch(() => false)) await send.click();
    await page.getByText(/verify your number/i).waitFor({ timeout: 15000 });
    await page.waitForTimeout(1200); // SMS → log
    const code = otpFor(shared.staffPhone);
    await page.locator("input:visible").first().click();
    await page.keyboard.type(code, { delay: 80 }); // boxes auto-advance
    const cont = page.getByRole("button", { name: /continue|verify/i }).first();
    await cont.click();
    await page.waitForTimeout(2500);
  });

  await step("staff: set password + accept", async () => {
    const pws = page.locator('input[type="password"]:visible');
    await pws.first().waitFor({ timeout: 15000 });
    const n = await pws.count();
    for (let i = 0; i < n; i++) await pws.nth(i).fill(PASSWORD);
    await page
      .getByRole("button", { name: /accept|join|continue|create|finish/i })
      .last()
      .click();
    await page.waitForTimeout(4000);
  });

  await step("staff: reaches the shared workspace", async () => {
    if (!page.url().includes(`/o/${shared.slug}`)) {
      // accept flows may land on select-context first — enter the workspace from there
      await page.goto(`${FRONTEND}/select-context`);
      await page.getByText(shared.schoolName, { exact: false }).first().click();
      await page.waitForURL(/\/o\/[^/]+/, { timeout: 20000 });
    }
    if (!page.url().includes(`/o/${shared.slug}`))
      throw new Error(`expected /o/${shared.slug}, got ${page.url()}`);
  });

  await ctx.close();
}

// ── Journey 3: FAMILY — register → become parent → add child (docs) → PIN ──
async function familyJourney(browser, shared) {
  console.log("\n── FAMILY journey");
  const ctx = await browser.newContext();
  page = await ctx.newPage();
  const phone = freshPhone();

  await step("family: register + verify + login → Platform Home", async () => {
    await registerAndVerify(page, { first: "Qa", last: "Parent", phone });
    await page.waitForURL(/login|dashboard/, { timeout: 15000 });
    if (!page.url().includes("/dashboard")) await loginAs(page, phone);
    await page.waitForURL(/dashboard/, { timeout: 15000 });
  });

  await step("family: Platform Home offers the capability cards", async () => {
    await page.getByText("Create a school").waitFor({ timeout: 10000 });
    await page.getByText("Use SchoolFlow as a parent").waitFor({ timeout: 5000 });
    await page.getByText("Find a school").waitFor({ timeout: 5000 });
  });

  await step("family: become a parent → family home renders on the identity session", async () => {
    await page.getByText("Use SchoolFlow as a parent").click();
    await page.waitForURL(/family/, { timeout: 20000 });
    await page.getByText(/Welcome, Qa/i).waitFor({ timeout: 15000 });
  });

  await step("family: add a child with photo + birth certificate", async () => {
    // KNOWN GAP: the My Children empty state has no "Add child" CTA — deep-link to the
    // save-mode form (EnrolStep2 without schoolId).
    await page.goto(`${FRONTEND}/family/enrol/child-info`);
    await page.getByText("Add a child").waitFor({ timeout: 15000 });

    const text = page.getByPlaceholder("Type it here");
    await text.nth(0).fill("Kid"); // first name
    await text.nth(2).fill(`QA${phone.slice(-3)}`); // last name (nth(1) is middle name)
    await page.locator('input[type="date"]').fill("2016-06-15");
    await page.locator("select").first().selectOption({ index: 1 });
    await page.getByText("Male", { exact: true }).click();
    await page
      .getByPlaceholder("List any allergies, health conditions, or special needs.")
      .fill("None");

    // Dropzones are hidden file inputs: photo, birth cert, (optional) medical doc.
    const files = page.locator('input[type="file"]');
    const count = await files.count();
    await files.nth(count - 3).setInputFiles({
      name: "photo.png", mimeType: "image/png", buffer: PNG,
    });
    await files.nth(count - 2).setInputFiles({
      name: "birth-cert.pdf", mimeType: "application/pdf", buffer: PDF,
    });

    await page.getByRole("button", { name: /save child/i }).click();
    await page.waitForURL(/children/, { timeout: 20000 });
    await page.getByText(`QA${phone.slice(-3)}`, { exact: false }).first().waitFor({ timeout: 15000 });
  });

  await step("family: set a payment PIN", async () => {
    await page.goto(`${FRONTEND}/family/settings`);
    const pins = page.locator('input[inputmode="numeric"][maxlength="6"]');
    await pins.nth(0).fill("246810");
    await pins.nth(1).fill("246810");
    await pins.nth(0).click(); // ensure the PIN section owns focus
    await page
      .locator('button:visible', { hasText: /pin/i })
      .or(page.getByRole("button", { name: /save pin|set pin/i }))
      .first()
      .click();
    await page.waitForTimeout(2500);
    await page.getByText(/PIN set/i).first().waitFor({ timeout: 10000 });
  });

  await step("family: directory lists verified schools, hides the pending-KYC one", async () => {
    await page.goto(`${FRONTEND}/family/schools`);
    // A verified school is discoverable…
    await page.getByText(/school(s)? found/i).first().waitFor({ timeout: 15000 });
    // …while the freshly created QA school (pending KYC) must NOT be listed.
    if (shared.schoolName) {
      const listed = await page
        .getByText(shared.schoolName, { exact: false })
        .first()
        .isVisible()
        .catch(() => false);
      if (listed) throw new Error("pending-KYC school leaked into the public directory");
    }
  });

  await ctx.close();
}

// ── main ──────────────────────────────────────────────────────────────────────
const which = process.argv[2] ?? "all";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
});
const shared = {};

try {
  if (which === "owner" || which === "all") await ownerJourney(browser, shared);
  if (which === "staff" || which === "all") await staffJourney(browser, shared);
  if (which === "family" || which === "all") await familyJourney(browser, shared);
} catch {
  // journey already logged its failing step; keep going to the summary
} finally {
  await browser.close();
}

console.log(`\n══ QA summary: ${run.pass.length} passed, ${run.fail.length} failed`);
for (const f of run.fail) console.log(`   ✗ ${f.name} — ${f.err.split("\n")[0]}`);
if (run.fail.length) {
  console.log(`   artifacts: ${ART}`);
  process.exit(1);
}

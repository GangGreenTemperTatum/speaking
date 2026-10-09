const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8081';

// Booting the panel costs ~12MB (wasm engine + shareware WAD) and a wasm compile, so the tests
// that exercise it get a wider budget and share one readiness gate.
const DOOM_BOOT_TIMEOUT = 60000;

async function startDoom(page) {
    const doomFrame = page.frameLocator('#doom-game');

    await page.locator('#doom-play').click();
    await expect(page.locator('#doom-start')).toBeHidden({ timeout: DOOM_BOOT_TIMEOUT });
    await expect.poll(async () => {
        const frame = page.frames().find(candidate => candidate.url().includes('/doom/'));
        return frame ? frame.evaluate(() => Boolean(window.Module?.calledRun)) : false;
    }, { timeout: DOOM_BOOT_TIMEOUT }).toBe(true);

    return doomFrame;
}

// Focusing through the frame handle rather than a frame locator: firefox's frameLocator actionability
// never resolves for the canvas even though it is visible, clickable and focusable.
async function focusGameCanvas(page) {
    const frame = page.frames().find(candidate => candidate.url().includes('/doom/'));
    await frame.evaluate(() => document.getElementById('canvas').focus());
}

test.describe('Doom Portfolio E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
    });

    test('should display header with title', async ({ page }) => {
        await expect(page.locator('.site-header h1')).toContainText('ADS DAWSON');
    });

    test('should show the Doom poster without loading the game runtime', async ({ page }) => {
        const doomRequests = [];
        page.on('request', request => {
            if (request.url().includes('/doom/')) doomRequests.push(request.url());
        });

        await page.reload({ waitUntil: 'load' });

        await expect(page.locator('#doom-start')).toBeVisible();
        await expect(page.locator('#doom-play')).toBeVisible();
        expect(await page.locator('#doom-game').getAttribute('src')).toBeNull();
        expect(page.frames().filter(frame => frame.url().includes('/doom/'))).toHaveLength(0);
        expect(doomRequests).toEqual([]);
    });

    test('should start Doom on request without taking over the screen', async ({ page }) => {
        test.setTimeout(120000);
        await startDoom(page);

        // Regression: the original bug replayed Emscripten's deferred fullscreen request on the
        // first click inside the game, so clicking it must not hand the screen to Doom.
        const panel = await page.locator('#doom-game').boundingBox();
        await page.mouse.click(panel.x + panel.width / 2, panel.y + panel.height / 2);
        await page.waitForTimeout(3000);

        expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
        await expect(page.locator('.site-header h1')).toBeVisible();
    });

    test('should toggle Doom fullscreen only when asked', async ({ page }) => {
        test.setTimeout(120000);
        await startDoom(page);

        await focusGameCanvas(page);
        await page.keyboard.press('f');
        await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement)), { timeout: 15000 }).toBe(true);

        await page.keyboard.press('f');
        await expect.poll(() => page.evaluate(() => document.fullscreenElement), { timeout: 15000 }).toBeNull();

        // the engine's own binding (Alt+Enter) goes through the same panel toggle
        await focusGameCanvas(page);
        await page.keyboard.down('Alt');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Alt');
        await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement)), { timeout: 15000 }).toBe(true);

        await page.keyboard.down('Alt');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Alt');
        await expect.poll(() => page.evaluate(() => document.fullscreenElement), { timeout: 15000 }).toBeNull();
    });

    test('should offer a retry when the game runtime cannot start', async ({ page }) => {
        test.setTimeout(120000);
        await page.route('**/chocolate-doom.wasm', route => route.abort('failed'));

        await page.locator('#doom-play').click();
        await expect(page.locator('#doom-start')).toBeVisible({ timeout: DOOM_BOOT_TIMEOUT });
        await expect(page.locator('#doom-start-copy')).toContainText('could not start');
        await expect(page.locator('#doom-play')).toBeEnabled();

        // once the runtime is reachable again, the same button starts the game
        await page.unroute('**/chocolate-doom.wasm');
        await startDoom(page);
    });

    test('should offer a restart after the game loses its graphics context', async ({ page }) => {
        test.setTimeout(120000);
        await startDoom(page);

        // the engine cannot survive a lost context, so the panel has to offer a restart
        const frame = page.frames().find(candidate => candidate.url().includes('/doom/'));
        await frame.evaluate(() => {
            const canvas = document.getElementById('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            gl.getExtension('WEBGL_lose_context').loseContext();
        });

        await expect(page.locator('#doom-start')).toBeVisible();
        await expect(page.locator('#doom-start-copy')).toContainText('lost its graphics context');
        await expect(page.locator('#doom-play')).toBeEnabled();

        await startDoom(page);
    });

    test('should focus Doom and accept movement and fire controls', async ({ page }) => {
        test.setTimeout(120000);
        await startDoom(page);

        await focusGameCanvas(page);
        await page.keyboard.down('ArrowUp');
        await page.waitForTimeout(150);
        await page.keyboard.up('ArrowUp');
        await page.keyboard.down('Control');
        await page.waitForTimeout(100);
        await page.keyboard.up('Control');
        await expect.poll(async () => {
            const frame = page.frames().find(candidate => candidate.url().includes('/doom/'));
            return frame ? frame.evaluate(() => document.activeElement?.id ?? null) : null;
        }, { timeout: 5000 }).toBe('canvas');
    });

    test('should hand keyboard focus to the game when Play is activated from the keyboard', async ({ page }) => {
        test.setTimeout(120000);
        await page.locator('#doom-play').focus();
        await page.keyboard.press('Enter');

        await expect(page.locator('#doom-start')).toBeHidden({ timeout: DOOM_BOOT_TIMEOUT });
        await expect.poll(async () => {
            const frame = page.frames().find(candidate => candidate.url().includes('/doom/'));
            return frame ? frame.evaluate(() => document.activeElement?.id ?? document.activeElement?.tagName) : null;
        }, { timeout: DOOM_BOOT_TIMEOUT }).toBe('canvas');
    });

    test('should display content tabs', async ({ page }) => {
        await expect(page.locator('[data-tab="conferences"]')).toBeVisible();
        await expect(page.locator('[data-tab="podcasts"]')).toBeVisible();
        await expect(page.locator('[data-tab="publications"]')).toBeVisible();
        await expect(page.locator('[data-tab="volunteering"]')).toBeVisible();
        await expect(page.locator('[data-tab="television"]')).toBeVisible();
        await expect(page.locator('[data-tab="cves"]')).toBeVisible();
    });

    test('should switch tabs when clicked', async ({ page }) => {
        await page.locator('[data-tab="podcasts"]').evaluate(button => button.click());
        await expect(page.locator('[data-tab="podcasts"]')).toHaveClass(/active/);
        
        await page.locator('[data-tab="publications"]').evaluate(button => button.click());
        await expect(page.locator('[data-tab="publications"]')).toHaveClass(/active/);
    });

    test('should render the CVE collection card and local detail link', async ({ page }) => {
        await page.locator('[data-tab="cves"]').evaluate(button => button.click());
        const card = page.locator('.content-card').first();
        await expect(card).toBeVisible();
        await expect(card).toHaveAttribute('href', 'cves.html?id=cve-2026-86490');
        await expect(card).toContainText('CVE-2026-86490');
    });

    test('should display content cards', async ({ page }) => {
        const cards = page.locator('.content-card');
        await expect(cards.first()).toBeVisible();
        expect(await cards.count()).toBeGreaterThan(0);
    });

    test('should filter content by year', async ({ page }) => {
        await page.selectOption('#year-filter', '2025');
        await page.waitForTimeout(300);
        
        const cards = page.locator('.content-card');
        const count = await cards.count();
        
        if (count > 0) {
            const year = await cards.first().locator('.content-card-year').textContent();
            expect(year).toBe('2025');
        }
    });

    test('should search content', async ({ page }) => {
        await page.fill('#search-input', 'OWASP');
        await page.waitForTimeout(300);
        
        const cards = page.locator('.content-card');
        expect(await cards.count()).toBeGreaterThan(0);
    });

    test('should navigate to content viewer when a local card is clicked', async ({ page }) => {
        const card = page.locator('.content-card[href*="content-viewer"]').first();
        await expect(card).toBeVisible();
        const href = await card.getAttribute('href');
        await page.goto(`${BASE_URL}/${href}`);
        await expect(page).toHaveURL(/content-viewer/);
    });

    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('#doom-game')).toBeVisible();
        await expect(page.locator('#doom-play')).toBeVisible();
        await expect(page.locator('.content-section')).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });

});

test.describe('Content Viewer E2E Tests', () => {
    test('should display content viewer page', async ({ page }) => {
        await page.goto(`${BASE_URL}/content-viewer.html?type=conference&org=apidays&year=2023`);
        await expect(page.locator('h1')).toBeVisible();
    });

    test('should have back button', async ({ page }) => {
        await page.goto(`${BASE_URL}/content-viewer.html?type=conference&org=apidays&year=2023`);
        await expect(page.locator('.back-link')).toBeVisible();
    });

    test('should render a conference case file with archived content', async ({ page }) => {
        await page.goto(`${BASE_URL}/content-viewer.html?type=conference&id=blackhat-2026`);
        await expect(page.locator('.content-entry')).toBeVisible();
        await expect(page.locator('#view-title')).toContainText('Black Hat USA');
        await expect(page.locator('#content-body')).toContainText('Kinetic Prompt Injection');
        await expect(page.locator('#files-list')).toBeVisible();
    });

    test('should render podcast, television, publication, and volunteering records', async ({ page }) => {
        const records = [
            ['podcast', 'critical-thinking-bbp-ep188-2026', 'Critical Thinking'],
            ['television', 'bbc-2026', 'BBC World Service'],
            ['publication', 'meta-fbdl-goes-agentic-2026', 'FBDL Goes Agentic'],
            ['volunteering', 'hackerone-us-south-ambassador', 'Brand Ambassador']
        ];

        for (const [type, id, title] of records) {
            await page.goto(`${BASE_URL}/content-viewer.html?type=${type}&id=${id}`);
            await expect(page.locator('.content-entry')).toBeVisible();
            await expect(page.locator('#view-title')).toContainText(title);
        }
    });

    test('should keep unified viewer content within a narrow viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(`${BASE_URL}/content-viewer.html?type=television&id=bbc-2026`);
        await expect(page.locator('.content-entry')).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });

    test('should show a recoverable state for an unknown record', async ({ page }) => {
        await page.goto(`${BASE_URL}/content-viewer.html?type=publication&id=missing-record`);
        await expect(page.locator('.content-error')).toContainText('Content not found');
        await expect(page.locator('.content-error a[href="index.html"]')).toBeVisible();
    });
});

test.describe('CVE Portfolio E2E Tests', () => {
    test('should display the published CVE case file', async ({ page }) => {
        await page.goto(`${BASE_URL}/cves.html?id=cve-2026-86490`);
        await expect(page.locator('h1')).toHaveText('Published CVE records');
        await expect(page.locator('.cve-entry h2')).toHaveText('CVE-2026-86490');
        await expect(page.locator('.badge-severity')).toContainText('MEDIUM / 6.5');
        await expect(page.locator('.cve-entry')).toContainText('CWE-863');
        await expect(page.locator('a[href="https://hackerone.com/reports/3692256"]').first()).toBeVisible();
    });

    test('should adapt the CVE case file to a narrow viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(`${BASE_URL}/cves.html?id=cve-2026-86490`);
        await expect(page.locator('.cve-entry')).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        await expect(page.locator('.back-link')).toBeVisible();
    });
});

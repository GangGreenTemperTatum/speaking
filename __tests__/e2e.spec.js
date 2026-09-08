const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8081';

test.describe('Flappy Portfolio E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
    });

    test('should display header with title', async ({ page }) => {
        await expect(page.locator('.site-header h1')).toContainText('ADS DAWSON');
    });

    test('should display game canvas', async ({ page }) => {
        await expect(page.locator('#game-canvas')).toBeVisible();
    });

    test('should display start screen overlay', async ({ page }) => {
        await expect(page.locator('#game-start')).toBeVisible();
        await expect(page.locator('#game-start h2')).toContainText('FLAPPY BIRD');
    });

    test('should hide start screen on click', async ({ page }) => {
        await page.click('#game-canvas');
        await expect(page.locator('#game-start')).toHaveClass(/hidden/);
    });

    test('should display score', async ({ page }) => {
        await expect(page.locator('.game-stats')).toContainText('0');
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
        await page.click('[data-tab="podcasts"]');
        await expect(page.locator('[data-tab="podcasts"]')).toHaveClass(/active/);
        
        await page.click('[data-tab="publications"]');
        await expect(page.locator('[data-tab="publications"]')).toHaveClass(/active/);
    });

    test('should render the CVE collection card and local detail link', async ({ page }) => {
        await page.click('[data-tab="cves"]');
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

        await Promise.all([
            page.waitForURL(/content-viewer/),
            card.click()
        ]);
    });

    test('should load a saved high score from localStorage', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('flappyHighScore', '7'));
        await page.reload();
        await expect(page.locator('#high-score')).toHaveText('7');
    });

    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('#game-canvas')).toBeVisible();
        await expect(page.locator('.content-section')).toBeVisible();
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

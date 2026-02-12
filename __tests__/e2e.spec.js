const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8080';

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
    });

    test('should switch tabs when clicked', async ({ page }) => {
        await page.click('[data-tab="podcasts"]');
        await expect(page.locator('[data-tab="podcasts"]')).toHaveClass(/active/);
        
        await page.click('[data-tab="publications"]');
        await expect(page.locator('[data-tab="publications"]')).toHaveClass(/active/);
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

    test('should navigate to content viewer when card clicked', async ({ page, context }) => {
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            page.click('.content-card:first-child')
        ]);
        
        await expect(newPage).toHaveURL(/content-viewer/);
    });

    test('should save high score to localStorage', async ({ page }) => {
        await page.click('#game-canvas');
        await page.waitForTimeout(100);
        
        const highScore = await page.evaluate(() => {
            return localStorage.getItem('flappyHighScore');
        });
        
        expect(highScore).not.toBeNull();
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
        await expect(page.locator('.btn-back')).toBeVisible();
    });
});

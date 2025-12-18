import { test, expect } from '@playwright/test';

test.describe('Prompt Master Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Prompt Master');
  });

  test('should allow searching for prompts', async ({ page }) => {
    // Wait for initial samples to load
    await expect(page.locator('.prompt-card').first()).toBeVisible({ timeout: 15000 });

    const searchInput = page.locator('input[placeholder="搜尋 prompts..."]');
    await searchInput.fill('AI');

    // Check if the grid updates
    const cards = page.locator('.prompt-card');
    await expect(cards.first()).toContainText('AI');
  });

  test('should navigate to collections page', async ({ page }) => {
    // Use the nav item specifically
    await page.locator('nav >> text=收藏集').click();
    await expect(page).toHaveURL(/\/collections/);
    await expect(page.locator('.main-content h2')).toContainText('收藏集');
  });
});

import { expect, test } from '@playwright/test';

test('dashboard redirects to sign-in when not authenticated', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/sign-in/);
});

test('seeded user can sign in and access dashboard', async ({ page }) => {
  await page.goto('/sign-in');

  await page.getByLabel('Email').fill('test@test.com');
  await page.getByLabel('Password').fill('admin123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('heading', { name: /Team Settings/i })).toBeVisible();
});

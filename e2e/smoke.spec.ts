import { expect, test } from '@playwright/test';

test('marketing home page renders', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /Build Your SaaS/i })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /Sign Up/i })).toBeVisible();
});

test('sign-in page renders required fields', async ({ page }) => {
  await page.goto('/sign-in');

  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});

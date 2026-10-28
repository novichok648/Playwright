import { test, expect } from '@playwright/test';

test('поиск на русской Википедии и переход к разделу статьи', async ({ page }) => {
  await test.step('Открыть главную страницу и проверить русский интерфейс', async () => {
    await page.goto('https://ru.wikipedia.org/');
    await expect(page.getByRole('heading', { name: /Добро пожаловать в Википедию/ })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: 'Искать в Википедии' })).toBeVisible();
  });

  await test.step('Найти статью через поисковую форму', async () => {
    const search = page.getByRole('searchbox', { name: 'Искать в Википедии' });
    await search.fill('Театр');
    await search.press('Enter');
    await expect(page).toHaveURL(/%D0%A2%D0%B5%D0%B0%D1%82%D1%80/);
    await expect(page.getByRole('heading', { name: 'Театр', exact: true })).toBeVisible();
    await expect(page.getByText('Родовое понятие «театр» включает в себя различные его виды и формы:')).toBeVisible();
  });

  await test.step('Перейти к разделу статьи и сохранить снимок экрана', async () => {
    const contents = page.getByRole('navigation', { name: 'Содержание' });
    await contents.getByRole('link', { name: 'История театра' }).click();
    await expect(page.locator('#История_театра')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'История театра', exact: true })).toBeVisible();
    await page.screenshot({ path: 'screenshots/test-passed.png', fullPage: true });
  });
});

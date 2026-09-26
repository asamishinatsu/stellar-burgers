import { expect, test } from '@playwright/test';

const bun = { id: 'test-bun-001', name: 'Тестовая булка' };
const filling = { id: 'test-main-001', name: 'Тестовая начинка' };
const sauce = { id: 'test-sauce-001', name: 'Тестовый соус' };
const orderNumber = 12345;
const accessToken = 'Bearer test-access-token';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/**', (route) => route.abort());
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
      notFound: 'abort',
    });
    await page.routeFromHAR('tests/hars/auth-user.har', {
      url: '**/api/auth/user',
      update: false,
      notFound: 'abort',
    });
    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/orders',
      update: false,
      notFound: 'abort',
    });
    await page.routeFromHAR('tests/hars/orders-all.har', {
      url: '**/api/orders/all',
      update: false,
      notFound: 'abort',
    });
  });

  test('добавляет булку и начинки в конструктор', async ({ page }) => {
    await page.goto('/');

    const ingredients = page.getByTestId('ingredients-content');
    const constructor = page.getByTestId('constructor');
    const fillingList = page.getByTestId('constructor-ingredients');

    await ingredients
      .getByRole('listitem')
      .filter({ hasText: bun.name })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(constructor.getByTestId('constructor-bun-1')).toContainText(
      bun.name + ' (верх)'
    );
    await expect(constructor.getByTestId('constructor-bun-2')).toContainText(
      bun.name + ' (низ)'
    );

    await ingredients
      .getByRole('listitem')
      .filter({ hasText: filling.name })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await ingredients
      .getByRole('listitem')
      .filter({ hasText: sauce.name })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(fillingList.getByRole('listitem')).toHaveCount(2);
    await expect(fillingList).toContainText(filling.name);
    await expect(fillingList).toContainText(sauce.name);
  });

  test('открывает окно ингредиента и закрывает его крестиком', async ({ page }) => {
    await page.goto('/');
    await page
      .getByTestId('ingredients-content')
      .getByRole('link', { name: filling.name })
      .click();

    const modal = page.locator('#modals');
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(modal.getByRole('heading', { name: filling.name })).toBeVisible();
    await expect(modal.getByText('150', { exact: true })).toBeVisible();
    await expect(modal.getByRole('heading', { name: bun.name })).toHaveCount(0);
    await expect(page).toHaveURL(/\/ingredients\/test-main-001$/);

    await modal.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modal.getByRole('heading', { name: 'Детали ингредиента' })).toHaveCount(
      0
    );
    await expect(page).toHaveURL('/');
  });

  test('закрывает окно ингредиента кликом по оверлею', async ({ page }) => {
    await page.goto('/');
    await page
      .getByTestId('ingredients-content')
      .getByRole('link', { name: bun.name })
      .click();

    const modal = page.locator('#modals');
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await modal.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(modal.getByRole('heading', { name: 'Детали ингредиента' })).toHaveCount(
      0
    );
    await expect(page).toHaveURL('/');
  });

  test('создаёт заказ, очищает конструктор и закрывает окно заказа', async ({
    page,
    context,
    baseURL,
  }) => {
    if (!baseURL) throw new Error('Для авторизации нужен Playwright baseURL');

    await context.addCookies([
      {
        name: 'accessToken',
        value: accessToken,
        url: baseURL,
      },
    ]);
    await page.addInitScript(
      (token) => localStorage.setItem('refreshToken', token),
      'test-refresh-token'
    );

    await page.goto('/');
    const ingredients = page.getByTestId('ingredients-content');
    const constructor = page.getByTestId('constructor');
    await ingredients
      .getByRole('listitem')
      .filter({ hasText: bun.name })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await ingredients
      .getByRole('listitem')
      .filter({ hasText: filling.name })
      .getByRole('button', { name: 'Добавить' })
      .click();

    const orderRequest = page.waitForRequest(
      (request) => request.url().endsWith('/api/orders') && request.method() === 'POST'
    );
    await constructor.getByRole('button', { name: 'Оформить заказ' }).click();
    const request = await orderRequest;
    expect(request.headers().authorization).toBe(accessToken);
    expect(request.postDataJSON()).toEqual({ ingredients: [bun.id, filling.id] });

    const modal = page.locator('#modals');
    await expect(modal.getByTestId('order-number')).toHaveText(String(orderNumber));
    await expect(constructor.getByTestId('constructor-bun-1')).toHaveCount(0);
    await expect(constructor.getByTestId('constructor-bun-2')).toHaveCount(0);
    await expect(constructor.getByTestId('constructor-ingredients')).toContainText(
      'Выберите начинку'
    );
    await expect(constructor.getByText('Выберите булки')).toHaveCount(2);

    await modal.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modal.getByTestId('order-number')).toHaveCount(0);
  });
});

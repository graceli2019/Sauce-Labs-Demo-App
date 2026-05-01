import { test, expect, request, APIRequestContext } from '@playwright/test';

// Example: API base URL (update as needed)
const BASE_URL = 'https://www.saucedemo.com/api';

test.describe('API: Authentication', () => {
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext({ baseURL: BASE_URL });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('should fail login with invalid credentials', async () => {
    const response = await apiContext.post('/login', {
      data: { username: 'invalid', password: 'wrong' },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toContain('Username and password do not match');
  });

  test('should login successfully with valid credentials', async () => {
    const response = await apiContext.post('/login', {
      data: { username: 'standard_user', password: 'secret_sauce' },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.token).toBeDefined();
  });
});

test.describe('API: Inventory', () => {
  let apiContext: APIRequestContext;
  let token: string;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext({ baseURL: BASE_URL });
    // Login to get token
    const loginRes = await apiContext.post('/login', {
      data: { username: 'standard_user', password: 'secret_sauce' },
    });
    const loginBody = await loginRes.json();
    token = loginBody.token;
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('should fetch inventory list', async () => {
    const response = await apiContext.get('/inventory', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);
  });
});

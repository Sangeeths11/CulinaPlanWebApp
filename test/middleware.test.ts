import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { setup, createPage } from '@nuxt/test-utils';

// Mock Supabase Auth
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      session: vi.fn(() => null)
    }
  })
}));

describe('Auth Middleware Test', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('..', import.meta.url)),
    server: true
  });

  it('Redirects non-authenticated user from protected page', async () => {
    const page = await createPage('/overview');
 
    const url = new URL(page.url());
    expect(url.pathname).toBe('/login');
  });
});

/**
 * Playwright E2Eテスト設定
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // テストディレクトリ
  testDir: './e2e',

  // 並列実行
  fullyParallel: true,

  // CI環境ではリトライしない
  retries: process.env.CI ? 2 : 0,

  // 並列ワーカー数
  workers: process.env.CI ? 1 : undefined,

  // レポーター
  reporter: 'html',

  // 共通設定
  use: {
    // 開発サーバーのURL
    baseURL: 'http://localhost:3000',

    // スクリーンショット（失敗時のみ）
    screenshot: 'only-on-failure',

    // トレース（失敗時のみ）
    trace: 'on-first-retry',

    // ビューポート
    viewport: { width: 1280, height: 720 },
  },

  // プロジェクト（ブラウザ）設定
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // モバイルテスト（ナビゲーションテストのみ）
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
      testMatch: '**/navigation.spec.ts',
    },
  ],

  // 開発サーバー自動起動
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

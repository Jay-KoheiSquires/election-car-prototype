/**
 * ナビゲーション E2Eテスト
 * TC-NAV-001 〜 TC-NAV-002
 */
import { test, expect } from "@playwright/test";

test.describe("ナビゲーション", () => {
  test.describe("デスクトップ", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("TC-NAV-001: ヘッダーメニュー遷移", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(500);

      // ヘッダーが表示される
      await expect(page.locator("header")).toBeVisible();

      // ロゴが表示される
      await expect(page.locator("header").getByText("選挙カーレンタルラボ")).toBeVisible();

      // よくある質問メニューをクリック
      await page.locator("header").getByText("よくある質問").click();
      await page.waitForTimeout(500);

      // /faqに遷移（末尾スラッシュを許容）
      await expect(page).toHaveURL(/\/faq\/?$/);
    });

    test("TC-NAV-002: 導入事例ページ遷移", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(500);

      // 導入事例メニューをクリック
      await page.locator("header").getByText("導入事例").click();
      await page.waitForTimeout(500);

      // /casesに遷移
      await expect(page).toHaveURL(/\/cases\/?$/);
    });

    test("TC-NAV-003: ロゴクリックでトップへ", async ({ page }) => {
      await page.goto("/faq");
      await page.waitForTimeout(500);

      // ロゴをクリック（円の「選」の文字を含む要素）
      await page.locator("header a").first().click();
      await page.waitForTimeout(500);

      // トップに遷移
      await expect(page).toHaveURL(/^http:\/\/localhost:3000\/?$/);
    });

    test("TC-NAV-004: フッターリンク", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(500);

      // フッターが表示される
      await expect(page.locator("footer")).toBeVisible();
      await expect(page.getByText("© 2024 選挙カーレンタルラボ")).toBeVisible();

      // フッターのよくある質問リンクをクリック
      await page.locator("footer").getByText("よくある質問").click();
      await page.waitForTimeout(500);

      // /faqに遷移
      await expect(page).toHaveURL(/\/faq\/?$/);
    });
  });

  test.describe("モバイル", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("TC-NAV-005: モバイルメニュー", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(500);

      // ハンバーガーメニューボタンをクリック
      const menuButton = page.locator("header button").last();
      await menuButton.click();
      await page.waitForTimeout(500);

      // ドロワーが開く
      await expect(page.getByText("メニュー")).toBeVisible();

      // メニュー項目が表示される
      await expect(page.locator(".MuiDrawer-root").getByText("よくある質問")).toBeVisible();

      // よくある質問をクリック
      await page.locator(".MuiDrawer-root").getByText("よくある質問").click();
      await page.waitForTimeout(500);

      // /faqに遷移
      await expect(page).toHaveURL(/\/faq\/?$/);
    });

    test("TC-NAV-006: モバイルメニュー閉じる", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(500);

      // ハンバーガーメニューをクリック
      const menuButton = page.locator("header button").last();
      await menuButton.click();
      await page.waitForTimeout(500);

      // ドロワーが開く
      await expect(page.getByText("メニュー")).toBeVisible();

      // 閉じるボタンをクリック
      await page.locator(".MuiDrawer-root").locator("button").first().click();
      await page.waitForTimeout(500);

      // ドロワーが閉じる（メニューテキストが見えなくなる）
      await expect(page.locator(".MuiDrawer-paper")).not.toBeVisible();
    });
  });
});

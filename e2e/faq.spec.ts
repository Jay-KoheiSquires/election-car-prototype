/**
 * FAQページ E2Eテスト
 * TC-FAQ-001 〜 TC-FAQ-003
 */
import { test, expect } from "@playwright/test";

test.describe("FAQページ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/faq");
    await page.waitForTimeout(500);
  });

  test("TC-FAQ-001: キーワード検索", async ({ page }) => {
    // タイトルが表示される
    await expect(page.getByRole("heading", { name: "よくある質問（FAQ）" })).toBeVisible();

    // 検索ボックスが表示される
    const searchInput = page.locator('input[placeholder*="キーワード"]');
    await expect(searchInput).toBeVisible();

    // 「公費負担」と入力
    await searchInput.fill("公費負担");
    await page.waitForTimeout(500);

    // 公費負担に関するFAQ項目が表示される
    await expect(page.getByText("公費負担制度について教えてください")).toBeVisible();
  });

  test("TC-FAQ-002: カテゴリフィルター", async ({ page }) => {
    // カテゴリチップが表示される
    const chips = page.locator(".MuiChip-root");
    const chipCount = await chips.count();
    expect(chipCount).toBeGreaterThan(0);

    // 最初のチップ（すべて）が表示される
    await expect(chips.first()).toBeVisible();
  });

  test("TC-FAQ-003: アコーディオン開閉", async ({ page }) => {
    // FAQ項目を探す
    const accordionHeader = page.locator(".MuiAccordionSummary-root").first();

    // クリック前は詳細が見えない
    await expect(accordionHeader).toBeVisible();

    // アコーディオンをクリック
    await accordionHeader.click();
    await page.waitForTimeout(500);

    // 回答（AccordionDetails）が表示される
    await expect(page.locator(".MuiAccordionDetails-root").first()).toBeVisible();
  });

  test("TC-FAQ-004: お問い合わせセクション表示", async ({ page }) => {
    // お問い合わせセクションが表示される
    await expect(page.getByText("お探しの回答が見つかりませんか？")).toBeVisible();

    // 電話リンクが表示される
    await expect(page.locator("a[href*='tel']")).toBeVisible();

    // メールリンクが表示される
    await expect(page.locator("a[href*='mailto']")).toBeVisible();
  });

  test("TC-FAQ-005: シミュレーションに戻るボタン", async ({ page }) => {
    // 「シミュレーションに戻る」ボタンが表示される
    const backButton = page.locator("button:has-text('シミュレーションに戻る')");
    await expect(backButton).toBeVisible();

    // クリックしてトップページに遷移
    await backButton.click();
    await expect(page).toHaveURL(/^http:\/\/localhost:3000\/?$/);
  });
});

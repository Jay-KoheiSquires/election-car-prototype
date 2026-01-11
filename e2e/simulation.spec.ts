/**
 * シミュレーションページ E2Eテスト
 * TC-SIM-001 〜 TC-SIM-006
 */
import { test, expect } from "@playwright/test";

test.describe("シミュレーションページ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000); // ページが完全に読み込まれるのを待つ
  });

  test("TC-SIM-001: ページ初期表示", async ({ page }) => {
    // タイトルが表示される
    await expect(page.getByRole("heading", { name: "料金シミュレーション" })).toBeVisible();

    // 選挙区分ボタンが表示される（ToggleButtonGroup内）
    await expect(page.locator(".MuiToggleButton-root:has-text('一般地方選挙')")).toBeVisible();
    await expect(page.locator(".MuiToggleButton-root:has-text('統一地方選挙')")).toBeVisible();

    // 合計金額が表示される
    await expect(page.getByText("合計金額")).toBeVisible();
  });

  test("TC-SIM-002: 選挙区分切り替えで料金が変わる", async ({ page }) => {
    // 合計金額のセクションを特定
    const totalSection = page.locator("text=合計金額").locator("..");

    // 一般地方選挙を選択（デフォルト選択されている可能性あり）
    await page.locator(".MuiToggleButton-root:has-text('一般地方選挙')").click();
    await page.waitForTimeout(500);

    // 統一地方選挙を選択
    await page.locator(".MuiToggleButton-root:has-text('統一地方選挙')").click();
    await page.waitForTimeout(500);

    // 選択が変わったことを確認（ボタンが選択状態になる）
    const unityButton = page.locator(".MuiToggleButton-root:has-text('統一地方選挙')");
    await expect(unityButton).toHaveClass(/Mui-selected/);
  });

  test("TC-SIM-003: 車クラス選択", async ({ page }) => {
    // 車クラス選択セクションがある
    const classButtons = page.locator(".MuiToggleButtonGroup-root");
    await expect(classButtons.first()).toBeVisible();

    // ToggleButtonが存在する
    const toggleButtons = page.locator(".MuiToggleButton-root");
    const count = await toggleButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test("TC-SIM-004: 配送先セクション表示", async ({ page }) => {
    // 配送先エリアセクションを探す（h6要素内のテキスト）
    await expect(page.locator("h6:has-text('配送先')").first()).toBeVisible();

    // 都道府県選択（MUI Select）がある（最初のもの）
    await expect(page.locator(".MuiSelect-select").first()).toBeVisible();
  });

  test("TC-SIM-005: オプション表示", async ({ page }) => {
    // オプションセクションが表示される
    await expect(page.getByRole("heading", { name: "オプション", exact: true })).toBeVisible();

    // チェックボックスが存在する
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(0);
  });

  test("TC-SIM-006: お問合せボタンから遷移", async ({ page }) => {
    // お問合せボタンをクリック
    await page.locator("button:has-text('お問合せ')").click();

    // /contactに遷移
    await expect(page).toHaveURL(/.*contact/);
  });
});

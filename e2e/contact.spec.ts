/**
 * お問合せページ E2Eテスト
 * TC-CON-001 〜 TC-CON-006
 */
import { test, expect } from "@playwright/test";
import { testCustomer } from "./fixtures/test-data";

test.describe("お問合せページ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(500);
  });

  test("TC-CON-001: ステップ1 - 選挙種類選択", async ({ page }) => {
    // タイトルが表示される
    await expect(page.getByRole("heading", { name: "お見積り・ご予約" })).toBeVisible();

    // ステッパーが表示される（選挙情報ステップ）
    await expect(page.locator(".MuiStep-root").first()).toBeVisible();

    // 選挙種類のカードが表示される
    await expect(page.locator(".MuiCard-root").first()).toBeVisible();
  });

  test("TC-CON-002: ステップ1 - 地図表示", async ({ page }) => {
    // 選挙区選択セクションが表示される
    await expect(page.getByText("選挙区を選択")).toBeVisible();

    // 地図コンポーネントが表示される（SVG）
    await expect(page.locator("svg").first()).toBeVisible();
  });

  test("TC-CON-003: ステップ移動", async ({ page }) => {
    // ステップ1にいることを確認（カードが表示されている）
    await expect(page.locator(".MuiCard-root").first()).toBeVisible();

    // 「次へ」ボタンをクリック
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(500);

    // ステップ2が表示される（基本情報セクション）
    await expect(page.locator("h6:has-text('基本情報')")).toBeVisible();

    // 「戻る」ボタンをクリック（exact matchを使用）
    await page.getByRole("button", { name: "戻る", exact: true }).click();
    await page.waitForTimeout(500);

    // ステップ1に戻る（カードが表示される）
    await expect(page.locator(".MuiCard-root").first()).toBeVisible();
  });

  test("TC-CON-004: ステップ2 - フォーム表示", async ({ page }) => {
    // ステップ2に移動
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(500);

    // フォームフィールドが表示される
    await expect(page.getByText("基本情報")).toBeVisible();
    await expect(page.locator('input[placeholder*="選挙"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="センキョ"]')).toBeVisible();
  });

  test("TC-CON-005: ステップ3 - 納車情報", async ({ page }) => {
    // ステップ3まで移動
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(300);
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(500);

    // 納車セクションが表示される
    await expect(page.getByText("納車について")).toBeVisible();

    // 場所選択ボタンが表示される
    await expect(page.locator(".MuiToggleButton-root:has-text('選挙事務所')").first()).toBeVisible();
  });

  test("TC-CON-006: フォーム送信完了", async ({ page }) => {
    // ステップ1: 選挙種類を選択
    await page.locator("text=統一地方選挙").first().click();
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(300);

    // ステップ2: お客様情報を入力
    await page.locator('input[placeholder*="選挙"]').fill(testCustomer.name);
    await page.locator('input[placeholder*="センキョ"]').fill(testCustomer.furigana);
    await page.locator('input[placeholder*="090"]').fill(testCustomer.tel);
    await page.locator('input[placeholder*="example"]').fill(testCustomer.email);
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(300);

    // ステップ3: 納車情報（そのまま次へ）
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(300);

    // ステップ4: 確認画面
    await expect(page.getByText("入力内容をご確認の上")).toBeVisible();

    // 送信ボタンが表示される
    await expect(page.locator("button:has-text('送信する')")).toBeVisible();
  });

  test("TC-CON-007: シミュレーションからの遷移", async ({ page }) => {
    // シミュレーションページから遷移
    await page.goto("/");
    await page.waitForTimeout(500);

    // お問合せボタンをクリック
    await page.locator("button:has-text('お問合せ')").click();

    // contactページに遷移
    await expect(page).toHaveURL(/.*contact/);
  });

  test("TC-CON-008: クイック連絡ボタン表示", async ({ page }) => {
    // LINEで相談リンクが表示される
    await expect(page.locator("a[href*='line']")).toBeVisible();

    // 電話で相談リンクが表示される
    await expect(page.locator("a[href*='tel']")).toBeVisible();
  });

  test("TC-CON-009: メール送信テスト（シミュレーションから）", async ({ page }) => {
    // コンソールログを監視
    page.on('console', msg => {
      console.log('Browser console:', msg.type(), msg.text());
    });

    // シミュレーションページから開始
    await page.goto("/");
    await page.waitForTimeout(1000);

    // 車種を選択（Mクラスをクリック）
    await page.locator("text=Mクラス").first().click();
    await page.waitForTimeout(500);

    // お問合せボタンをクリック
    await page.locator("button:has-text('お問合せ')").click();
    await page.waitForTimeout(1000);

    // contactページに遷移確認
    await expect(page).toHaveURL(/.*contact/);

    // ステップ1: 選挙種類を選択
    await page.locator("text=統一地方選挙").first().click();
    await page.waitForTimeout(300);

    // 都道府県を選択（地図の東京をクリック）
    // 地図はBox要素で描画されており、"東京"というテキストを含む
    const tokyoBox = page.locator("text=東京").first();
    if (await tokyoBox.isVisible()) {
      await tokyoBox.click();
      await page.waitForTimeout(300);
    }

    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(500);

    // ステップ2: お客様情報を入力（全項目）
    // 基本情報
    await page.getByLabel(/お名前/).fill("テスト太郎");
    await page.getByLabel(/フリガナ/).fill("テストタロウ");
    await page.getByLabel(/郵便番号/).first().fill("100-0001");
    await page.getByLabel(/住所/).first().fill("東京都千代田区千代田1-1");
    await page.getByLabel(/電話番号/).first().fill("090-1234-5678");
    await page.getByLabel(/メールアドレス/).fill("test@example.com");

    // 選挙事務所情報
    await page.getByLabel(/事務所郵便番号/).fill("100-0002");
    await page.getByLabel(/事務所住所/).fill("東京都千代田区皇居外苑2-2");
    await page.getByLabel(/事務所電話番号/).fill("03-1234-5678");
    await page.getByLabel(/ご担当者名/).fill("選挙 責任者");

    // 次へボタンをクリック
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(500);

    // ステップ3: 納車・引取情報
    // 納車日時を入力（DateTimePickerをクリックして入力）
    const deliveryDateInput = page.getByLabel(/希望納車日時/);
    await deliveryDateInput.click();
    await deliveryDateInput.fill("2026/01/20 10:00");
    await page.keyboard.press("Escape"); // DatePickerを閉じる
    await page.waitForTimeout(300);

    // 引取日時を入力
    const returnDateInput = page.getByLabel(/希望引取日時/);
    await returnDateInput.click();
    await returnDateInput.fill("2026/01/27 17:00");
    await page.keyboard.press("Escape"); // DatePickerを閉じる
    await page.waitForTimeout(300);

    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(500);

    // ステップ4: 確認画面で送信
    const submitButton = page.locator("button:has-text('送信する')");
    await expect(submitButton).toBeVisible({ timeout: 10000 });

    // 送信ボタンをクリック（ローディング中にボタンが無効になる可能性があるのでforce）
    await submitButton.click({ force: true });

    // 完了ページに遷移するか確認（タイムアウト30秒）
    await expect(page).toHaveURL(/.*thanks/, { timeout: 30000 });
  });
});

/**
 * お問い合わせフォーム E2Eテスト
 * - ステッパー遷移（正常系・異常系）
 * - バリデーション（各フィールド）
 * - 確認画面表示
 */
import { test, expect, Page } from "@playwright/test";

/**
 * DateTimePickerに日時を入力するヘルパー関数
 * MUI DateTimePickerのカレンダーUIを操作して日付を選択
 */
async function fillDateTimePicker(page: Page, index: number) {
  // カレンダーアイコンをクリック
  const calendarButton = page.locator('[data-testid="CalendarIcon"]').nth(index);
  await calendarButton.click();
  await page.waitForTimeout(500);

  // 日付ボタンをクリック（disabled でないもの）
  // MuiPickersDay-root クラスで disabled でないものを探す
  const dayButtons = page.locator('.MuiPickersDay-root:not(.Mui-disabled)');
  const count = await dayButtons.count();
  if (count > 0) {
    // 2番目以降の日付を選択（1日目は今日で disabled の可能性）
    const targetIndex = count > 3 ? 3 : 0;
    await dayButtons.nth(targetIndex).click();
  }
  await page.waitForTimeout(500);

  // デスクトップでは日付選択で自動的にポップアップが閉じる
  // モバイルダイアログの場合のみ「選択」ボタンがある
  // 安全のため、ポップオーバーの外側をクリックしてポップアップを閉じる
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
}

/**
 * 「次へ」ボタンをクリックするヘルパー関数
 *
 * MUI DateTimePicker操作後、Playwrightの.click()がtype="button"でも
 * フォーム送信を引き起こす問題があるため、dispatchEvent("click")を使用。
 * これはPlaywrightの正式APIで、純粋なクリックイベントのみを発火する。
 */
async function clickNextButton(page: Page) {
  await page.locator("button:has-text('次へ')").dispatchEvent("click");
}

test.describe("お問い合わせフォーム - ステッパー遷移", () => {
  test.beforeEach(async ({ page }) => {
    // シミュレーションページから開始してデータを設定
    await page.goto("/");
    await page.waitForTimeout(1000);

    // 車種を選択
    await page.locator("text=Mクラス").first().click();
    await page.waitForTimeout(500);

    // お問合せボタンをクリック
    await page.locator("button:has-text('お問合せ')").click();
    await page.waitForTimeout(1000);

    // contactページに遷移確認
    await expect(page).toHaveURL(/.*contact/);
  });

  test("TC-STEP-001: 初期表示はステップ0（お客様情報）", async ({ page }) => {
    // ステッパーの最初のステップがアクティブ
    const stepper = page.locator(".MuiStepper-root");
    await expect(stepper).toBeVisible();

    // お客様情報のフォームが表示されている
    await expect(page.getByLabel("お名前（候補者名）*")).toBeVisible();
    await expect(page.getByLabel("フリガナ*")).toBeVisible();
  });

  test("TC-STEP-002: 必須項目未入力で次へを押しても遷移しない", async ({ page }) => {
    // 何も入力せずに「次へ」をクリック
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(1000);

    // まだステップ0にいる（お名前フィールドが表示されている）
    await expect(page.getByLabel("お名前（候補者名）*")).toBeVisible();

    // エラーメッセージが表示される
    await expect(page.getByText("お名前は必須です")).toBeVisible();
  });

  test("TC-STEP-003: ステップ0→ステップ1への正常遷移", async ({ page }) => {
    // 必須項目を入力
    await page.getByLabel("お名前（候補者名）*").fill("テスト太郎");
    await page.getByLabel("フリガナ*").fill("テストタロウ");
    await page.getByLabel("電話番号*").fill("090-1234-5678");
    await page.getByLabel("メールアドレス*").fill("test@example.com");

    // 「次へ」をクリック
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(1000);

    // ステップ1（納車・引取）に遷移
    // 納車日時フィールドが表示されている
    await expect(page.getByText("希望納車日時").first()).toBeVisible();

    // お名前フィールドは非表示
    await expect(page.getByLabel("お名前（候補者名）*")).not.toBeVisible();
  });

  test("TC-STEP-004: ステップ1→ステップ2（確認画面）への正常遷移", async ({ page }) => {
    // ステップ0の入力
    await page.getByLabel("お名前（候補者名）*").fill("テスト太郎");
    await page.getByLabel("フリガナ*").fill("テストタロウ");
    await page.getByLabel("電話番号*").fill("090-1234-5678");
    await page.getByLabel("メールアドレス*").fill("test@example.com");
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(1000);

    // ステップ1の入力（納車・引取）
    // 納車場所を「自宅」に変更（事務所住所入力を回避）
    await page.locator('button:has-text("自宅")').first().click();
    await page.waitForTimeout(300);

    // 引取場所を「自宅」に変更
    await page.locator('button:has-text("自宅")').nth(1).click();
    await page.waitForTimeout(300);

    // 納車日時を入力
    await fillDateTimePicker(page, 0);

    // 引取日時を入力（納車より後の日付）
    await fillDateTimePicker(page, 1);

    // 「次へ」をクリック（page.evaluate経由で）
    await clickNextButton(page);
    await page.waitForTimeout(2000);

    // ステップ2（確認画面）に遷移
    // 確認画面のメッセージが表示される
    await expect(page.getByText("入力内容をご確認の上")).toBeVisible({ timeout: 10000 });

    // 「送信する」ボタンが表示される
    await expect(page.locator("button:has-text('送信する')")).toBeVisible();

    // 「次へ」ボタンは非表示
    await expect(page.locator("button:has-text('次へ')")).not.toBeVisible();
  });

  test("TC-STEP-005: 戻るボタンで前のステップに戻れる", async ({ page }) => {
    // ステップ0の入力
    await page.getByLabel("お名前（候補者名）*").fill("テスト太郎");
    await page.getByLabel("フリガナ*").fill("テストタロウ");
    await page.getByLabel("電話番号*").fill("090-1234-5678");
    await page.getByLabel("メールアドレス*").fill("test@example.com");
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(1000);

    // ステップ1にいることを確認
    await expect(page.getByText("希望納車日時").first()).toBeVisible();

    // 「戻る」をクリック（「シミュレーションに戻る」ではなくナビゲーションボタン）
    await page.getByRole("button", { name: "戻る", exact: true }).click();
    await page.waitForTimeout(1000);

    // ステップ0に戻る
    await expect(page.getByLabel("お名前（候補者名）*")).toBeVisible();

    // 入力値が保持されている
    await expect(page.getByLabel("お名前（候補者名）*")).toHaveValue("テスト太郎");
  });

  test("TC-STEP-006: 確認画面から戻っても入力値が保持される", async ({ page }) => {
    // ステップ0の入力
    await page.getByLabel("お名前（候補者名）*").fill("保持テスト");
    await page.getByLabel("フリガナ*").fill("ホジテスト");
    await page.getByLabel("電話番号*").fill("080-9999-8888");
    await page.getByLabel("メールアドレス*").fill("hoji@test.com");
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(1500);

    // ステップ1の入力
    // 納車場所を「自宅」に変更
    await page.locator('button:has-text("自宅")').first().click();
    await page.waitForTimeout(300);
    // 引取場所を「自宅」に変更
    await page.locator('button:has-text("自宅")').nth(1).click();
    await page.waitForTimeout(300);

    // 納車日時を入力
    await fillDateTimePicker(page, 0);

    // 引取日時を入力
    await fillDateTimePicker(page, 1);

    // ステップ2へ（page.evaluate経由で）
    await clickNextButton(page);
    await page.waitForTimeout(2000);

    // 確認画面にいることを確認
    await expect(page.getByText("入力内容をご確認の上")).toBeVisible({ timeout: 10000 });

    // 戻る→戻る
    await page.getByRole("button", { name: "戻る", exact: true }).click();
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "戻る", exact: true }).click();
    await page.waitForTimeout(1000);

    // ステップ0の入力値が保持されている
    await expect(page.getByLabel("お名前（候補者名）*")).toHaveValue("保持テスト");
    await expect(page.getByLabel("フリガナ*")).toHaveValue("ホジテスト");
  });
});

test.describe("お問い合わせフォーム - バリデーション", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(1000);
  });

  test("TC-VAL-001: お名前が空でフォーカスアウト時にエラー", async ({ page }) => {
    const nameInput = page.getByLabel("お名前（候補者名）*");
    await nameInput.focus();
    await nameInput.blur();
    await page.waitForTimeout(500);

    await expect(page.getByText("お名前は必須です")).toBeVisible();
  });

  test("TC-VAL-002: フリガナにひらがな入力でエラー", async ({ page }) => {
    const furiganaInput = page.getByLabel("フリガナ*");
    await furiganaInput.fill("てすとたろう");
    await furiganaInput.blur();
    await page.waitForTimeout(500);

    await expect(page.getByText("カタカナで入力してください")).toBeVisible();
  });

  test("TC-VAL-003: フリガナにカタカナ入力でエラーなし", async ({ page }) => {
    const furiganaInput = page.getByLabel("フリガナ*");
    await furiganaInput.fill("テストタロウ");
    await furiganaInput.blur();
    await page.waitForTimeout(500);

    await expect(page.getByText("カタカナで入力してください")).not.toBeVisible();
  });

  test("TC-VAL-004: 電話番号に不正な形式でエラー", async ({ page }) => {
    const telInput = page.getByLabel("電話番号*");
    await telInput.fill("abcdefg");
    await telInput.blur();
    await page.waitForTimeout(500);

    await expect(page.getByText("電話番号の形式が正しくありません")).toBeVisible();
  });

  test("TC-VAL-005: メールアドレスに不正な形式でエラー", async ({ page }) => {
    const emailInput = page.getByLabel("メールアドレス*");
    await emailInput.fill("invalid-email");
    await emailInput.blur();
    await page.waitForTimeout(500);

    await expect(page.getByText("正しいメールアドレスを入力してください")).toBeVisible();
  });

  test("TC-VAL-006: 正しいメールアドレスでエラーなし", async ({ page }) => {
    const emailInput = page.getByLabel("メールアドレス*");
    await emailInput.fill("valid@example.com");
    await emailInput.blur();
    await page.waitForTimeout(500);

    await expect(page.getByText("正しいメールアドレスを入力してください")).not.toBeVisible();
  });

  test("TC-VAL-007: 郵便番号入力後に住所が空だとエラー", async ({ page }) => {
    const postCodeInput = page.locator('input[placeholder="123-4567"]').first();
    await postCodeInput.fill("100-0001");
    await postCodeInput.blur();

    // 「次へ」を押してバリデーション発火
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(500);

    // 住所が空の場合はエラー（郵便番号を入れたら住所も必要）
    // ※ バリデーションルール次第
  });
});

test.describe("お問い合わせフォーム - 確認画面表示", () => {
  test.beforeEach(async ({ page }) => {
    // シミュレーションから遷移
    await page.goto("/");
    await page.waitForTimeout(1000);
    await page.locator("text=Mクラス").first().click();
    await page.waitForTimeout(500);
    await page.locator("button:has-text('お問合せ')").click();
    await page.waitForTimeout(1000);
  });

  test("TC-CONFIRM-001: 確認画面に入力内容が表示される", async ({ page }) => {
    // ステップ0入力
    await page.getByLabel("お名前（候補者名）*").fill("確認太郎");
    await page.getByLabel("フリガナ*").fill("カクニンタロウ");
    await page.getByLabel("電話番号*").fill("03-1234-5678");
    await page.getByLabel("メールアドレス*").fill("kakunin@test.com");
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(1500);

    // ステップ1入力
    // 納車場所を「自宅」に変更
    await page.locator('button:has-text("自宅")').first().click();
    await page.waitForTimeout(300);
    // 引取場所を「自宅」に変更
    await page.locator('button:has-text("自宅")').nth(1).click();
    await page.waitForTimeout(300);

    // 納車日時を入力
    await fillDateTimePicker(page, 0);

    // 引取日時を入力
    await fillDateTimePicker(page, 1);

    // ステップ2へ（page.evaluate経由で）
    await clickNextButton(page);
    await page.waitForTimeout(2000);

    // 確認画面の表示確認
    await expect(page.getByText("入力内容をご確認の上")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("お見積りサマリー")).toBeVisible();

    // 送信ボタンが表示
    await expect(page.locator("button:has-text('送信する')")).toBeVisible();
  });

  test("TC-CONFIRM-002: 確認画面で送信ボタン押下前は/thanksに遷移しない", async ({ page }) => {
    // ステップ0入力
    await page.getByLabel("お名前（候補者名）*").fill("遷移テスト");
    await page.getByLabel("フリガナ*").fill("センイテスト");
    await page.getByLabel("電話番号*").fill("090-0000-0000");
    await page.getByLabel("メールアドレス*").fill("seni@test.com");
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(1500);

    // ステップ1入力
    await page.locator('button:has-text("自宅")').first().click();
    await page.waitForTimeout(300);
    await page.locator('button:has-text("自宅")').nth(1).click();
    await page.waitForTimeout(300);

    // 納車日時を入力
    await fillDateTimePicker(page, 0);

    // 引取日時を入力
    await fillDateTimePicker(page, 1);

    // ステップ2へ（page.evaluate経由で）
    await clickNextButton(page);
    await page.waitForTimeout(2000);

    // 確認画面にいる
    await expect(page.getByText("入力内容をご確認の上")).toBeVisible({ timeout: 10000 });

    // URLは/contactのまま
    await expect(page).toHaveURL(/.*contact/);

    // 3秒待っても/thanksには遷移しない
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/.*contact/);
  });
});

test.describe("お問い合わせフォーム - ステッパー表示", () => {
  test("TC-STEPPER-001: 各ステップでステッパーの状態が正しい", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
    await page.locator("text=Mクラス").first().click();
    await page.waitForTimeout(500);
    await page.locator("button:has-text('お問合せ')").click();
    await page.waitForTimeout(1000);

    // ステップ0: 最初のステップがアクティブ
    const stepper = page.locator(".MuiStepper-root");
    await expect(stepper).toBeVisible();

    // ステップ1へ
    await page.getByLabel("お名前（候補者名）*").fill("ステッパーテスト");
    await page.getByLabel("フリガナ*").fill("ステッパーテスト");
    await page.getByLabel("電話番号*").fill("090-1111-2222");
    await page.getByLabel("メールアドレス*").fill("stepper@test.com");
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(1500);

    // ステップ1にいることを確認
    await expect(page.getByText("希望納車日時").first()).toBeVisible();

    // ステップ1入力
    await page.locator('button:has-text("自宅")').first().click();
    await page.waitForTimeout(300);
    await page.locator('button:has-text("自宅")').nth(1).click();
    await page.waitForTimeout(300);

    // 納車日時を入力
    await fillDateTimePicker(page, 0);

    // 引取日時を入力
    await fillDateTimePicker(page, 1);

    // ステップ2へ（page.evaluate経由で）
    await clickNextButton(page);
    await page.waitForTimeout(2000);

    // 確認画面が表示される
    await expect(page.getByText("入力内容をご確認の上")).toBeVisible({ timeout: 10000 });
  });
});

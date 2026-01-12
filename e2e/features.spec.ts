/**
 * 機能テスト E2E
 * - 郵便番号検索
 * - 見積もりPDFダウンロード
 */
import { test, expect } from "@playwright/test";

test.describe("郵便番号検索機能", () => {
  test.beforeEach(async ({ page }) => {
    // contactページに移動（ステップ0がお客様情報）
    await page.goto("/contact");
    await page.waitForTimeout(1000);
  });

  test("TC-ZIP-001: 郵便番号から住所を自動入力", async ({ page }) => {
    // 郵便番号入力欄を探す（placeholder で特定）
    const postCodeInput = page.locator('input[placeholder="123-4567"]').first();
    await expect(postCodeInput).toBeVisible({ timeout: 5000 });
    await postCodeInput.fill("100-0001");

    // 検索ボタン（郵便番号フィールドの横のIconButton）をクリック
    // MUIのTextFieldのendAdornment内にあるボタンを探す
    const searchButton = page.locator('input[placeholder="123-4567"]').first()
      .locator('xpath=ancestor::div[contains(@class, "MuiTextField")]//button').first();
    await searchButton.click();

    // API応答を待つ
    await page.waitForTimeout(2000);

    // 住所が自動入力されることを確認（住所ラベルのフィールド）
    const addressInput = page.getByLabel("住所").first();
    const addressValue = await addressInput.inputValue();

    // 東京都千代田区が入力されていることを確認
    expect(addressValue).toContain("東京都");
    expect(addressValue).toContain("千代田区");
  });

  test("TC-ZIP-002: 事務所郵便番号から住所を自動入力", async ({ page }) => {
    // 選挙事務所情報セクションまでスクロール
    const officeSection = page.getByText("選挙事務所情報（任意）");
    await officeSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // 事務所郵便番号の入力欄を探す（ラベルで特定）
    const officePostCodeInput = page.getByLabel("事務所郵便番号");
    await expect(officePostCodeInput).toBeVisible({ timeout: 5000 });
    await officePostCodeInput.fill("150-0001");

    // 検索ボタンをクリック（事務所郵便番号フィールドの横のボタン）
    const searchButton = officePostCodeInput
      .locator('xpath=ancestor::div[contains(@class, "MuiTextField")]//button').first();
    await searchButton.click();

    // API応答を待つ
    await page.waitForTimeout(2000);

    // 事務所住所が自動入力されることを確認
    const officeAddressInput = page.getByLabel("事務所住所");
    const addressValue = await officeAddressInput.inputValue();

    // 東京都渋谷区が入力されていることを確認
    expect(addressValue).toContain("東京都");
    expect(addressValue).toContain("渋谷区");
  });

  test("TC-ZIP-003: 無効な郵便番号で住所が入力されない", async ({ page }) => {
    // 郵便番号入力欄を探す
    const postCodeInput = page.locator('input[placeholder="123-4567"]').first();
    await expect(postCodeInput).toBeVisible({ timeout: 5000 });
    await postCodeInput.fill("000-0000");

    // 検索ボタンをクリック
    const searchButton = page.locator('input[placeholder="123-4567"]').first()
      .locator('xpath=ancestor::div[contains(@class, "MuiTextField")]//button').first();
    await searchButton.click();

    // API応答を待つ
    await page.waitForTimeout(2000);

    // 住所が空のままであることを確認
    const addressInput = page.getByLabel("住所").first();
    const addressValue = await addressInput.inputValue();

    expect(addressValue).toBe("");
  });
});

test.describe("見積もりPDFダウンロード機能", () => {
  test("TC-PDF-001: シミュレーションページで見積もりボタンが表示される", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);

    // 見積もりボタンが表示されることを確認
    const pdfButton = page.locator("button:has-text('見積もり')");
    await expect(pdfButton).toBeVisible({ timeout: 5000 });
  });

  test("TC-PDF-002: PDFダウンロードリンクが機能する", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);

    // 車種を選択してシミュレーション結果を生成
    await page.locator("text=Mクラス").first().click();
    await page.waitForTimeout(500);

    // 合計金額が表示されることを確認
    await expect(page.locator("text=合計金額")).toBeVisible();

    // 見積もりボタンを取得
    const pdfButton = page.locator("button:has-text('見積もり')");
    await expect(pdfButton).toBeVisible();

    // ダウンロードイベントを監視
    const downloadPromise = page.waitForEvent("download", { timeout: 10000 }).catch(() => null);

    // 見積もりボタンをクリック
    await pdfButton.click();

    // ダウンロードが開始されることを確認（またはリンクが存在することを確認）
    const download = await downloadPromise;

    if (download) {
      // ダウンロードが成功した場合
      const filename = download.suggestedFilename();
      expect(filename).toContain(".pdf");
    } else {
      // PDFDownloadLinkが設定されていることを確認
      const pdfLink = page.locator("a[download]").first();
      const downloadAttr = await pdfLink.getAttribute("download");
      expect(downloadAttr).toContain(".pdf");
    }
  });

  test("TC-PDF-003: 選挙区分変更後もPDFボタンが機能する", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);

    // 選挙区分を選択
    await page.locator("text=国政選挙").first().click();
    await page.waitForTimeout(500);

    // 車種を選択
    await page.locator("text=LLクラス").first().click();
    await page.waitForTimeout(500);

    // 合計金額が更新されることを確認
    const totalText = page.locator("text=合計金額");
    await expect(totalText).toBeVisible();

    // 見積もりボタンが機能することを確認
    const pdfButton = page.locator("button:has-text('見積もり')");
    await expect(pdfButton).toBeEnabled();
  });
});

test.describe("お問合せフォーム統合テスト", () => {
  test("TC-FORM-001: フルフロー - シミュレーションから問い合わせ完了まで", async ({ page }) => {
    // シミュレーションページから開始
    await page.goto("/");
    await page.waitForTimeout(1000);

    // 選挙区分を選択
    await page.locator("text=一般地方選挙").first().click();
    await page.waitForTimeout(300);

    // 都道府県を選択（リストタブに切り替え）
    const listTab = page.locator("button:has-text('リストから選択')");
    if (await listTab.isVisible()) {
      await listTab.click();
      await page.waitForTimeout(300);
    }

    // 東京を選択
    const tokyoButton = page.locator("text=東京").first();
    if (await tokyoButton.isVisible()) {
      await tokyoButton.click();
      await page.waitForTimeout(300);
    }

    // 車種を選択
    await page.locator("text=Sクラス").first().click();
    await page.waitForTimeout(500);

    // お問合せボタンをクリック
    await page.locator("button:has-text('お問合せ')").click();
    await page.waitForTimeout(500);

    // contactページに遷移確認
    await expect(page).toHaveURL(/.*contact/);
  });

  test("TC-FORM-002: 必須フィールドのマーク表示", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(1000);

    // 必須フィールド（*付き）が表示されることを確認
    await expect(page.getByText("お名前（候補者名）*").first()).toBeVisible();
    await expect(page.getByText("フリガナ*").first()).toBeVisible();
    await expect(page.getByText("電話番号*").first()).toBeVisible();
    await expect(page.getByText("メールアドレス*").first()).toBeVisible();
  });

  test("TC-FORM-003: フォーカスアウト時にバリデーションエラー表示", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(1000);

    // お名前フィールドにフォーカスして外す
    const nameInput = page.getByLabel("お名前（候補者名）*");
    await nameInput.focus();
    await nameInput.blur();
    await page.waitForTimeout(300);

    // エラーメッセージが表示されることを確認
    await expect(page.getByText("お名前は必須です")).toBeVisible();
  });

  test("TC-FORM-004: ステップ移動時にバリデーション", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(1000);

    // 何も入力せずに「次へ」をクリック
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(500);

    // エラーメッセージが表示され、ステップが進まないことを確認
    await expect(page.getByText("お名前は必須です")).toBeVisible();
    // まだステップ0にいる（お客様情報セクションが表示）
    await expect(page.getByText("基本情報")).toBeVisible();
  });

  test("TC-FORM-005: カタカナバリデーション", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(1000);

    // フリガナに平仮名を入力
    const furiganaInput = page.getByLabel("フリガナ*");
    await furiganaInput.fill("てすと");
    await furiganaInput.blur();
    await page.waitForTimeout(300);

    // カタカナエラーが表示されることを確認
    await expect(page.getByText("カタカナで入力してください")).toBeVisible();
  });
});

test.describe("フッター機能テスト", () => {
  test("TC-FOOTER-001: 合計金額が正しく表示される", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);

    // 合計金額が表示されることを確認
    const totalPrice = page.locator("text=合計金額");
    await expect(totalPrice).toBeVisible();

    // 金額フォーマット（¥と数字）が含まれることを確認
    const priceText = await page.locator("text=/合計金額.*¥/").textContent();
    expect(priceText).toMatch(/¥[\d,]+/);
  });

  test("TC-FOOTER-002: 配送料が表示される", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);

    // 都道府県を選択して配送料を表示
    const listTab = page.locator("button:has-text('リストから選択')");
    if (await listTab.isVisible()) {
      await listTab.click();
      await page.waitForTimeout(300);
    }

    // 北海道を選択（配送料がかかる地域）
    const hokkaidoButton = page.locator("text=北海道").first();
    if (await hokkaidoButton.isVisible()) {
      await hokkaidoButton.click();
      await page.waitForTimeout(500);
    }

    // 配送料セクションが表示されることを確認
    const deliverySection = page.locator("text=配送料");
    await expect(deliverySection).toBeVisible();
  });

  test("TC-FOOTER-003: お問合せボタンがcontactページに遷移する", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);

    // お問合せボタンをクリック
    const contactButton = page.locator("button:has-text('お問合せ')");
    await expect(contactButton).toBeVisible();
    await contactButton.click();

    // contactページに遷移することを確認
    await expect(page).toHaveURL(/.*contact/);
  });
});

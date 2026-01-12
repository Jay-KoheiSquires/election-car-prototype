/**
 * UI確認用スクリーンショット撮影
 */
import { test } from "@playwright/test";

test.describe("UI Screenshots", () => {
  test("全画面スクリーンショット撮影", async ({ page }) => {
    // 1. シミュレーションページ（トップ）
    await page.goto("/");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/01_simulation_top.png", fullPage: true });

    // Mクラス選択後
    await page.locator("text=Mクラス").first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "screenshots/02_simulation_m_class.png", fullPage: true });

    // 2. お問合せページ - ステップ1（お客様情報）
    // ※選挙情報はシミュレーションで入力済み
    await page.goto("/contact");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/03_contact_step1.png", fullPage: true });

    // ステップ1入力
    await page.getByLabel(/お名前/).fill("テスト太郎");
    await page.getByLabel(/フリガナ/).fill("テストタロウ");
    await page.getByLabel(/郵便番号/).first().fill("100-0001");
    await page.getByLabel(/住所/).first().fill("東京都千代田区千代田1-1");
    await page.getByLabel(/電話番号/).first().fill("090-1234-5678");
    await page.getByLabel(/メールアドレス/).fill("test@example.com");
    await page.getByLabel(/事務所郵便番号/).fill("100-0002");
    await page.getByLabel(/事務所住所/).fill("東京都千代田区皇居外苑2-2");
    await page.getByLabel(/事務所電話番号/).fill("03-1234-5678");
    await page.getByLabel(/ご担当者名/).fill("選挙 責任者");
    await page.screenshot({ path: "screenshots/04_contact_step1_filled.png", fullPage: true });

    // ステップ2へ（納車・引取）
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "screenshots/05_contact_step2.png", fullPage: true });

    // ステップ3へ（確認画面）
    await page.locator("button:has-text('次へ')").click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "screenshots/06_contact_step3_confirm.png", fullPage: true });

    // 3. FAQページ
    await page.goto("/faq");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/09_faq.png", fullPage: true });

    // FAQ展開
    await page.locator(".MuiAccordion-root").first().click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: "screenshots/10_faq_expanded.png", fullPage: true });

    // 4. 導入事例ページ
    await page.goto("/cases");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/11_cases.png", fullPage: true });

    // 5. 活用ガイドページ
    await page.goto("/guide");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/12_guide.png", fullPage: true });

    // 6. 完了ページ
    await page.goto("/thanks");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/13_thanks.png", fullPage: true });
  });

  test("モバイル画面スクリーンショット", async ({ page }) => {
    // モバイルビューポート設定
    await page.setViewportSize({ width: 375, height: 812 });

    // シミュレーション
    await page.goto("/");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/mobile_01_simulation.png", fullPage: true });

    // お問合せ
    await page.goto("/contact");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/mobile_02_contact.png", fullPage: true });

    // FAQ
    await page.goto("/faq");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/mobile_03_faq.png", fullPage: true });
  });
});

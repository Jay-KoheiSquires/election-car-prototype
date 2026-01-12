# 選挙カーレンタルラボ プロトタイプ開発まとめ

## プロジェクト概要

- **プロジェクト名**: 選挙カーレンタルラボ
- **デプロイURL**: https://jay-koheisquires.github.io/election-car-prototype/
- **リポジトリ**: https://github.com/Jay-KoheiSquires/election-car-prototype
- **技術スタック**: Next.js 14, React, MUI v5, React Hook Form, React Query v5

---

## 実装済み機能

### 1. トップページ（料金シミュレーション）
- 選挙の種類・日程・車種を選択して料金を計算
- おすすめ車種の表示
- 料金比較表

### 2. お問い合わせページ (`/contact`) - リッチUI版
4ステップのウィザード形式で情報入力

#### STEP 1: 選挙情報
- **選挙種別選択**: カード形式で3種類から選択
  - 統一地方選挙
  - 一般地方選挙
  - 国政選挙
- **選挙区選択**: 日本地図UI（タブ切り替え）
  - 地図から選択（デフォルト）: グリッドベースの日本地図
  - リストから選択: 2ステップ方式（地域→都道府県）
- **告示日**: MUI DatePicker（日本語対応カレンダー）

#### STEP 2: お客様情報
- 基本情報（名前、フリガナ、住所、電話、メール）
- 選挙事務所情報（任意）
- 郵便番号から住所自動入力

#### STEP 3: 納車・引取
- **納車日時**: MUI DateTimePicker
- **納車場所**: トグルボタン（事務所/自宅/その他）
- **引取日時**: MUI DateTimePicker
- **引取場所**: トグルボタン
- 備考・ご要望

#### STEP 4: 確認
- 入力内容の確認表示
- 送信ボタン

#### クイック連絡
- LINEで相談ボタン
- 電話で相談ボタン

### 3. よくある質問ページ (`/faq`)
- アコーディオン形式のFAQ

### 4. 導入事例ページ (`/cases`)
- 実績サマリー（累計利用件数、対応都道府県、満足度、リピート率）
- タブでフィルタリング（統一選/一般/国政/広告宣伝車）
- 事例カード（お客様の声、利用車種、ポイント）

### 5. 活用ガイドページ (`/guide`)
- レンタルの流れ（ステッパー形式）
- 効果的な使い方（時間帯、音響、走行ルート）
- 車種選びのポイント
- 注意事項

---

## 主な改善履歴

### モバイル対応
- 全ページをモバイルファーストで再設計
- レスポンシブ対応（`sx={{ xs: ..., sm: ... }}`）
- 縦スクロール優先のレイアウト

### 日本地図コンポーネント
1. **初期版**: 丸い円で都道府県を表示 → 重なりが発生
2. **修正版**: 2ステップボタン選択方式（地域→都道府県）
3. **最終版**: タブ切り替え
   - 地図から選択: グリッドベースの日本列島
   - リストから選択: 2ステップ方式

### DatePicker
- HTML標準の`type="date"`から MUI DatePicker に変更
- 日本語ロケール対応
- モバイルでのモーダル表示

### ナビゲーション修正
- フッターの「お問合せ」リンクを `/input` → `/contact` に変更

---

## ファイル構成

```
prototype/
├── pages/
│   ├── index.tsx          # トップ（シミュレーション）
│   ├── contact.tsx        # お問い合わせ（リッチ版）
│   ├── input.tsx          # お問い合わせ（旧版）
│   ├── faq.tsx            # よくある質問
│   ├── cases.tsx          # 導入事例
│   ├── guide.tsx          # 活用ガイド
│   ├── check.tsx          # 確認画面
│   └── thanks.tsx         # 送信完了
├── features/
│   ├── inquire/
│   │   └── parts/
│   │       └── japanMap.tsx  # 日本地図コンポーネント
│   └── simulation/
│       └── parts/
│           ├── footer.tsx
│           ├── recommendedCar.tsx
│           ├── priceComparison.tsx
│           └── ...
├── component/
│   ├── templates/
│   │   └── layout.tsx     # 共通レイアウト
│   └── molecules/
│       └── rhfForm/
│           ├── rhfDatePicker.tsx
│           └── rhfDateTimePicker.tsx
└── renntaka/
    └── prototype-summary.md  # このファイル
```

---

## デプロイ方法

GitHub Actionsで自動デプロイ

```bash
# ローカルビルド
npm run build

# 変更をプッシュ → 自動でGitHub Pagesにデプロイ
git add .
git commit -m "message"
git push origin main
```

---

## 今後の改善案

1. フォーム送信機能の実装（バックエンド連携）
2. LINE連携の実装
3. PDF見積もり出力機能
4. 管理画面の作成
5. SEO対策

---

## 連絡先

プロトタイプURL: https://jay-koheisquires.github.io/election-car-prototype/

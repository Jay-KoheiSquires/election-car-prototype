# 選挙カーレンタルラボ - プロトタイプ v2.0

見積もりページの改善提案用プロトタイプです。

## 🚀 デモ

GitHub Pages: https://[username].github.io/election-car-prototype/

## ✨ 新機能一覧

### システム改善
- ✅ Next.js 14 へアップグレード
- ✅ React Query v5 対応
- ✅ TypeScript 5.3 対応
- ✅ 型定義の強化（any型の削減）
- ✅ レンダリング最適化（useMemo/useCallback）

### コンバージョン向上
- ✅ **LINE問い合わせ** - LINEで見積もり内容を送信
- ✅ **QRコード表示** - 見積もり結果をスマホ共有
- ✅ **メール送信** - 見積もりPDFをメールで送信
- ✅ **チャットボット** - よくある質問への自動応答

### ユーザー体験向上
- ✅ **おすすめ車種提案** - 選挙区分に応じた最適車種をAI提案
- ✅ **料金比較表示** - 他クラスとの比較表
- ✅ **車両ギャラリー** - 実際の選挙カー写真スライドショー

### 新規ページ
- ✅ **FAQ** (`/faq`) - よくある質問ページ
- ✅ **導入事例** (`/cases`) - お客様の声
- ✅ **活用ガイド** (`/guide`) - 選挙カーの効果的な使い方

### UI/UX改善
- ✅ ヘッダーナビゲーション追加
- ✅ フッター追加
- ✅ モバイルメニュー対応
- ✅ レスポンシブデザイン強化

## 📁 ディレクトリ構造

```
prototype/
├── pages/
│   ├── index.tsx          # トップ（→シミュレーション）
│   ├── simulation.tsx     # 料金シミュレーション
│   ├── faq.tsx            # [NEW] よくある質問
│   ├── cases.tsx          # [NEW] 導入事例
│   ├── guide.tsx          # [NEW] 活用ガイド
│   ├── input.tsx          # 問い合わせ入力
│   ├── check.tsx          # 確認画面
│   └── thanks.tsx         # 完了画面
├── features/
│   └── simulation/
│       ├── simulationControl.tsx  # [UPDATED] メインコントローラー
│       └── parts/
│           ├── sharePanel.tsx     # [NEW] 共有パネル（QR/LINE/メール）
│           ├── carGallery.tsx     # [NEW] 車両ギャラリー
│           ├── priceComparison.tsx# [NEW] 料金比較表
│           ├── recommendedCar.tsx # [NEW] おすすめ車種提案
│           └── chatBot.tsx        # [NEW] チャットボット
├── component/
│   └── templates/
│       └── layout.tsx     # [UPDATED] ナビゲーション追加
└── .github/
    └── workflows/
        └── deploy.yml     # GitHub Pages自動デプロイ
```

## 🛠 技術スタック

| 項目 | バージョン |
|------|-----------|
| Next.js | 14.0.3 |
| React | 18.2.0 |
| TypeScript | 5.3.2 |
| Material-UI | 5.14.18 |
| React Query | 5.8.4 |
| React Hook Form | 7.48.2 |

## 🚀 セットアップ

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド（静的エクスポート）
npm run build

# ビルド結果は /out ディレクトリに出力
```

## 📦 GitHub Pagesへのデプロイ

1. GitHubにリポジトリを作成（例: `election-car-prototype`）
2. `next.config.js` の `basePath` をリポジトリ名に変更
3. コードをプッシュ
4. GitHub Pages設定で「GitHub Actions」を選択
5. 自動でデプロイされる

```bash
git init
git add .
git commit -m "Initial prototype"
git branch -M main
git remote add origin https://github.com/[username]/election-car-prototype.git
git push -u origin main
```

## 📝 提案内容

このプロトタイプは以下の改善案を実装したものです：

### A. システム改善
1. Next.js 12→14 アップグレード
2. React Query v5 対応
3. 型定義の強化

### B. ビジネス/プロダクト改善
1. コンバージョン向上（LINE/QR/メール共有）
2. ユーザー体験向上（おすすめ提案/比較表/ギャラリー）
3. コンテンツ充実（FAQ/事例/ガイド）

---

Created with ❤️ for 選挙カーレンタルラボ

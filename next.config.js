/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // GitHub Pages用静的エクスポート
  output: 'export',
  trailingSlash: true,

  // GitHub Pages のリポジトリ名に合わせて変更
  // 例: https://username.github.io/election-car-prototype/
  basePath: process.env.NODE_ENV === 'production' ? '/election-car-prototype' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/election-car-prototype' : '',

  // 静的エクスポート時は画像最適化を無効化
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

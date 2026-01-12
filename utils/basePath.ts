/**
 * GitHub Pages用のbasePath設定
 * 全ての画像パスでこれを使用する
 */
export const basePath = process.env.NODE_ENV === 'production' ? '/election-car-prototype' : '';

/**
 * 画像パスにbasePathを追加するヘルパー
 */
export const getImagePath = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
};

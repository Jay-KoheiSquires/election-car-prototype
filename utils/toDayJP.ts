/**
 * 日付ユーティリティ
 * 日本語形式の日付フォーマット関数
 */

/**
 * 今日の日付を「YYYY年M月D日」形式で返す
 * @returns 日本語形式の日付文字列（例：2024年1月11日）
 */
export const ToDayJP = (): string => {
  const toDay = new Date();
  const year = toDay.getFullYear();
  const month = toDay.getMonth() + 1;
  const day = toDay.getDate();

  return `${year}年${month}月${day}日 `;
};

/**
 * メール送信用ヘルパー関数
 * EmailJSで送信するデータの加工・計算を行う
 */

/**
 * 2つの日時文字列からレンタル日数を計算
 * @param startDateTime 開始日時（例: "2024/04/01 10:00"）
 * @param endDateTime 終了日時（例: "2024/04/07 18:00"）
 * @returns レンタル日数
 */
export const calcRentalDays = (startDateTime: string, endDateTime: string): number => {
  if (!startDateTime || !endDateTime) return 0;

  // 日付部分のみを抽出（時刻を無視）
  const startDateStr = startDateTime.split(" ")[0];
  const endDateStr = endDateTime.split(" ")[0];

  const start = new Date(startDateStr.replace(/\//g, "-"));
  const end = new Date(endDateStr.replace(/\//g, "-"));

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 開始日も含めるため +1
  return diffDays + 1;
};

/**
 * 告示日までの日数を計算
 * @param notificationDate 告示日（例: "2024/04/01"）
 * @returns 告示日までの日数（負の場合は過ぎている）
 */
export const calcDaysUntilNotification = (notificationDate: string): number => {
  if (!notificationDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const notification = new Date(notificationDate.replace(/\//g, "-"));
  notification.setHours(0, 0, 0, 0);

  if (isNaN(notification.getTime())) return 0;

  const diffTime = notification.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * 公費負担概算を計算
 * 公費負担: 16,100円/日
 * @param rentalDays レンタル日数
 * @returns 公費負担概算額
 */
export const calcPublicSubsidy = (rentalDays: number): number => {
  const dailyRate = 16100;
  return rentalDays * dailyRate;
};

/**
 * Google Maps URLを生成
 * @param address 住所
 * @returns Google Maps URL
 */
export const generateMapsUrl = (address: string): string => {
  if (!address) return "";
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};

/**
 * 受信日時をフォーマット
 * @returns フォーマットされた日時文字列
 */
export const getSubmissionDateTime = (): string => {
  const now = new Date();
  return now.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Tokyo",
  });
};

/**
 * 金額をフォーマット（メール表示用）
 * @param value 金額
 * @returns フォーマットされた金額文字列
 */
export const formatPrice = (value: number | undefined): string => {
  if (value === undefined || value === null) return "¥0";
  return `¥${value.toLocaleString()}`;
};

/**
 * 金額をフォーマット（税込表示用）
 * @param value 金額
 * @returns フォーマットされた金額文字列（税込）
 */
export const formatPriceWithTax = (value: number | undefined): string => {
  if (value === undefined || value === null) return "¥0（税込）";
  return `¥${value.toLocaleString()}（税込）`;
};

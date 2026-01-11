/**
 * 配送料金データ
 *
 * 料金は片道分の金額
 * 参考: https://senkyocar-labo.com/delivery/
 */

// 配送料金タイプ
export type DeliveryFeeType = number | "consultation";

// 都道府県別配送料金マッピング
export const deliveryFeeByPrefecture: Record<string, DeliveryFeeType> = {
  // 無料エリア
  tottori: 0,     // 鳥取県
  chiba: 0,       // 千葉県
  miyagi: 0,      // 宮城県

  // 16,500円エリア
  iwate: 16500,      // 岩手県
  akita: 16500,      // 秋田県
  yamagata: 16500,   // 山形県
  fukushima: 16500,  // 福島県
  ibaraki: 16500,    // 茨城県
  tochigi: 16500,    // 栃木県
  gunma: 16500,      // 群馬県
  saitama: 16500,    // 埼玉県
  tokyo: 16500,      // 東京都
  kanagawa: 16500,   // 神奈川県
  osaka: 16500,      // 大阪府
  hyogo: 16500,      // 兵庫県
  okayama: 16500,    // 岡山県
  hiroshima: 16500,  // 広島県
  shimane: 16500,    // 島根県
  kagawa: 16500,     // 香川県

  // 27,500円エリア
  aomori: 27500,     // 青森県
  nigata: 27500,     // 新潟県
  nagano: 27500,     // 長野県
  yamanashi: 27500,  // 山梨県
  shizuoka: 27500,   // 静岡県
  kyoto: 27500,      // 京都府
  nara: 27500,       // 奈良県
  wakayama: 27500,   // 和歌山県
  yamaguchi: 27500,  // 山口県
  tokushima: 27500,  // 徳島県
  ehime: 27500,      // 愛媛県
  kochi: 27500,      // 高知県
  fukuoka: 27500,    // 福岡県
  oita: 27500,       // 大分県

  // 37,400円エリア
  toyama: 37400,     // 富山県
  ishikawa: 37400,   // 石川県
  fukui: 37400,      // 福井県
  gifu: 37400,       // 岐阜県
  aichi: 37400,      // 愛知県
  mie: 37400,        // 三重県
  shiga: 37400,      // 滋賀県
  saga: 37400,       // 佐賀県
  nagasaki: 37400,   // 長崎県
  kumamoto: 37400,   // 熊本県
  kagoshima: 37400,  // 鹿児島県
  miyazaki: 37400,   // 宮崎県（サイトに記載なしだが追加）

  // 応相談エリア
  hokkaido: "consultation",  // 北海道
  okinawa: "consultation",   // 沖縄県
};

/**
 * 都道府県コードから配送料金（片道）を取得
 */
export const getDeliveryFee = (prefectureCode: string): DeliveryFeeType => {
  return deliveryFeeByPrefecture[prefectureCode] ?? "consultation";
};

/**
 * 配送料金（往復）を計算
 * 応相談の場合は0を返す（別途表示で対応）
 */
export const calcDeliveryFeeRoundTrip = (prefectureCode: string): number => {
  const fee = getDeliveryFee(prefectureCode);
  if (fee === "consultation") {
    return 0;
  }
  return fee * 2; // 往復
};

/**
 * 応相談エリアかどうかを判定
 */
export const isConsultationArea = (prefectureCode: string): boolean => {
  return getDeliveryFee(prefectureCode) === "consultation";
};

/**
 * 配送料金のラベルを取得
 */
export const getDeliveryFeeLabel = (prefectureCode: string): string => {
  const fee = getDeliveryFee(prefectureCode);
  if (fee === "consultation") {
    return "要相談";
  }
  if (fee === 0) {
    return "無料";
  }
  return `¥${fee.toLocaleString()}`;
};

/**
 * 配送料金（往復）のラベルを取得
 */
export const getDeliveryFeeRoundTripLabel = (prefectureCode: string): string => {
  const fee = getDeliveryFee(prefectureCode);
  if (fee === "consultation") {
    return "要相談";
  }
  if (fee === 0) {
    return "無料";
  }
  return `¥${(fee * 2).toLocaleString()}`;
};

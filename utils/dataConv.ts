/**
 * データ変換ユーティリティ
 * コード値（英字キー）を日本語表示用テキストに変換する関数群
 * フォーム入力値の表示やPDF出力時に使用
 */

// 選挙区分を日本語に変換
export const ElectoralClassConv = (value: string): string => {
  switch (value) {
    case "unity":
      return "統一地方選挙";
    case "general":
      return "一般地方選挙";
    case "national":
      return "衆・参議院選挙";
    case "ad":
      return "広告宣伝車";
    default:
      return "";
  }
};

// 議会タイプを日本語に変換
export const ParliamentClassConv = (value: string) => {
  switch (value) {
    case "chairman":
      return "議員";
    case "chief":
      return "首長";
    default:
      return "";
  }
};

// 車クラスを日本語に変換
export const CarClassConv = (value: string) => {
  switch (value) {
    case "s":
      return "Sクラス";
    case "m":
      return "Mクラス";
    case "l":
      return "Lクラス";
    case "ll":
      return "LLクラス";
    default:
      return "";
  }
};

// 車両名を日本語に変換
export const CarTypeConv = (value: string) => {
  switch (value) {
    // Sクラス
    case "heightWagon":
      return "軽ハイトワゴン";
    case "boxVan":
      return "軽ハコバン";
    case "compact":
      return "コンパクトカー";

    // Mクラス
    case "corollaFielder":
      return "カローラ フィルダー";
    case "shienta":
      return "トヨタ シエンタ";
    case "proBox":
      return "プロボックス";

    // Lクラス
    case "noah":
      return "NOAH";
    case "noah_80":
      return "NOAH・VOXY：80型";
    case "noah_90":
      return "NOAH・VOXY：90型";
    case "townAce":
      return "タウンエース";

    // LLクラス
    case "regiusaceAceBasic":
      return "REGISTRYACEACE（標準ボディ）";
    case "regiusaceAceWide":
      return "REGISTRYACEACE（ワイドボディ）";

    default:
      return "";
  }
};

// 納車・引取場所を日本語に変換
export const LocationConv = (value: string) => {
  switch (value) {
    case "office":
      return "事務所";
    case "home":
      return "自宅";
    case "other":
      return "その他";
    default:
      return "";
  }
};

// 連絡方法を日本語に変換
export const ContactType = (value: string) => {
  switch (value) {
    case "tel":
      return "電話";
    case "mail":
      return "メール";
    default:
      return "";
  }
};

// ライト区分を日本語に変換
export const SignalLightConv = (value: string) => {
  switch (value) {
    case "outLight": //外照明
      return "外照明";
    case "inLight": // 内照明
      return "内照明";
    case "topLight": // 登壇
      return "登壇";
    default:
      return "";
  }
};

// スピーカ数を日本語に変換
export const SpeakerConv = (value: string) => {
  switch (value) {
    case "twe":
      return "2個";
    case "four":
      return "4個";
    default:
      return "";
  }
};

// 金額を税込金額カンマ区切りに変換
export const PriceTaxConv = (value: string | number): string | number => {
  if (value || value === 0) {
    return `¥ ${value.toLocaleString()}（税込）`;
  } else {
    return "";
  }
};
// 金額を税込金額カンマ区切りに変換
export const PriceConv = (value: string | number): string | number => {
  if (value || value === 0) {
    return `¥ ${value.toLocaleString()}`;
  } else {
    return "";
  }
};

// オプションを「追加する」か「追加しない」に変換
export const OptionConv = (value: boolean) => {
  return value ? "追加する" : "追加しない";
};

// 値に「w」を追加
export const WattConv = (value: string) => {
  return value && `${value}W`;
};

// 値に「個」を追加
export const PiecesConv = (value: string | number) => {
  return value && `${value} 個`;
};

// 値に「日」を追加
export const DayConv = (value: string | number) => {
  return value && `${value} 日`;
};

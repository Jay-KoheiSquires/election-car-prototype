import {ElectoralClass} from "../calc/calcSimlationParts";

export interface SendDataType {
  // レンタル区分
  electoralClass: ElectoralClass;
  // 車クラス
  carClass: "s" | "m" | "l" | "ll";
  // 車種
  carType: {
    s: "heightWagon" | "boxVan" | "compact";
    m: "corollaFielder" | "shienta" | "proBox";
    l: "noah" | "noah_80" | "noah_90" | "townAce";
    ll: "regiusaceAceBasic" | "regiusaceAceWide";
  };

  // 配送先都道府県コード
  deliveryPrefecture: string;

  takingPlatform: boolean;
  signalLight: "outLight" | "inLight"; // ライト区分
  ampSize: "60" | "150" | "300" | "600"; // アンプサイズ
  speaker: string; // スピーカー

  wirelessMike: boolean; // ワイヤレスマイク
  wirelessMikeNumber: number; //ワイヤレスマイク数
  sd: boolean; // SDカード
  wirelessIncome: boolean; // ワイヤレスインカム
  handSpeaker: boolean; // ハンドスピーカー
  bluetoothUnit: boolean; // Bluetoothユニット
  insurance: boolean;
  insuranceDays: number;
  bodyRapping: boolean; // ボディラッピング
}

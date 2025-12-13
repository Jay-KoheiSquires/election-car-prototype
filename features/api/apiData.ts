//
// APIデータを仮定義する。
// 将来的にはファイアーベースから値を取得する予定。
//
// 各単価のセットを行っており、nullの場合は計算&表示を行わない。
// takingPlatform(登壇)の場合は、booleanで表示非表示を切り替える。
//
// 単価がnullでtakingPlatformの何かの値がtrueの場合は、計算＆表示を行わない。
//

import { ApiDataType } from "./type";
import { boxVan } from "./carApiData/s/boxVan";
import { heightWagon } from "./carApiData/s/heightWagon";
import { compact } from "./carApiData/s/compact";
import { corollaFielder } from "./carApiData/m/corollaFielder";
import { proBox } from "./carApiData/m/proBox";
import { shienta } from "./carApiData/m/shienta";
import { noah } from "./carApiData/l/noah";
import {noah_80} from "./carApiData/l/noah_80";
import {noah_90} from "./carApiData/l/noah_90";
import { townAce } from "./carApiData/l/townAce";
import { regiusaceAceWide } from "./carApiData/ll/regiusaceAceWide";
import { regiusaceAceBasic } from "./carApiData/ll/regiusaceAceBasic";

export const apiData: ApiDataType = {
  s: {
    heightWagon: heightWagon,
    boxVan: boxVan,
    compact: compact,
  },
  m: {
    corollaFielder: corollaFielder,
    shienta: shienta,
    proBox: proBox,
  },
  l: {
    // TODO 金額の設定がないため、仮でnoahを設定
    noah: noah,
    noah_80: noah_80,
    noah_90: noah_90,
    townAce: townAce,
  },
  ll: {
    regiusaceAceBasic: regiusaceAceBasic,
    regiusaceAceWide: regiusaceAceWide,
  },

  //
  // オプション
  // NOTE: ここから配下は選挙区分で金額判定するため、下記項目ごとの大枠で判断する
  //       一般地方選挙 ... general
  //       統一地方選挙 ... unity
  //       衆・参議院選挙 ... national
  //       広告宣伝車   ... ad
  //

  // ワイヤレスマイク
  mikeValue: {
    unity: 22000,
    general: 16500,
    national: 16500,
    ad: 22000,
  },
  // TODO: ワイヤレスマイク8400追加？？？

  // SDカード料金
  sdPrice: {
    unity: 27500,
    general: 22000,
    national: 22000,
    ad: 27500,
  },

  // ワイヤレスインカム料金
  incomePrice: {
    unity: 22000,
    general: 16500,
    national: 16500,
    ad: 22000,
  },

  // ハンドスピーカー
  handSpeaker: {
    unity: 55000,
    general: 27500,
    national: 27500,
    ad: 55000,
  },

  // Bluetoothユニット料金
  bluetoothUnit: {
    unity: 22000,
    general: 16500,
    national: 16500,
    ad: 22000,
  },


  // Todo: 保険単価は、登壇の有無で切り替えるので特殊
  // 保険単価
  insuranceValue: {
    basic: {
      unity: 3300,
      general: 3300,
      national: 3300,
      ad: 3300,
    },
    takingPlatform: {
      unity: 4400,
      general: 4400,
      national: 4400,
      ad: 4400,
    },
  },
};

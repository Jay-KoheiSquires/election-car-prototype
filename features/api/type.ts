// APIデータを仮定義する。
// 将来的にはファイアーベースから値を取得する予定。
// Todo api設計が雑なのでファイアーベースに移行する際に、見直す


// 一般地方選挙 ... general
// 統一地方選挙 ... unity
// 衆・参議院選挙 ... national
// 広告宣伝車   ... ad
export interface ClassType {
  unity: UnitPriceType;
  general: UnitPriceType;
  national: UnitPriceType;
  ad: UnitPriceType;
}

export interface UnitPriceType {
  // 単価 ・・・ nullの場合は非表示とする
  unitPrice: {
    car: number;
    ampSize: {
      "60" : number | null;
      "150": number | null;
      "300": number | null;
      "600": number | null;
    };
    signalLight: {
      outLight: number | null;
      inLight: number | null;
    };
    takingPlatform: number | null;
  };
  // 登壇が選択された時に表示が変わるかどうかの判定フラグ。
  // 単価の「takingPlatform」がnullの場合、このフラグは効力をなさない。
  // trueの場合は「changeDisplay」を参照し、表示をコントロール
  // false場合は表示に変更がないものとする。
  takingPlatformChangeDisplay?: boolean;

  // 登壇の表示を制御するための判定フラグ。主にUIのチェックボックスのために使う。
  // 単価の「takingPlatform」がnullの場合と、
  // 「takingPlatformChangeDisplay」がfalseの場合は、
  // 効力をなさない。
  // trueの場合は登壇が固定される。
  // falseの場合は登壇を「付ける」「付けない」を選択可能
  takingPlatformFix?: boolean;

  // 登壇が選択された時に表示が変わるものを、ここで定義する。
  // 単価の「takingPlatform」がnullの場合と、
  // 「takingPlatformChangeDisplay」がfalseの場合は、
  // 効力をなさない。
  // true場合は表示
  // false場合は非表示
  changeDisplay?: {
    ampSize: {
      "60" : boolean;
      "150": boolean;
      "300": boolean;
      "600": boolean;
    };
    signalLight: {
      outLight: boolean;
      inLight: boolean;
    };
  };
}

export interface ApiDataType {
  s: {
    heightWagon: ClassType;
    boxVan: ClassType;
    compact: ClassType;
  };
  m: {
    corollaFielder: ClassType;
    shienta: ClassType;
    proBox: ClassType;
  };
  l: {
    noah: ClassType
    noah_80: ClassType
    noah_90: ClassType
    townAce: ClassType;
  };
  ll: {
    regiusaceAceBasic: ClassType;
    regiusaceAceWide: ClassType;
  };

  //
  // オプション
  //
  // ワイヤレスマイク
  mikeValue: {
    unity: number;
    general: number;
    national: number;
    ad: number;
  };
  // SDカード料金
  sdPrice: {
    unity: number;
    general: number;
    national: number;
    ad: number;
  };
  // ワイヤレスインカム料金
  incomePrice: {
    unity: number;
    general: number;
    national: number;
    ad: number;
  };
  // ハンドスピーカー
  handSpeaker: {
    unity: number;
    general: number;
    national: number;
    ad: number;
  };
  // Bluetoothユニット料金
  bluetoothUnit: {
    unity: number;
    general: number;
    national: number;
    ad: number;
  };
  // 保険単価
  insuranceValue: {
    basic: {
      unity: number;
      general: number;
      national: number;
      ad: number;
    };
    takingPlatform: {
      unity: number;
      general: number;
      national: number;
      ad: number;
    };
  };
}

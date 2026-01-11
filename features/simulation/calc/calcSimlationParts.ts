/**
 * 料金計算の部品関数群
 * 車クラス・アンプサイズ・ライト区分などの料金取得を担当
 */
import { apiData } from "../../api/apiData";
import { SendDataType } from "../utils/sendDataType";
import { UnitPriceType } from "../../api/type";

// 車料金
export const apiPrices = (inputValue: SendDataType): UnitPriceType => {
  switch (inputValue.carClass) {
    case "s":
      return sClass(inputValue.carType.s, inputValue.electoralClass);
    case "m":
      return mClass(inputValue.carType.m, inputValue.electoralClass);
    case "l":
      return lClass(inputValue.carType.l, inputValue.electoralClass);
    case "ll":
      return llClass(inputValue.carType.ll, inputValue.electoralClass);
  }
};

// レンタル区分
export type ElectoralClass = "unity" | "general" | "national" | "ad";

// s
type sType = "heightWagon" | "boxVan" | "compact";
export const sClass = (typeS: sType, electoralClass: ElectoralClass): UnitPriceType => {
  switch (typeS) {
    case "heightWagon":
      return apiData.s.heightWagon[electoralClass];
    case "boxVan":
      return apiData.s.boxVan[electoralClass];
    case "compact":
      return apiData.s.compact[electoralClass];
  }
};

// m
type mType = "corollaFielder" | "shienta" | "proBox";
export const mClass = (typeM: mType, electoralClass: ElectoralClass): UnitPriceType => {
  switch (typeM) {
    case "corollaFielder":
      return apiData.m.corollaFielder[electoralClass];
    case "shienta":
      return apiData.m.shienta[electoralClass];
    case "proBox":
      return apiData.m.proBox[electoralClass];
  }
};

// l
type lType = "noah" | "noah_80" | "noah_90" | "townAce";
export const lClass = (typeM: lType, electoralClass: ElectoralClass): UnitPriceType => {
  switch (typeM) {
    case "noah":
      return apiData.l.noah[electoralClass];
    case "noah_80":
      return apiData.l.noah_80[electoralClass];
    case "noah_90":
      return apiData.l.noah_90[electoralClass];
    case "townAce":
      return apiData.l.townAce[electoralClass];
  }
};

// ll
type llType = "regiusaceAceBasic" | "regiusaceAceWide";
export const llClass = (typeM: llType, electoralClass: ElectoralClass): UnitPriceType => {
  switch (typeM) {
    case "regiusaceAceBasic":
      return apiData.ll.regiusaceAceBasic[electoralClass];
    case "regiusaceAceWide":
      return apiData.ll.regiusaceAceWide[electoralClass];
  }
};

// アンプサイズ
export const ampSize = (
  signalLight: "60" | "150" | "300" | "600",
  price: { 60: number|null, 150: number | null; 300: number | null; 600: number | null },
): number => {
  switch (signalLight) {
    case "60":
      return price[60] || 0;
    case "150":
      return price[150] || 0;
    case "300":
      return price[300] || 0;
    case "600":
      return price[600] || 0;
    default:
      return 0;
  }
};

// ライト区分
export const signalLight = (
  signalLight: "outLight" | "inLight",
  price: {
    outLight: number | null;
    inLight: number | null;
  },
): number => {
  switch (signalLight) {
    case "outLight": //外照明
      return price.outLight || 0;
    case "inLight": // 内照明
      return price.inLight || 0;
    default:
      return 0;
  }
};


import { SendDataType } from "../utils/sendDataType";
import { apiData } from "../../api/apiData";
import { ampSize, apiPrices, signalLight } from "./calcSimlationParts";
import { calcDeliveryFeeRoundTrip, isConsultationArea } from "../../api/deliveryData";

export interface CalcDataType {
  subs: {
    carPrice: number;
    ampSize: number;
    signalLight: number;
    takingPlatform: number;
  };

  options: {
    totalMikePrice: number;
    sdPrice: number;
    incomePrice: number;
    handSpeakerPrice: number;
    bluetoothUnit: number;
    insurancePrice: number;
    totalInsurancePrice: number;
  };

  // 配送料（往復）
  delivery: {
    fee: number;              // 配送料金（往復）
    isConsultation: boolean;  // 要相談エリアかどうか
  };

  subTotalPrice: number;
  optionTotalPrice: number;
  deliveryPrice: number;      // 配送料合計
  totalPrice: number;
}

const CalcSimulation = (inputValue: SendDataType): CalcDataType => {
  // apiデータ取得
  const subPrices = apiPrices(inputValue);
  //
  // 小計
  //
  // 車種料金
  const carPrice = subPrices.unitPrice.car;
  // アンプ料金
  const ampPrice = ampSize(inputValue.ampSize, subPrices.unitPrice.ampSize);
  // ライト料金
  const signalLightPrice = signalLight(inputValue.signalLight, subPrices.unitPrice.signalLight);
  // 登壇料金
  const takingPlatform = inputValue?.takingPlatform ? subPrices.unitPrice.takingPlatform || 0 : 0;

  // 小計合計金額
  const subTotalPrice = carPrice + ampPrice + signalLightPrice + takingPlatform;

  //
  // オプション
  //
  // ワイヤレスマイク単価セット（1本分）
  const mikeValue = inputValue?.wirelessMike ? apiData.mikeValue[inputValue.electoralClass] : 0;
  // ワイヤレスマイク数セット
  const mikeNumberValue = inputValue?.wirelessMikeNumber;
  // ワイヤレスマイク料金 ・・・ ワイヤレスマイク * 数量
  const totalMikePrice = mikeValue * mikeNumberValue;

  // SDカード料金
  const sdPrice = inputValue?.sd ? apiData.sdPrice[inputValue.electoralClass] : 0;

  // ワイヤレスインカム料金
  const incomePrice = inputValue?.wirelessIncome
    ? apiData.incomePrice[inputValue.electoralClass]
    : 0;

  // ハンドスピーカー料金
  const handSpeakerPrice = inputValue?.handSpeaker
    ? apiData.handSpeaker[inputValue.electoralClass]
    : 0;

  // Bluetoothユニット料金
  const bluetoothUnit = inputValue?.bluetoothUnit
    ? apiData.bluetoothUnit[inputValue.electoralClass]
    : 0;

  // todo カオス
  //pdf用
  const insurancePrice = !inputValue?.takingPlatform
    ? apiData.insuranceValue.basic[inputValue.electoralClass]
    : apiData.insuranceValue.takingPlatform[inputValue.electoralClass];
  
  // 保険単価セット（1日分）
  const insuranceValue = inputValue?.insurance
    ? !inputValue?.takingPlatform
      ? apiData.insuranceValue.basic[inputValue.electoralClass]
      : apiData.insuranceValue.takingPlatform[inputValue.electoralClass]
    : 0;
  // 保険日数セット
  const insuranceDays = inputValue?.insuranceDays;
  // 保険料金 ... 保険単価 * 日数
  const totalInsurancePrice = insuranceValue * insuranceDays;

  // オプション合計金額
  const optionTotalPrice =
    totalMikePrice + sdPrice + incomePrice + handSpeakerPrice + bluetoothUnit + totalInsurancePrice;

  //
  // 配送料（往復）
  //
  const deliveryPrefecture = inputValue?.deliveryPrefecture || "";
  const deliveryFee = calcDeliveryFeeRoundTrip(deliveryPrefecture);
  const deliveryIsConsultation = isConsultationArea(deliveryPrefecture);
  const deliveryPrice = deliveryFee;

  //
  // 合計金額 ... 小計 ＋ オプション ＋ 配送料
  //
  const totalPrice = subTotalPrice + optionTotalPrice + deliveryPrice;

  return {
    subs: {
      carPrice: carPrice,
      ampSize: ampPrice,
      signalLight: signalLightPrice,
      takingPlatform: takingPlatform,
    },
    options: {
      totalMikePrice: totalMikePrice,
      sdPrice: sdPrice,
      incomePrice: incomePrice,
      handSpeakerPrice: handSpeakerPrice,
      bluetoothUnit: bluetoothUnit,
      insurancePrice: insurancePrice,
      totalInsurancePrice: totalInsurancePrice,
    },
    delivery: {
      fee: deliveryFee,
      isConsultation: deliveryIsConsultation,
    },
    subTotalPrice: subTotalPrice,
    optionTotalPrice: optionTotalPrice,
    deliveryPrice: deliveryPrice,
    totalPrice: totalPrice,
  };
};

export default CalcSimulation;

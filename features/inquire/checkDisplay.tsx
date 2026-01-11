import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useQState } from "../../hooks/library/useQstate";
import {
  CarClassConv,
  CarTypeConv,
  ContactType,
  DayConv,
  ElectoralClassConv,
  LocationConv,
  OptionConv,
  ParliamentClassConv,
  PiecesConv,
  PriceTaxConv,
  SignalLightConv,
  SpeakerConv,
  WattConv,
} from "../../utils/dataConv";
import { init, send } from "emailjs-com";

import { InputValueProps } from "./inputForm";
import { SendDataType } from "../simulation/utils/sendDataType";
import { CalcDataType } from "../simulation/calc/calcSimulation";
import { useRouter } from "next/router";
import {useLeavePageConfirmation} from "../../hooks/useLeavePageConfirmation";
import { prefCd } from "../../constants/preCd";
import {
  calcRentalDays,
  calcDaysUntilNotification,
  calcPublicSubsidy,
  generateMapsUrl,
  getSubmissionDateTime,
  formatPrice,
  formatPriceWithTax,
} from "../../utils/emailHelpers";



interface ConfLabelProps {
  label: string;
  value: string | number;
}

const ConfLabel = ({ label, value }: ConfLabelProps) => {
  return (
    <>
      <Grid xs={12} sm={6} sx={{ textAlign: { xs: "center", md: "left" } }}>
        <Typography fontWeight={"bold"}>【 {label} 】</Typography>
      </Grid>
      <Grid xs={12} sm={6} sx={{ textAlign: { xs: "center", sm: "left" } }}>
        <Typography>{value}</Typography>
      </Grid>
    </>
  );
};

//
// メール送信
//
export const CheckDisplay = () => {
  const router = useRouter();
  const [sendData] = useQState<SendDataType>(["sendData"]);
  const [calcData] = useQState<CalcDataType>(["calcData"]);
  const [inputData] = useQState<InputValueProps>(["inputData"]);
  const [stepper, setStepper] = useQState<number>(["stepper"]);


  const [open, setOpen] = useState<boolean>(false);

  const sendMail = () => {
    const userID = process.env.NEXT_PUBLIC_USER_ID;
    const serviceID = process.env.NEXT_PUBLIC_SERVICE_ID;
    // 新テンプレートがあればそちらを使用、なければ既存テンプレート
    const templateID = process.env.NEXT_PUBLIC_TEMPLATE_ID_V2 || process.env.NEXT_PUBLIC_TEMPLATE_ID;

    if (userID !== undefined && serviceID !== undefined && templateID !== undefined) {
      // undefinedでなければ、init(userID)で初期化を実行
      init(userID);

      // 追加情報の計算
      const rentalDays = calcRentalDays(inputData?.startDateTime || "", inputData?.endDateTime || "");
      const daysUntilNotification = calcDaysUntilNotification(inputData?.notificationDate || "");
      const publicSubsidy = calcPublicSubsidy(rentalDays);
      const submissionDateTime = getSubmissionDateTime();

      // 納車・引取先住所（Google Maps用）
      const deliveryAddress = inputData?.startLocation === "office"
        ? inputData?.officeAddress
        : inputData?.startLocation === "home"
        ? inputData?.address
        : inputData?.startOther;
      const pickupAddress = inputData?.endLocation === "office"
        ? inputData?.officeAddress
        : inputData?.endLocation === "home"
        ? inputData?.address
        : inputData?.endOther;

      const template_param = {
        // ========== 受信情報 ==========
        submissionDateTime, // 受信日時

        // ========== お客様情報 ==========
        name: inputData?.name, //"お名前"
        furigana: inputData?.furigana, //"フリガナ"
        postCode: inputData?.postCode, //"郵便番号"
        address: inputData?.address, //"住所"
        tel: inputData?.tel, //"電話番号"
        mail: inputData?.mail, //"メールアドレス"

        // ========== 選挙事務所情報 ==========
        officePostCode: inputData?.officePostCode, //"選挙事務所郵便番号"
        officeAddress: inputData?.officeAddress, //"選挙事務所住所"
        officeTel: inputData?.officeTel, //"選挙事務所電話番号"
        liabilityName: inputData?.liabilityName, //"選挙責任者（今後の窓口の方）"
        contactType: ContactType(inputData?.contactType), //"当社との連絡方法"

        // ========== 納車・引取情報 ==========
        startDateTime: inputData?.startDateTime, // "納車日時"
        startLocation: LocationConv(inputData?.startLocation), // "納車場所"
        startAddress: deliveryAddress || "", // 納車先住所
        startOther: inputData?.startOther, // "その他の場合の入力フォーム"
        startMapsUrl: generateMapsUrl(deliveryAddress || ""), // 納車先Google Maps URL
        endDateTime: inputData?.endDateTime, // "引取日時"
        endLocation: LocationConv(inputData?.endLocation), // "引取場所"
        endAddress: pickupAddress || "", // 引取先住所
        endOther: inputData?.endOther, // "その他の場合の入力フォーム"
        endMapsUrl: generateMapsUrl(pickupAddress || ""), // 引取先Google Maps URL
        note: inputData?.note, //"備考"

        // ========== 選挙情報 ==========
        electoralClass: ElectoralClassConv(sendData?.electoralClass), // 選挙区分
        electionArea: inputData?.electionArea.label, // 選挙エリア
        parliamentClass: ParliamentClassConv(inputData?.parliamentClass), // 議会区分
        notificationDate: inputData?.notificationDate, // 告示日
        daysUntilNotification: daysUntilNotification > 0 ? `${daysUntilNotification}日後` : daysUntilNotification === 0 ? "本日" : `${Math.abs(daysUntilNotification)}日前`, // 告示日までの日数

        // ========== 車両情報 ==========
        carClass: CarClassConv(sendData?.carClass), // 車種クラス
        carType: CarTypeConv(sendData?.carType[sendData?.carClass]), // 車種タイプ
        signalLight: SignalLightConv(sendData?.signalLight), // ライト区分
        ampSize: WattConv(sendData?.ampSize), // アンプサイズ
        speaker: SpeakerConv(sendData?.speaker), // スピーカー

        // ========== オプション ==========
        wirelessMike: OptionConv(sendData?.wirelessMike), // ワイヤレスマイク
        wirelessMikeNumber: sendData?.wirelessMike ? sendData?.wirelessMikeNumber : null, //ワイヤレスマイク数
        sd: OptionConv(sendData?.sd), // SDカード
        wirelessIncome: OptionConv(sendData?.wirelessIncome), // ワイヤレスインカム
        handSpeaker: OptionConv(sendData?.handSpeaker), // ハンドスピーカー
        bluetoothUnit: OptionConv(sendData?.bluetoothUnit), // Bluetoothユニット
        insurance: OptionConv(sendData?.insurance), //保険
        insuranceDays: sendData?.insurance ? DayConv(sendData?.insuranceDays) : DayConv(0), // 保険日数
        bodyRapping: OptionConv(sendData?.bodyRapping), // ボディラッピング

        // ========== 配送先 ==========
        deliveryPrefecture: prefCd.find((p) => p.value === sendData?.deliveryPrefecture)?.label || "未選択",
        deliveryFee: calcData?.delivery?.isConsultation
          ? "要相談"
          : calcData?.delivery?.fee === 0
          ? "無料"
          : PriceTaxConv(calcData?.deliveryPrice),

        // ========== 金額（合計） ==========
        subTotalPrice: PriceTaxConv(calcData?.subTotalPrice),
        optionTotalPrice: PriceTaxConv(calcData?.optionTotalPrice),
        deliveryPrice: calcData?.delivery?.isConsultation
          ? "要相談"
          : calcData?.delivery?.fee === 0
          ? "無料"
          : PriceTaxConv(calcData?.deliveryPrice),
        totalPrice: PriceTaxConv(calcData?.totalPrice),

        // ========== 金額（内訳詳細） ==========
        // 車両関連
        priceCarBase: formatPrice(calcData?.subs?.carPrice), // 車両本体価格
        priceAmp: formatPrice(calcData?.subs?.ampSize), // アンプ価格
        priceSignalLight: formatPrice(calcData?.subs?.signalLight), // 信号灯価格
        priceTakingPlatform: formatPrice(calcData?.subs?.takingPlatform), // 立ち台価格
        // オプション個別
        priceWirelessMike: formatPrice(calcData?.options?.totalMikePrice), // ワイヤレスマイク価格
        priceSd: formatPrice(calcData?.options?.sdPrice), // SDカード価格
        priceWirelessIncome: formatPrice(calcData?.options?.incomePrice), // ワイヤレスインカム価格
        priceHandSpeaker: formatPrice(calcData?.options?.handSpeakerPrice), // ハンドスピーカー価格
        priceBluetoothUnit: formatPrice(calcData?.options?.bluetoothUnit), // Bluetoothユニット価格
        priceInsuranceDaily: formatPrice(calcData?.options?.insurancePrice), // 保険（1日あたり）
        priceInsuranceTotal: formatPrice(calcData?.options?.totalInsurancePrice), // 保険（合計）
        // 配送
        priceDeliveryFee: formatPrice(calcData?.delivery?.fee), // 配送料（片道）

        // ========== レンタル情報 ==========
        rentalDays: `${rentalDays}日間`, // レンタル日数
        publicSubsidy: formatPriceWithTax(publicSubsidy), // 公費負担概算
      };

      console.log("Sending email with template:", templateID);
      console.log("Template params:", template_param);

      send(serviceID, templateID, template_param, "tvR3Qt2HckYv81QKY")
        .then((response) => {
          console.log("Email sent successfully:", response);
          router.push("thanks");
          setOpen(false);
        })
        .catch((error) => {
          console.error("Email send failed:", error);
          alert("メール送信に失敗しました: " + JSON.stringify(error));
          setOpen(false);
        });
    } else {
      console.error("Missing EmailJS config:", { userID, serviceID, templateID });
      alert("EmailJS設定が不足しています");
    }
  };

  //
  // 初回レンダリング時にステッパーをセット
  //
  useEffect(() => {
    setStepper(1);
  }, []);

  // // reload back対策
  // const [browserBack, setBrowserBack] = useState<boolean>(true)
  // useLeavePageConfirmation(browserBack);

  return (
    <Container maxWidth="xs">
      <Grid container rowSpacing={2}>
        <Grid xs={12}>
          <Typography variant={"caption"}>
            下記の入力内容に相違ないようでしたら「送信する」ボタンを押してください。
            内容の変更を行う場合は「戻る」ボタンを押してください。
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        {/**/}
        {/* 選挙情報 */}
        {/**/}
        <Grid xs={12}>
          <Typography>選挙情報</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <ConfLabel label={"議会区分"} value={ParliamentClassConv(inputData?.parliamentClass)} />
            <ConfLabel label={"選挙区"} value={inputData?.electionArea.label} />
            <ConfLabel label={"告示日"} value={inputData?.notificationDate} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mb: 2, mt: 2 }} />
        </Grid>

        {/**/}
        {/* 基本内容 */}
        {/**/}
        <Grid xs={12}>
          <Typography>基本内容</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <ConfLabel label={"お名前"} value={inputData?.name} />
            <ConfLabel label={"フリガナ"} value={inputData?.furigana} />
            <ConfLabel label={"郵便番号"} value={inputData?.postCode} />
            <ConfLabel label={"住所"} value={inputData?.address} />
            <ConfLabel label={"電話番号"} value={inputData?.tel} />
            <ConfLabel label={"メールアドレス"} value={inputData?.mail} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mb: 2, mt: 2 }} />
        </Grid>
        {/**/}
        {/* 選挙事務所情報 */}
        {/**/}
        <Grid xs={12} sx={{ pt: 2 }}>
          <Typography>選挙事務所情報</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <ConfLabel label={"選挙事務所郵便番号"} value={inputData?.officePostCode} />
            <ConfLabel label={"選挙事務所住所"} value={inputData?.officeAddress} />
            <ConfLabel label={"選挙事務所電話番号"} value={inputData?.officeTel} />
            <ConfLabel label={"選挙責任者"} value={inputData?.liabilityName} />
            <ConfLabel label={"当社との連絡方法"} value={ContactType(inputData?.contactType)} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mb: 2, mt: 2 }} />
        </Grid>

        {/**/}
        {/* 納車・引取り情報 */}
        {/**/}
        <Grid xs={12} sx={{ pt: 2 }}>
          <Typography>納車・引取情報</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            {/* 納車 */}
            <ConfLabel label={"納車日時"} value={inputData?.startDateTime} />
            <ConfLabel label={"納車場所"} value={LocationConv(inputData?.startLocation)} />
            {inputData?.startLocation === "other" && (
              <ConfLabel label={"その他の納車場所"} value={inputData?.startOther} />
            )}
            {/* 引き取り */}
            <ConfLabel label={"引取日時"} value={inputData?.endDateTime} />
            <ConfLabel label={"引取場所"} value={LocationConv(inputData?.endLocation)} />
            {inputData?.endLocation === "other" && (
              <ConfLabel label={"その他の引取場所"} value={inputData?.endOther} />
            )}
            <ConfLabel label={"備考"} value={inputData?.note} />{" "}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ mb: 2, mt: 2 }} />
        </Grid>

        {/**/}
        {/* レンタル車両情報 */}
        {/**/}
        <Grid xs={12} sx={{ pt: 2 }}>
          <Typography>レンタル車両情報</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <ConfLabel
              label={"レンタル区分"}
              value={ElectoralClassConv(sendData?.electoralClass)}
            />
            <ConfLabel label={"選挙エリア"} value={inputData?.electionArea?.label} />
            <ConfLabel label={"議会区分"} value={ParliamentClassConv(inputData?.parliamentClass)} />
            <ConfLabel label={"車種クラス"} value={CarClassConv(sendData?.carClass)} />
            <ConfLabel label={"車種"} value={CarTypeConv(sendData?.carType[sendData?.carClass])} />
            <ConfLabel label={"ライト区分"} value={SignalLightConv(sendData?.signalLight)} />
            <ConfLabel label={"アンプサイズ"} value={WattConv(sendData?.ampSize)} />
            <ConfLabel label={"スピーカー"} value={SpeakerConv(sendData?.speaker)} />
            <ConfLabel label={"レンタル車両金額"} value={PriceTaxConv(calcData?.subTotalPrice)} />
            <Grid item xs={12}>
              <Divider sx={{ mb: 2, mt: 2 }} />
            </Grid>
          </Grid>
        </Grid>

        {/**/}
        {/* オプション追加 */}
        {/**/}
        <Grid xs={12} sx={{ pt: 2 }}>
          <Typography>オプション追加</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            {/* オプション */}
            <ConfLabel label={"ワイヤレスマイク"} value={OptionConv(sendData?.wirelessMike)} />
            {sendData?.wirelessMike && (
              <ConfLabel
                label={"ワイヤレスマイク数"}
                value={PiecesConv(sendData?.wirelessMikeNumber)}
              />
            )}
            <ConfLabel label={"SDカード"} value={OptionConv(sendData?.sd)} />
            <ConfLabel label={"ワイヤレスインカム"} value={OptionConv(sendData?.wirelessIncome)} />
            <ConfLabel label={"ハンドスピーカー"} value={OptionConv(sendData?.handSpeaker)} />
            <ConfLabel label={"Bluetoothユニット"} value={OptionConv(sendData?.bluetoothUnit)} />
            <ConfLabel label={"保険"} value={OptionConv(sendData?.insurance)} />
            {sendData?.insurance && (
              <ConfLabel label={"保険日数"} value={DayConv(sendData?.insuranceDays)} />
            )}
            <ConfLabel label={"ボディラッピング"} value={OptionConv(sendData?.bodyRapping)} />
            <ConfLabel label={"オプション金額"} value={PriceTaxConv(calcData?.optionTotalPrice)} />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ mb: 2, mt: 2 }} />
        </Grid>

        {/**/}
        {/* 配送料 */}
        {/**/}
        <Grid xs={12} sx={{ pt: 2 }}>
          <Typography>配送料</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <ConfLabel
              label={"配送先"}
              value={prefCd.find((p) => p.value === sendData?.deliveryPrefecture)?.label || "未選択"}
            />
            <ConfLabel
              label={"配送料（往復）"}
              value={
                calcData?.delivery?.isConsultation
                  ? "要相談"
                  : calcData?.delivery?.fee === 0
                  ? "無料"
                  : PriceTaxConv(calcData?.deliveryPrice)
              }
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ mb: 2, mt: 2 }} />
        </Grid>
        <ConfLabel label={"合計金額"} value={PriceTaxConv(calcData?.totalPrice)} />

        <Grid item xs={6}>
          <Box textAlign={{ xs: "left", sm: "center" }} padding={2}>
            <Button
              variant={"outlined"}
              centerRipple={true}
              onClick={() => {
                setStepper(0);
                // setBrowserBack(false);
                router.back();
              }}
            >
              戻る
            </Button>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box textAlign={{ xs: "right", sm: "right" }} padding={2}>
            <Button
              variant={"contained"}
              centerRipple={true}
              onClick={() => {
                // setBrowserBack(false);
                sendMail();
                setOpen(true);
              }}
            >
              送信
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

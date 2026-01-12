//
// public配下でなければ、ナスフォントが読みこまれないため、ここに配置する。
// 原因は不明。
//
import React from "react";
import { Document, Font, Image, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "../styles/pdfStyles";
import { Grid } from "../componentPDF/atoms/grid";
import { GridItem } from "../componentPDF/atoms/gridItem";
import { SimpleText } from "../componentPDF/atoms/simpleText";
import { ToDayJP } from "../utils/toDayJP";
import { TableHead } from "../componentPDF/atoms/table/tableHead";
import { TableRow } from "../componentPDF/atoms/table/tableRow";
import { Table } from "../componentPDF/atoms/table/table";
import { TableCell } from "../componentPDF/atoms/table/tableCell";
import { TableBody } from "../componentPDF/atoms/table/TableBody";
import { SendDataType } from "../features/simulation/utils/sendDataType";
import { CalcDataType } from "../features/simulation/calc/calcSimulation";

import { domainLabel } from "../utils/domainLabel";
import {
  CarTypeConv,
  CarClassConv,
  DayConv,
  PiecesConv,
  PriceTaxConv,
  SignalLightConv,
  SpeakerConv,
  WattConv,
  ElectoralClassConv,
} from "../utils/dataConv";
import { prefCd } from "../constants/preCd";
//
// フォント定義
//

// フォント「ナス レギュラー」
Font.register({
  family: "Nasu-Regular",
  src: "./fonts/Nasu-Regular.ttf",
});

// フォント「ナス 太字」
Font.register({
  family: "Nasu-Bold",
  src: "./fonts/Nasu-Bold.ttf",
});

interface QuoteProps {
  sendData: SendDataType;
  calcData: CalcDataType;
}

export const Quote = ({ sendData, calcData }: QuoteProps) => {
  // 選挙情報
  const electionInfo = {
    type: ElectoralClassConv(sendData?.electoralClass) || "未選択",
    area: prefCd.find((p) => p.value === sendData?.deliveryPrefecture)?.label || "未選択",
  };

  // 公費負担概算（7日間を仮定）
  const estimatedDays = 7;
  const publicSubsidyPerDay = 16100;
  const estimatedPublicSubsidy = publicSubsidyPerDay * estimatedDays;

  // 車両金額詳細
  const bodyValues: {
    label: string;
    value: string | number;
  }[] = [
    {
      label: domainLabel.carPrice,
      value: calcData?.subs?.carPrice,
    },
    {
      label: domainLabel.takingPlatform,
      value: calcData?.subs?.takingPlatform,
    },
    {
      label: SignalLightConv(sendData?.signalLight),
      value: calcData?.subs?.signalLight,
    },
    {
      label: `アンプサイズ：${WattConv(sendData?.ampSize)}`,
      value: calcData?.subs?.ampSize,
    },
    {
      label: `スピーカー：${SpeakerConv(sendData?.speaker)}`,
      value: 0,
    },
  ];
  // オプション金額詳細
  const optionValues: {
    label: string;
    value: string | number;
  }[] = [
    {
      label: `${domainLabel.totalMikePrice}: ${PiecesConv(sendData?.wirelessMikeNumber)}`,
      value: calcData?.options?.totalMikePrice,
    },
    {
      label: domainLabel.sdPrice,
      value: calcData?.options?.sdPrice,
    },
    {
      label: domainLabel.incomePrice,
      value: calcData?.options?.incomePrice,
    },
    {
      label: domainLabel.handSpeakerPrice,
      value: calcData?.options?.handSpeakerPrice,
    },
    {
      label: domainLabel.bluetoothUnit,
      value: calcData?.options?.bluetoothUnit,
    },
    {
      label: `${domainLabel.insurancePrice}: ${DayConv(sendData?.insuranceDays)}`,
      value: calcData?.options?.totalInsurancePrice,
    },
  ];

  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* ヘッダー */}
          <View style={styles.header}>
            <Text style={styles.fontSize20}>概算見積書</Text>
            <View style={{ width: 200, height: 30 }}>
              <Image src="./image/logo.png" />
            </View>
          </View>
          {/* アンダーライン */}
          <View style={styles.underline5} />
          {/* メインコンテンツ */}
          <View style={styles.main}>
            {/* 選挙情報セクション */}
            <View style={{ backgroundColor: "#FFF0F0", padding: 8, marginBottom: 10, borderRadius: 4 }}>
              <Grid flexDirection={"row"}>
                <GridItem flexGrow={1}>
                  <SimpleText size={"normal"} bold>選挙区分：{electionInfo.type}</SimpleText>
                </GridItem>
                <GridItem flexGrow={1}>
                  <SimpleText size={"normal"} bold>選挙エリア：{electionInfo.area}</SimpleText>
                </GridItem>
              </Grid>
            </View>

            <Grid flexDirection={"row"} style={{ alignItems: "center" }}>
              <GridItem flexGrow={5}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell textAlign={"left"} width={"300"} border={false}>
                        <SimpleText size={"large"}>
                          {`車両名:　${CarTypeConv(sendData?.carType[sendData?.carClass])}（${CarClassConv(sendData?.carClass)}）`}
                        </SimpleText>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell backgroundColor={"#E4E4E4"} width={"150"}>
                        車両金額
                      </TableCell>
                      <TableCell width={"150"} textAlign={"right"}>
                        {` ¥${calcData?.subTotalPrice?.toLocaleString()}（税込）`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell backgroundColor={"#E4E4E4"} width={"150"}>
                        オプション金額
                      </TableCell>
                      <TableCell width={"150"} textAlign={"right"}>
                        {` ¥${calcData?.optionTotalPrice?.toLocaleString()}（税込）`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell backgroundColor={"#E4E4E4"} width={"150"}>
                        配送料（往復）
                      </TableCell>
                      <TableCell width={"150"} textAlign={"right"}>
                        {calcData?.delivery?.isConsultation
                          ? "要相談"
                          : calcData?.delivery?.fee === 0
                          ? "無料"
                          : ` ¥${calcData?.deliveryPrice?.toLocaleString()}（税込）`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell backgroundColor={"#FFE4E4"} width={"150"} bold>
                        合計金額
                      </TableCell>
                      <TableCell width={"150"} bold textAlign={"right"} style={{ backgroundColor: "#FFE4E4" }}>
                        {` ¥${calcData?.totalPrice?.toLocaleString()}（税込）`}
                      </TableCell>
                    </TableRow>
                    {/* 公費負担額を目立たせる */}
                    <TableRow>
                      <TableCell backgroundColor={"#E4F4E4"} width={"150"} bold>
                        公費負担概算
                      </TableCell>
                      <TableCell width={"150"} bold textAlign={"right"} style={{ backgroundColor: "#E4F4E4" }}>
                        {`¥${estimatedPublicSubsidy.toLocaleString()}〜`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell border={false} width={"300"}>
                        <SimpleText size={"small"} style={{ color: "#666" }}>
                          ※公費負担は16,100円×レンタル日数（{estimatedDays}日間で試算）
                        </SimpleText>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </GridItem>
              <GridItem flexGrow={1}>
                <Grid flexDirection={"column"}>
                  <SimpleText size={"normal"} bold position={"center"}>
                    {ToDayJP()}
                  </SimpleText>
                  <View style={{ paddingBottom: 2 }} />
                  <SimpleText size={"normal"} bold position={"left"}>
                    株式会社ACEON
                  </SimpleText>
                  <SimpleText size={"normal"} bold position={"left"}>
                    選挙カーLABo.
                  </SimpleText>
                  <SimpleText size={"normal"} bold position={"left"}>
                    [事務所住所]
                  </SimpleText>
                  <SimpleText size={"normal"} bold position={"left"}>
                    〒683-0105
                  </SimpleText>
                  <SimpleText size={"normal"} bold position={"left"}>
                    鳥取県米子市葭津1576-1
                  </SimpleText>
                  <SimpleText size={"normal"} bold position={"left"}>
                    TEL:080-5342-9617
                  </SimpleText>
                  {/*<SimpleText size={"normal"} bold position={"left"}>*/}
                  {/*  [本社住所]*/}
                  {/*</SimpleText>*/}
                  {/*<SimpleText size={"normal"} bold position={"left"}>*/}
                  {/*  〒683-0105*/}
                  {/*</SimpleText>*/}
                  {/*<SimpleText size={"normal"} bold position={"left"}>*/}
                  {/*  鳥取県米子市葭津1508-7*/}
                  {/*</SimpleText>*/}
                </Grid>
              </GridItem>
            </Grid>
            <View style={{ borderTop: 1, margin: 5 }} />
            {/* table*/}
            <SimpleText size={"large"}>【車両金額詳細】</SimpleText>
            <View
              style={{
                marginRight: 25,
                marginLeft: 25,
                marginTop: 5,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>商品名</TableCell>
                    <TableCell width={"250"}>金額</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bodyValues.map((body, i) => {
                    return (
                      <>
                        <TableRow>
                          <TableCell>{body?.label}</TableCell>
                          <TableCell width={"250"} textAlign={"right"}>
                            {PriceTaxConv(body?.value)}
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                  <TableRow>
                    <TableCell border={false}></TableCell>
                    <TableCell
                      width={"250"}
                      textAlign={"right"}
                      style={{
                        backgroundColor: "#E4E4E4",
                      }}
                    >
                      {` ¥${calcData?.subTotalPrice?.toLocaleString()}（税込）`}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </View>
            {/* オプションテーブル*/}
            <View style={{ paddingBottom: 5 }}></View>
            <SimpleText size={"large"}>【オプション金額詳細】</SimpleText>
            <View
              style={{
                marginRight: 25,
                marginLeft: 25,
                marginTop: 5,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>商品名</TableCell>
                    <TableCell width={"250"}>金額</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {optionValues.map((body, i) => {
                    return (
                      <>
                        <TableRow>
                          <TableCell>{body?.label}</TableCell>
                          <TableCell width={"250"} textAlign={body?.value ? "right" : "center"}>
                            {body?.value ? PriceTaxConv(body?.value) : "無し"}
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                  <TableRow>
                    <TableCell border={false}></TableCell>
                    <TableCell
                      width={"250"}
                      textAlign={"right"}
                      style={{
                        backgroundColor: "#E4E4E4",
                      }}
                    >
                      {` ¥${calcData?.optionTotalPrice?.toLocaleString()}（税込）`}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </View>

            {/* 配送料テーブル*/}
            <View style={{ paddingBottom: 5 }}></View>
            <SimpleText size={"large"}>【配送料】</SimpleText>
            <View
              style={{
                marginRight: 25,
                marginLeft: 25,
                marginTop: 5,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>配送先</TableCell>
                    <TableCell width={"250"}>金額（往復）</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {prefCd.find((p) => p.value === sendData?.deliveryPrefecture)?.label || "未選択"}
                    </TableCell>
                    <TableCell width={"250"} textAlign={"right"}>
                      {calcData?.delivery?.isConsultation
                        ? "要相談"
                        : calcData?.delivery?.fee === 0
                        ? "無料"
                        : ` ¥${calcData?.deliveryPrice?.toLocaleString()}（税込）`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell border={false}></TableCell>
                    <TableCell
                      width={"250"}
                      textAlign={"right"}
                      style={{
                        backgroundColor: "#E4E4E4",
                      }}
                    >
                      {calcData?.delivery?.isConsultation
                        ? "要相談"
                        : calcData?.delivery?.fee === 0
                        ? "無料"
                        : ` ¥${calcData?.deliveryPrice?.toLocaleString()}（税込）`}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </View>

            {/*フッター*/}
            <View
              style={{
                marginRight: 25,
                marginLeft: 25,
                marginTop: 5,
              }}
            >
              <Grid flexDirection={"column"}>
                <SimpleText bold>■ 統一地方選挙について</SimpleText>
                <SimpleText style={{ color: "red" }}>
                  {"　 ※統一地方選挙につきましては、選挙カーは弊社関東拠点(千葉県木更津市)へ"}
                </SimpleText>
                <SimpleText style={{ color: "red" }}>
                  {
                    "　　引き取り・返却をお願い致します。ご自宅へのお届け・引き取りは別途料金で承ります。"
                  }
                </SimpleText>

                <SimpleText bold>■ 公費負担について</SimpleText>
                <SimpleText bold style={{ color: "red" }}>
                  {"　レンタカー代（16,100円×日数）は別途当社から選管にご請求させて頂きます。"}
                </SimpleText>
                <SimpleText style={{ color: "blue" }}>
                  {`　→ 参考：7日間の場合 ¥${estimatedPublicSubsidy.toLocaleString()}（公費負担概算）`}
                </SimpleText>
                <SimpleText style={{ color: "blue" }}>
                  {"　＊公費請求額は、供託物の没収に該当する場合は候補者様に請求いたします。"}
                </SimpleText>

                <SimpleText bold>■ 補償内容</SimpleText>
                <SimpleText>
                  {"　対人：無制限　対物：無制限（免責５万円）　搭乗者：1名につき上限3,000万円"}
                </SimpleText>
                <SimpleText>{"　車両：時価額（免責5万円）　看板：時価額"}</SimpleText>

                <SimpleText bold>■ 免責補償・看板保険は任意です</SimpleText>
                <SimpleText>
                  {`　任意で免責補償・看板保険（${calcData?.options?.insurancePrice.toLocaleString()}円/日）にご加入いただけます`}
                </SimpleText>

                <SimpleText bold>■ 休車補償料</SimpleText>
                <SimpleText>
                  {
                    "　＊車両・看板にキズ・へこみ等をつけてしまった場合、休車補償料を請求させて頂きます"
                  }
                </SimpleText>
                <SimpleText>
                  {"　・自走可能・・・2万円　　　・自走不可能・・・5万円（＋レッカー代）"}
                </SimpleText>

                <SimpleText bold>★ キャンセルポリシー</SimpleText>
                <SimpleText>
                  {
                    "　ご予約後、キャンセルとなった場合は以下のキャンセル料を申し受けます。ご了承ください。"
                  }
                </SimpleText>
                <SimpleText>
                  {"　　・レンタル日６０日前まで　　　　　　　　　　基本料金の５０%"}
                </SimpleText>
                <SimpleText>
                  {"　　・レンタル日５９日前から１６日前まで　　　　基本料金の８０%"}
                </SimpleText>
                <SimpleText>
                  {"　　・レンタル日１６日前から当日　　　　　　　　基本料金の１００%"}
                </SimpleText>
                <SimpleText style={{ color: "red" }}>
                  {
                    "注意）レンタル日の60日前以前であっても、看板デザイン決定後は基本料金の80%のキャンセル料を"
                  }
                </SimpleText>
                <SimpleText style={{ color: "red" }}>{"　　　申し受けます。"}</SimpleText>
                <SimpleText style={{ color: "red" }}>
                  {"　　　＊基本料金とは、見積合計金額と公費負担額の合計のことを指します。"}
                </SimpleText>
              </Grid>
            </View>
            {/*<Image src="./image/pdf_footer.png" />*/}
          </View>
        </Page>
      </Document>
    </>
  );
};

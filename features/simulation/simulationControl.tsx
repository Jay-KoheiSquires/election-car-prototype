import React, { useEffect, useCallback } from "react";
import { Box, Grid } from "@mui/material";
import { useForm, useWatch } from "react-hook-form";

import { useQState } from "../../hooks/library/useQstate";

import CarClass from "./parts/carClass";
import ElectionDiv from "./parts/electionDiv";
import CarOption from "./parts/carOption";
import Footer from "./parts/footer";

import CalcSimulation, { CalcDataType } from "./calc/calcSimulation";
import Layout from "../../component/templates/layout";
import { SendDataType } from "./utils/sendDataType";
import { formDefaultValue } from "./utils/formDefaultValue";

export const SimulationControl = () => {
  // グローバルステートを宣言
  const [sendData, setSendData] = useQState<SendDataType>(["sendData"], formDefaultValue);
  const [calcData, setCalcData] = useQState<CalcDataType>(["calcData"]);

  const {
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<SendDataType>({
    defaultValues: sendData,
  });

  // 選択中の値を監視（最適化: 必要なフィールドのみ）
  const watchedFields = useWatch({
    control,
    name: ["electoralClass", "carClass", "carType"],
  });
  const [electoralClass] = watchedFields;

  // メモ化された計算処理
  const calculatePrice = useCallback((value: SendDataType) => {
    return CalcSimulation(value);
  }, []);

  // 値が変更されるたびに計算（メモ化で最適化）
  useEffect(() => {
    const subscription = watch((value) => {
      const calcResult = calculatePrice(value as SendDataType);
      setSendData(value as SendDataType);
      setCalcData(calcResult);
    });
    return () => subscription.unsubscribe();
  }, [watch, calculatePrice, setSendData, setCalcData]);

  // 初回レンダリング時にグローバルステートにセット
  useEffect(() => {
    const firstCalcData = calculatePrice(sendData);
    setCalcData(firstCalcData);
    setSendData(sendData);
  }, []);

  return (
    <Layout>
      <Grid container>
        <form>
          {/* STEP 1: 選挙区分 */}
          <ElectionDiv control={control} errors={errors} setValue={setValue} />

          {/* STEP 2: サイズ・車両タイプ（おすすめ車種・料金比較を含む） */}
          <CarClass
            setValue={setValue}
            control={control}
            errors={errors}
            calcValue={calcData}
            electoralClass={electoralClass}
          />

          {/* STEP 3: オプション選択（車両装備 + 追加オプション統合） */}
          <CarOption control={control} errors={errors} calcValue={calcData} setValue={setValue} />

          {/* フッターとの間に余白を追加 */}
          <Box sx={{ pb: 4 }} />

          {/* フッター（Sticky） */}
          <Footer sendData={sendData} calcData={calcData} />
        </form>
      </Grid>
    </Layout>
  );
};

export default SimulationControl;

import React, { useEffect } from "react";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";

import {useForm, useWatch} from "react-hook-form";

import { useQState } from "../../hooks/library/useQstate";
import { useGetWindowSize } from "../../hooks/useGetWindowSize";

import CarClass from "./parts/carClass";
import ElectionDiv from "./parts/electionDiv";
import CarOption from "./parts/carOption";
import Footer from "./parts/footer";

import CalcSimulation, { CalcDataType } from "./calc/calcSimulation";
import Layout from "../../component/templates/layout";
import { SendDataType } from "./utils/sendDataType";
import { formDefaultValue } from "./utils/formDefaultValue";
import {ElectoralClass} from "./calc/calcSimlationParts";

export const SimulationControl = () => {
  const windowSize = useGetWindowSize();
  // const getElectoralClass: ElectoralClass = useWatch({
  //   control,
  //   name: "electoralClass",
  // });

  // グローバルステートを宣言
  const [sendData, setSendData] = useQState<SendDataType>(["sendData"], formDefaultValue);
  const [calcData, setCalcData] = useQState<CalcDataType>(["calcData"]);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<any>({
    defaultValues: sendData,
    // resolver: yupResolver(schema),
  });

  // 値が変更されるたびにページ全体がレンダリングされるため、最適解ではない。
  // メモ化などを行い、レンダリングをコントロールするべき
  // 特にAPI fetchは気をつけよう
  useEffect(() => {
    const subscription = watch((value: SendDataType) => {
      const calcData: CalcDataType = CalcSimulation(value);

      // グローバルステートにセット
      setSendData(value);
      console.dir(sendData)
      setCalcData(calcData);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  //
  // 初回レンダリング時にグローバルステートにセット
  //
  useEffect(() => {
    const firstCalcData: CalcDataType = CalcSimulation(sendData);
    setCalcData(firstCalcData);

    setSendData(sendData);
  }, [sendData, setCalcData, setSendData]);

  return (
    <Layout>
      <Grid container>
        {/*メインタイトル*/}
        <Grid item xs={9}>
          <Typography variant={"h5"}>料金シュミレーション</Typography>
        </Grid>
        <Grid item xs={3}>
          <Box textAlign={"right"}>
            <Button variant="contained" size={"small"} href="http://senkyocar-labo.com/">
              TOP
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ mb: 2, mt: 2 }} />
        </Grid>

        {/*TODO 最適化*/}
        <form
          // onClick={handleSubmit(formSubmitHandler)}
          // onChange={handleSubmit(formSubmitHandler)}
          // onBlur={handleSubmit(formSubmitHandler)}
        >
          {/*選挙区分*/}
          <ElectionDiv control={control} errors={errors} setValue={setValue} />

          {/*サイズ・車両タイプ*/}
          <CarClass setValue={setValue} control={control} errors={errors} calcValue={calcData} />

          {/*オプション選択*/}
          <CarOption control={control} errors={errors} calcValue={calcData} />

          {/*  フッター  */}
          <Footer sendData={sendData} calcData={calcData} />
        </form>
      </Grid>
    </Layout>
  );
};

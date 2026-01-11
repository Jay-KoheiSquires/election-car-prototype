import React, { useEffect, useMemo, useCallback, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Typography,
  Fab,
  Drawer,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, useWatch } from "react-hook-form";

import { useQState } from "../../hooks/library/useQstate";
import { useGetWindowSize } from "../../hooks/useGetWindowSize";

import CarClass from "./parts/carClass";
import ElectionDiv from "./parts/electionDiv";
import CarOption from "./parts/carOption";
import Footer from "./parts/footer";
import CarGallery from "./parts/carGallery";
import PriceComparison from "./parts/priceComparison";
import RecommendedCar from "./parts/recommendedCar";
import SharePanel from "./parts/sharePanel";
import ChatBot from "./parts/chatBot";
import DeliveryArea from "./parts/deliveryArea";

import CalcSimulation, { CalcDataType } from "./calc/calcSimulation";
import Layout from "../../component/templates/layout";
import { SendDataType } from "./utils/sendDataType";
import { formDefaultValue } from "./utils/formDefaultValue";

export const SimulationControl = () => {
  const windowSize = useGetWindowSize();
  const [chatOpen, setChatOpen] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);

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

  // 選択中の値を監視
  const watchedValues = useWatch({ control });
  const electoralClass = useWatch({ control, name: "electoralClass" });
  const carClass = useWatch({ control, name: "carClass" });

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

  // おすすめ車種を表示するかどうか
  useEffect(() => {
    if (electoralClass && carClass) {
      setShowRecommendation(true);
    }
  }, [electoralClass, carClass]);

  return (
    <Layout>
      <Grid container>
        {/* メインタイトル */}
        <Grid item xs={12} sm={9}>
          <Typography variant="h5" component="h1">
            料金シミュレーション
          </Typography>
          <Typography variant="caption" color="text.secondary">
            選挙カーのレンタル料金をリアルタイムで計算
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box textAlign="right" sx={{ mt: { xs: 1, sm: 0 } }}>
            <Button variant="contained" size="small" href="http://senkyocar-labo.com/">
              TOP
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ mb: 2, mt: 2 }} />
        </Grid>

        <form>
          {/* 選挙区分 */}
          <ElectionDiv control={control} errors={errors} setValue={setValue} />

          {/* サイズ・車両タイプ */}
          <CarClass setValue={setValue} control={control} errors={errors} calcValue={calcData} />

          {/* おすすめ車種提案 */}
          {showRecommendation && (
            <Grid item xs={12} sx={{ mb: 2 }}>
              <RecommendedCar
                electoralClass={electoralClass}
                onSelect={(carClassValue, carType) => {
                  setValue("carClass", carClassValue);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setValue(`carType.${carClassValue}` as any, carType as any);
                }}
              />
            </Grid>
          )}

          {/* 車両ギャラリー */}
          <Grid item xs={12} sx={{ mb: 2 }}>
            <CarGallery carClass={carClass} />
          </Grid>

          {/* オプション選択 */}
          <CarOption control={control} errors={errors} calcValue={calcData} />

          {/* 配送先エリア選択 */}
          <DeliveryArea control={control} errors={errors} />

          {/* 料金比較表 */}
          <Grid item xs={12} sx={{ mb: 2 }}>
            <PriceComparison
              electoralClass={electoralClass}
              currentCarClass={carClass}
              onSelect={(selectedClass) => setValue("carClass", selectedClass)}
            />
          </Grid>

          {/* 共有パネル（QRコード・LINE・メール） */}
          <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
            <SharePanel sendData={sendData} calcData={calcData} />
          </Grid>

          {/* フッター */}
          <Footer sendData={sendData} calcData={calcData} />
        </form>
      </Grid>

      {/* NEW: チャットボットFAB */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: "fixed",
          bottom: 120,
          right: 16,
          zIndex: 1000,
        }}
        onClick={() => setChatOpen(true)}
      >
        <ChatIcon />
      </Fab>

      {/* NEW: チャットボットドロワー */}
      <Drawer
        anchor="right"
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 400 } },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">よくある質問</Typography>
            <IconButton onClick={() => setChatOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <ChatBot />
        </Box>
      </Drawer>
    </Layout>
  );
};

export default SimulationControl;

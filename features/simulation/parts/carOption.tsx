/**
 * オプション選択コンポーネント（統合版）
 * 車両装備（看板/アンプ/スピーカー）+ 追加オプション（マイク/SD/保険等）
 */
import React, { useState, memo, useMemo } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useWatch } from "react-hook-form";
import { RhfSelectBox, RhfRadioButton } from "../../../component/molecules/rhfForm";
import RhfCheckbox from "../../../component/molecules/rhfForm/rhfCheckbox";
import { monthSelect } from "../../../constants/month";
import { useQState } from "../../../hooks/library/useQstate";
import { SendDataType } from "../utils/sendDataType";
import { apiData } from "../../api/apiData";
import { PriceConv } from "../../../utils/dataConv";
import { ElectoralClass } from "../calc/calcSimlationParts";
import { FullFormProps, CarClassType } from "../types/formTypes";
import { SignalLightForm, SwitchSignalLightForm } from "../forms/SignalLightForms";
import { AmpSizeForm, SwitchAmpSizeForm } from "../forms/ampSizeForms";
import { TakingPlatform } from "../forms/takingPlatform";
import TuneIcon from "@mui/icons-material/Tune";
import BuildIcon from "@mui/icons-material/Build";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { UnitPriceType } from "../../api/type";
import SectionHeader from "../../../component/molecules/SectionHeader";

/**
 * 車種コードからAPIデータを取得するヘルパー関数
 */
const getApiDataByCarType = (
  carClass: CarClassType,
  carType: string,
  electoralClass: ElectoralClass
): UnitPriceType | null => {
  if (!carClass || !carType || !electoralClass) return null;
  const classDataMap = apiData[carClass as keyof typeof apiData] as unknown;
  if (!classDataMap || typeof classDataMap !== "object") return null;

  const carTypeDataMap = (classDataMap as Record<string, unknown>)[carType];
  if (!carTypeDataMap || typeof carTypeDataMap !== "object") return null;

  const result = (carTypeDataMap as Record<string, UnitPriceType>)[electoralClass];
  return result || null;
};

/**
 * 保険説明モーダル
 */
const InsuranceInfoModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      保険について
      <IconButton onClick={onClose} size="small" aria-label="閉じる">
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      <Typography variant="body2" paragraph>
        選挙カーレンタルには、万が一の事故に備えた保険オプションをご用意しています。
      </Typography>
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        補償内容
      </Typography>
      <Box component="ul" sx={{ pl: 2, mb: 2 }}>
        <Typography component="li" variant="body2">対人賠償：無制限</Typography>
        <Typography component="li" variant="body2">対物賠償：無制限</Typography>
        <Typography component="li" variant="body2">車両補償：時価額</Typography>
        <Typography component="li" variant="body2">搭乗者傷害：1名につき最大3,000万円</Typography>
      </Box>
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        免責金額
      </Typography>
      <Box component="ul" sx={{ pl: 2, mb: 2 }}>
        <Typography component="li" variant="body2">対物事故：5万円</Typography>
        <Typography component="li" variant="body2">車両事故：10万円</Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">
        ※ 登壇台付き車両の場合は保険料が異なります。
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="contained">
        閉じる
      </Button>
    </DialogActions>
  </Dialog>
);

const CarOption = memo(({ control, errors, calcValue, setValue }: FullFormProps) => {
  // 監視フィールドを最適化（配列で一括取得）
  const watchedFields = useWatch({
    control,
    name: [
      "electoralClass",
      "carClass",
      "carType",
      "takingPlatform",
      "wirelessMike",
      "wirelessMikeNumber",
      "insurance",
      "insuranceDays",
    ],
  });

  const [
    getElectoralClass,
    getCarClass,
    getCarType,
    getTakingPlatform,
    getMike,
    getMikeNum,
    getInsurance,
    getInsuranceDays,
  ] = watchedFields as [
    ElectoralClass,
    CarClassType,
    Record<string, string>,
    boolean,
    boolean,
    number,
    boolean,
    number
  ];

  // UI状態
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [insuranceModalOpen, setInsuranceModalOpen] = useState(false);

  // 車種に応じたAPIデータをメモ化
  const carApiData = useMemo(() => {
    if (!getCarClass || !getCarType || !getElectoralClass) return null;
    const currentCarType = getCarType[getCarClass];
    if (!currentCarType) return null;
    return getApiDataByCarType(getCarClass, currentCarType, getElectoralClass);
  }, [getCarClass, getCarType, getElectoralClass]);

  // ワイヤレスマイクラベル
  const mikeLabel = useMemo(() => {
    if (!getElectoralClass) return PriceConv(0);
    return PriceConv(apiData.mikeValue[getElectoralClass] * (getMikeNum || 1));
  }, [getElectoralClass, getMikeNum]);

  // 保険ラベル
  const insuranceLabel = useMemo(() => {
    if (!getElectoralClass) return PriceConv(0);
    const basePrice = !getTakingPlatform
      ? apiData.insuranceValue.basic[getElectoralClass]
      : apiData.insuranceValue.takingPlatform[getElectoralClass];
    return PriceConv(basePrice * (getInsuranceDays || 1));
  }, [getElectoralClass, getTakingPlatform, getInsuranceDays]);

  const [sendData] = useQState<SendDataType>(["sendData"]);

  return (
    <>
      <Grid item xs={12}>
        <SectionHeader
          icon={<TuneIcon />}
          title="オプション"
          subtitle="必要なオプションをお選びください"
        />
      </Grid>

      <Grid item xs={12}>
        <Container fixed>
          {/* 車両装備セクション */}
          {getCarClass && carApiData && (
            <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: "grey.50", borderRadius: 2 }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <BuildIcon fontSize="small" color="action" />
                車両装備
              </Typography>

              <Grid container spacing={2}>
                {/* 登壇台（L/LLクラスのみ） */}
                {carApiData.unitPrice.takingPlatform !== null && (
                  <Grid item xs={12}>
                    <TakingPlatform
                      control={control}
                      errors={errors}
                      apiData={carApiData}
                      setValue={setValue}
                    />
                  </Grid>
                )}

                {/* 看板タイプ */}
                <Grid item xs={12} sm={6}>
                  {!getTakingPlatform || carApiData.unitPrice.takingPlatform === null ? (
                    <SignalLightForm
                      control={control}
                      errors={errors}
                      apiData={carApiData}
                      setValue={setValue}
                    />
                  ) : (
                    <SwitchSignalLightForm
                      control={control}
                      errors={errors}
                      apiData={carApiData}
                      setValue={setValue}
                    />
                  )}
                </Grid>

                {/* アンプサイズ */}
                <Grid item xs={12} sm={6}>
                  {!getTakingPlatform || carApiData.unitPrice.takingPlatform === null ? (
                    <AmpSizeForm
                      control={control}
                      errors={errors}
                      apiData={carApiData}
                      setValue={setValue}
                    />
                  ) : (
                    <SwitchAmpSizeForm
                      control={control}
                      errors={errors}
                      apiData={carApiData}
                      setValue={setValue}
                    />
                  )}
                </Grid>

                {/* スピーカー */}
                <Grid item xs={12} sm={6}>
                  <RhfRadioButton
                    control={control}
                    errors={errors}
                    name={"speaker"}
                    label={"スピーカー"}
                    size={"small"}
                    sx={{ pl: "20px" }}
                    options={[
                      { label: `2個（${PriceConv(0)}）`, value: "twe" },
                      { label: `4個（${PriceConv(0)}）`, value: "four" },
                    ]}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* 追加オプションセクション */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <TuneIcon fontSize="small" color="action" />
              追加オプション
            </Typography>

            {/* よく選ばれるオプション */}
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
              よく選ばれるオプション
            </Typography>
            <Grid container alignItems="flex-end" sx={{ mb: 2 }}>
              {/* ワイヤレスマイク */}
              <Grid item xs={12}>
                <Grid container spacing={0} alignItems="center">
                  <Grid item xs={6} sm={4}>
                    <RhfCheckbox
                      control={control}
                      errors={errors}
                      label={"ワイヤレスマイク"}
                      sx={{ pl: "20px" }}
                      options={[
                        {
                          label: mikeLabel,
                          name: "wirelessMike",
                          defaultChecked: sendData?.wirelessMike,
                        },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={6} sm={8}>
                    <RhfSelectBox
                      name={"wirelessMikeNumber"}
                      label={""}
                      disabled={!getMike}
                      variant={"standard"}
                      control={control}
                      errors={errors}
                      sx={{ maxWidth: 150 }}
                      options={[
                        { label: "1本", value: 1 },
                        { label: "2本", value: 2 },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* 保険 */}
              <Grid item xs={12}>
                <Grid container spacing={0} alignItems="center">
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <RhfCheckbox
                        control={control}
                        errors={errors}
                        label={"保険"}
                        row={true}
                        sx={{ pl: "20px" }}
                        options={[
                          {
                            label: insuranceLabel,
                            name: "insurance",
                            defaultChecked: sendData?.insurance,
                          },
                        ]}
                      />
                      <Tooltip title="保険の詳細を見る">
                        <IconButton
                          size="small"
                          onClick={() => setInsuranceModalOpen(true)}
                          aria-label="保険の詳細"
                          sx={{ ml: -1 }}
                        >
                          <InfoIcon fontSize="small" color="action" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={8}>
                    <RhfSelectBox
                      control={control}
                      errors={errors}
                      name={"insuranceDays"}
                      label={"日数"}
                      variant={"standard"}
                      disabled={!getInsurance}
                      sx={{ maxWidth: 150 }}
                      options={monthSelect}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* その他オプション（折りたたみ） */}
            <Button
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              endIcon={showMoreOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ mb: 1, textTransform: "none" }}
              size="small"
              color="inherit"
            >
              {showMoreOptions ? "その他オプションを閉じる" : "その他オプションを見る"}
            </Button>

            <Collapse in={showMoreOptions}>
              <Grid container alignItems="flex-end">
                {/* SD */}
                <Grid item xs={12}>
                  <RhfCheckbox
                    control={control}
                    errors={errors}
                    label={"SD"}
                    row={true}
                    sx={{ pl: "20px" }}
                    options={[
                      {
                        label: getElectoralClass ? PriceConv(apiData.sdPrice[getElectoralClass]) : PriceConv(0),
                        name: "sd",
                        defaultChecked: sendData?.sd,
                      },
                    ]}
                  />
                </Grid>

                {/* ワイヤレスインカム */}
                <Grid item xs={12}>
                  <RhfCheckbox
                    control={control}
                    errors={errors}
                    label={"ワイヤレスインカム"}
                    row={true}
                    sx={{ pl: "20px" }}
                    options={[
                      {
                        label: getElectoralClass ? PriceConv(apiData.incomePrice[getElectoralClass]) : PriceConv(0),
                        name: "wirelessIncome",
                        defaultChecked: sendData?.wirelessIncome,
                      },
                    ]}
                  />
                </Grid>

                {/* ハンドスピーカー */}
                <Grid item xs={12}>
                  <RhfCheckbox
                    control={control}
                    errors={errors}
                    label={"ハンドスピーカー"}
                    row={true}
                    sx={{ pl: "20px" }}
                    options={[
                      {
                        label: getElectoralClass ? PriceConv(apiData.handSpeaker[getElectoralClass]) : PriceConv(0),
                        name: "handSpeaker",
                        defaultChecked: sendData?.handSpeaker,
                      },
                    ]}
                  />
                </Grid>

                {/* Bluetoothユニット */}
                <Grid item xs={12}>
                  <RhfCheckbox
                    control={control}
                    errors={errors}
                    label={"Bluetoothユニット"}
                    row={true}
                    sx={{ pl: "20px" }}
                    options={[
                      {
                        label: getElectoralClass ? PriceConv(apiData.bluetoothUnit[getElectoralClass]) : PriceConv(0),
                        name: "bluetoothUnit",
                        defaultChecked: sendData?.bluetoothUnit,
                      },
                    ]}
                  />
                </Grid>

                {/* ボディラッピング */}
                <Grid item xs={12}>
                  <RhfCheckbox
                    control={control}
                    errors={errors}
                    label={"ボディラッピング"}
                    row={true}
                    sx={{ pl: "20px" }}
                    options={[
                      {
                        label: "要相談",
                        name: "bodyRapping",
                        defaultChecked: sendData?.bodyRapping,
                      },
                    ]}
                  />
                </Grid>
              </Grid>
            </Collapse>
          </Paper>

        </Container>
      </Grid>

      {/* 保険説明モーダル */}
      <InsuranceInfoModal
        open={insuranceModalOpen}
        onClose={() => setInsuranceModalOpen(false)}
      />
    </>
  );
});
CarOption.displayName = "CarOption";

export default CarOption;

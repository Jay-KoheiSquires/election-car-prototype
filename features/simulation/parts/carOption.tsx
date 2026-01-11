/**
 * オプション選択コンポーネント
 * ワイヤレスマイク、SDカード、保険などのオプション選択UI
 */
import React, { useEffect, useState, memo, useMemo } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { useWatch } from "react-hook-form";
import { RhfSelectBox } from "../../../component/molecules/rhfForm";
import RhfCheckbox from "../../../component/molecules/rhfForm/rhfCheckbox";
import { monthSelect } from "../../../constants/month";
import { useQState } from "../../../hooks/library/useQstate";
import { SendDataType } from "../utils/sendDataType";
import { apiData } from "../../api/apiData";
import { PriceConv } from "../../../utils/dataConv";
import { ElectoralClass } from "../calc/calcSimlationParts";
import { FormPropsWithCalcValue } from "../types/formTypes";

const CarOption = memo(({ control, errors, calcValue }: FormPropsWithCalcValue) => {
  const getElectoralClass: ElectoralClass = useWatch({
    control,
    name: "electoralClass",
  });
  const getTakingPlatform: boolean = useWatch({
    control,
    name: "takingPlatform",
  });
  //
  // ワイヤレスマイクフォーム制御
  //
  const [mikeLabel, setMikeLabel] = useState<string | number>(0);
  const [mikeNumberDisabled, setMikeNumberDisabled] = useState<boolean>(false);
  // マイクチェック状態とマイク数量を取得
  const getMike = useWatch({ control, name: "wirelessMike" });
  const getMikeNum = useWatch({ control, name: "wirelessMikeNumber" });
  useEffect(() => {
    // disable 解除
    setMikeNumberDisabled(!getMike);

    // ラベルセット
    const label = apiData.mikeValue[getElectoralClass] * getMikeNum;

    setMikeLabel(PriceConv(label));
  }, [getMike, getMikeNum, getElectoralClass]);

  //
  // 保険フォーム制御
  //
  const [insuranceLabel, setInsuranceLabel] = useState<string | number>(0);
  const [insuranceDaysDisabled, setInsuranceDaysDisabled] = useState<boolean>(false);
  // 保険チェック状態と保険日数を取得
  const getInsurance = useWatch({ control, name: "insurance" });
  const getInsuranceDays = useWatch({ control, name: "insuranceDays" });
  useEffect(() => {
    // disable 解除
    setInsuranceDaysDisabled(!getInsurance);

    // ラベルセット
    const label = !getTakingPlatform
      ? apiData.insuranceValue.basic[getElectoralClass] * getInsuranceDays
      : apiData.insuranceValue.takingPlatform[getElectoralClass] * getInsuranceDays;

    setInsuranceLabel(PriceConv(label));
  }, [getInsurance, getInsuranceDays, getElectoralClass, getTakingPlatform]);

  const [sendData] = useQState<SendDataType>(["sendData"]);

  return (
    <>
      <Grid item xs={12}>
        <Typography variant={"h6"}>オプション</Typography>
      </Grid>

      <Grid item xs={12}>
        <Container fixed>
          <Grid container alignItems="flex-end" sx={{ pb: 2 }}>
            <Grid item xs={12}>
              <Grid
                container
                spacing={0}
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
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
                    disabled={mikeNumberDisabled}
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

            <Grid item xs={12}>
              <RhfCheckbox
                control={control}
                errors={errors}
                label={"SD"}
                row={true}
                sx={{ pl: "20px" }}
                options={[
                  {
                    label: PriceConv(apiData.sdPrice[getElectoralClass]),
                    name: "sd",
                    defaultChecked: sendData?.sd,
                  },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <RhfCheckbox
                control={control}
                errors={errors}
                label={"ワイヤレスインカム"}
                row={true}
                sx={{ pl: "20px" }}
                options={[
                  {
                    label: PriceConv(apiData.incomePrice[getElectoralClass]),
                    name: "wirelessIncome",
                    defaultChecked: sendData?.wirelessIncome,
                  },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <RhfCheckbox
                control={control}
                errors={errors}
                label={"ハンドスピーカー"}
                row={true}
                sx={{ pl: "20px" }}
                options={[
                  {
                    label: PriceConv(apiData.handSpeaker[getElectoralClass]),
                    name: "handSpeaker",
                    defaultChecked: sendData?.handSpeaker,
                  },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <RhfCheckbox
                control={control}
                errors={errors}
                label={"Bluetoothユニット"}
                row={true}
                sx={{ pl: "20px" }}
                options={[
                  {
                    label: PriceConv(apiData.bluetoothUnit[getElectoralClass]),
                    name: "bluetoothUnit",
                    defaultChecked: sendData?.bluetoothUnit,
                  },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                spacing={0}
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid item xs={6} sm={4}>
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
                </Grid>
                <Grid item xs={6} sm={8}>
                  <RhfSelectBox
                    control={control}
                    errors={errors}
                    name={"insuranceDays"}
                    label={"日数"}
                    variant={"standard"}
                    disabled={insuranceDaysDisabled}
                    sx={{ maxWidth: 150 }}
                    options={monthSelect}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
              <Typography
                variant={"h6"}
                textAlign={{ xs: "left", sm: "right" }}
                fontStyle={"italic"}
              >
                {`オプション ¥ ${calcValue?.optionTotalPrice?.toLocaleString()}（税込）`}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </>
  );
});
CarOption.displayName = "CarOption";

export default CarOption;

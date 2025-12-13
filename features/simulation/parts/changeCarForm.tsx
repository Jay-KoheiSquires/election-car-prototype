import React from "react";
import { Grid, Typography } from "@mui/material";
import { RhfRadioButton } from "../../../component/molecules/rhfForm";
import { SignalLightForm, SwitchSignalLightForm } from "../forms/SignalLightForms";
import { UnitPriceType } from "../../api/type";
import { AmpSizeForm, SwitchAmpSizeForm } from "../forms/ampSizeForms";
import { useWatch } from "react-hook-form";
import { TakingPlatform } from "../forms/takingPlatform";
import { PriceConv } from "../../../utils/dataConv";

interface ChangeCarFormType {
  control: any;
  errors: any;
  setValue: any;
  apiData: UnitPriceType;
  calcValue: any;
}

export const ChangeCarForm = ({
  control,
  errors,
  setValue,
  apiData,
  calcValue,
}: ChangeCarFormType) => {
  const takingPlatform: boolean = useWatch({ control, name: "takingPlatform" });

  return (
    <Grid item xs={12}>
      <Grid container direction="row" justifyContent="flex-end" alignItems="flex-end">
        {/*照明*/}
        {/*<Grid item xs={0} sm={7} />*/}
        <Grid item xs={12} sm={5}>
          {apiData.unitPrice.takingPlatform !== null && (
            <TakingPlatform
              control={control}
              errors={errors}
              apiData={apiData}
              setValue={setValue}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={7} sx={{ pb: 2 }}>
          {!takingPlatform || apiData.unitPrice.takingPlatform === null ? (
            <SignalLightForm
              control={control}
              errors={errors}
              apiData={apiData}
              setValue={setValue}
            />
          ) : (
            <SwitchSignalLightForm
              control={control}
              errors={errors}
              apiData={apiData}
              setValue={setValue}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid container>
            <Grid item xs={12}>
              {!takingPlatform || apiData.unitPrice.takingPlatform === null ? (
                <AmpSizeForm
                  control={control}
                  errors={errors}
                  apiData={apiData}
                  setValue={setValue}
                />
              ) : (
                <SwitchAmpSizeForm
                  control={control}
                  errors={errors}
                  apiData={apiData}
                  setValue={setValue}
                />
              )}
            </Grid>

            <Grid item xs={12}>
              <RhfRadioButton
                control={control}
                errors={errors}
                name={"speaker"}
                label={"スピーカー"}
                size={"small"}
                // row={true}
                sx={{ pl: "20px" }}
                options={[
                  { label: `2個（${PriceConv(0)}）`, value: "twe" },
                  { label: `4個（${PriceConv(0)}）`, value: "four" },
                ]}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant={"h6"} textAlign={"right"} fontStyle={"italic"}>
            {`小計 ¥ ${calcValue?.subTotalPrice.toLocaleString()}（税込）`}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

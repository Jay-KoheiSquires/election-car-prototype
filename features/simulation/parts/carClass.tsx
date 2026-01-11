/**
 * 車クラス選択コンポーネント
 * S/M/L/LLクラスの選択と、選択されたクラスに応じた車種を表示
 */
import { Container, Divider, Grid, Typography } from "@mui/material";
import React, { memo } from "react";
import RhfToggleButtonGroup from "../../../component/molecules/rhfForm/rhfToggleButtonGroup";
import { useWatch } from "react-hook-form";
import CarType from "./carType";
import { CompactCar, LightCar, StandardCar, VanCar } from "../carType";
import { apiData } from "../../api/apiData";
import { FullFormProps, CarClassType } from "../types/formTypes";

/**
 * 車クラスに応じた車種選択コンポーネントを返す
 */
const CarClassSelector = memo(({
  carClass,
  control,
  setValue
}: {
  carClass: CarClassType;
  control: FullFormProps["control"];
  setValue: FullFormProps["setValue"];
}) => {
  switch (carClass) {
    case "s":
      return <LightCar control={control} setValue={setValue} apiData={apiData} />;
    case "m":
      return <CompactCar control={control} setValue={setValue} apiData={apiData} />;
    case "l":
      return <StandardCar control={control} setValue={setValue} apiData={apiData} />;
    case "ll":
      return <VanCar control={control} setValue={setValue} apiData={apiData} />;
    default:
      return null;
  }
});
CarClassSelector.displayName = "CarClassSelector";

const CarClass = ({ setValue, control, errors, calcValue }: FullFormProps) => {
  const getCarClass = useWatch({ control, name: "carClass" }) as CarClassType;

  return (
    <>
      <Grid item sm={12}>
        <Typography variant={"h6"}>サイズ・車両タイプ</Typography>
      </Grid>

      <Grid item sm={12} sx={{ pb: 2 }}>
        <Container fixed>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <RhfToggleButtonGroup
                control={control}
                errors={errors}
                name={"carClass"}
                options={[
                  { label: "Sクラス", value: "s" },
                  { label: "Mクラス", value: "m" },
                  { label: "Lクラス", value: "l" },
                  { label: "LLクラス", value: "ll" },
                ]}
                sx={{ pb: 3 }}
                // sx={{ pb: 3, whiteSpace: "nowrap" }}
              />
            </Grid>

            {/* 車種選択（条件レンダリングで表示） */}
            <CarClassSelector
              carClass={getCarClass}
              control={control}
              setValue={setValue}
            />
            {/* サブトータル */}
            <CarType setValue={setValue} control={control} errors={errors} calcValue={calcValue} />
          </Grid>
        </Container>
      </Grid>
      <Divider />
    </>
  );
};

export default CarClass;

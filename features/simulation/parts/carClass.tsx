import { Container, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import RhfToggleButtonGroup from "../../../component/molecules/rhfForm/rhfToggleButtonGroup";
import { useWatch } from "react-hook-form";
import CarType from "./carType";
import { CompactCar, LightCar, StandardCar, VanCar } from "../carType";
import { apiData } from "../../api/apiData";

// todo any!
interface Props {
  setValue: any;
  control: any;
  errors: any;
  calcValue: any;
}

const CarClass = ({ setValue, control, errors, calcValue }: Props) => {
  const [carClass, setCarClass] = useState<any>("");
  const getCarClass = useWatch({ control, name: "carClass" });

  useEffect(() => {
    // 車クラスによって表示する車を変更する
    switch (getCarClass) {
      case "s":
        setCarClass(<LightCar control={control} setValue={setValue} apiData={apiData} />);
        return;
      case "m":
        setCarClass(<CompactCar control={control} setValue={setValue} apiData={apiData} />);
        return;
      case "l":
        setCarClass(<StandardCar control={control} setValue={setValue} apiData={apiData} />);
        return;
      case "ll":
        setCarClass(<VanCar control={control} setValue={setValue} apiData={apiData} />);
        return;
      default:
        break;
    }
  }, [getCarClass]);

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

            {/*カード写真*/}

            {carClass}
            {/*サブトータル*/}
            <CarType setValue={setValue} control={control} errors={errors} calcValue={calcValue} />
          </Grid>
        </Container>
      </Grid>
      <Divider />
    </>
  );
};

export default CarClass;

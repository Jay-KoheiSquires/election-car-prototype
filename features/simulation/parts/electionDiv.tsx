import { Container, Grid } from "@mui/material";

import React from "react";
import { RhfSelectBox } from "../../../component/molecules/rhfForm";
import RhfToggleButtonGroup from "../../../component/molecules/rhfForm/rhfToggleButtonGroup";
import { useGetWindowSize } from "../../../hooks/useGetWindowSize";

interface Props {
  control: any;
  errors: any;
  setValue: any;
}

const ElectionDiv = ({ control, errors, setValue }: Props) => {
  const windowSize = useGetWindowSize();
  const noSmartPhone = windowSize.width >= 600;
  return (
    <>
      {noSmartPhone && (
        <Grid item sm={12}>
          <RhfToggleButtonGroup
            control={control}
            errors={errors}
            name={"electoralClass"}
            sx={{ pb: 1, whiteSpace: "nowrap" }}
            options={[
              {label: "一般地方選挙", value: "general"},
              {label: "統一地方選挙", value: "unity"},
              {label: "衆・参議院選挙", value: "national"},
              {label: "広告宣伝車", value: "ad"},
            ]}
          />
        </Grid>
      )}

      <Grid item sm={12} sx={{ pb: 2 }}>
        <Container fixed>
          <Grid container spacing={{ xs: 3, sm: 0 }}>
            {!noSmartPhone && (
              <Grid item xs={12}>
                <RhfSelectBox
                  control={control}
                  errors={errors}
                  label={"レンタル区分"}
                  name={"electoralClass"}
                  variant={"outlined"}
                  options={[
                    { label: "一般地方選挙", value: "general" },
                    { label: "統一地方選挙", value: "unity" },
                    { label: "衆・参議院選挙", value: "national"},
                    { label: "広告宣伝車", value: "ad" },
                  ]}
                />
              </Grid>
            )}
          </Grid>
        </Container>
      </Grid>
    </>
  );
};

export default ElectionDiv;

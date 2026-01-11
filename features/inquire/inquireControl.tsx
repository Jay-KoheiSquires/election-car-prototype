import { useGetWindowSize } from "../../hooks/useGetWindowSize";
import { useQState } from "../../hooks/library/useQstate";
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  SelectChangeEvent,
  Step,
  StepButton,
  Stepper,
  Typography,
} from "@mui/material";
import Layout from "../../component/templates/layout";

interface InquireControlProps {
  children: React.ReactNode
}

export const InquireControl = ({children}:InquireControlProps) => {
  const [stepper] = useQState<number>(["stepper"],0);

  return (
    <>
      <Layout>
        <Grid container>
          {/*メインタイトル*/}
          <Grid item xs={9}>
            <Typography variant={"h5"}>お問合せ</Typography>
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

          {/*ステッパー*/}
          <Grid item xs={12}>
            <Box sx={{ pb: 4 }}>
              <Container maxWidth="sm">
                <Stepper activeStep={stepper}>
                  <Step>
                    <StepButton>選挙情報</StepButton>
                  </Step>

                  <Step>
                    <StepButton>お客様情報</StepButton>
                  </Step>

                  <Step>
                    <StepButton>納車・引取</StepButton>
                  </Step>

                  <Step>
                    <StepButton>確認</StepButton>
                  </Step>
                </Stepper>
              </Container>
            </Box>
          </Grid>

          {/*メインフォーム*/}
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};

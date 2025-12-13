import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Quote } from "../../public/pdfCreate";
import { clearQStateStorage, useQState } from "../../hooks/library/useQstate";
import { CalcDataType } from "../simulation/calc/calcSimulation";
import { SendDataType } from "../simulation/utils/sendDataType";
import {useLeavePageConfirmation} from "../../hooks/useLeavePageConfirmation";

export const ThanksDisplay = () => {
  const router = useRouter();
  const [sendData] = useQState<SendDataType>(["sendData"]);
  const [calcData] = useQState<CalcDataType>(["calcData"]);
  const [stepper, setStepper] = useQState<number>(["stepper"]);

  // hookを使用して、PDFDownloadLinkがSSRを実行しないようにする
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setStepper(2)
    // 完了画面表示時に保存データをクリア
    clearQStateStorage([
      ["inputData"],
      ["sendData"],
      ["calcData"],
      ["stepper"]
    ]);
  }, []);

  return (
    <>
      <Container maxWidth="xs">
        <Grid container>
          <Grid item xs={12}>
            <Typography textAlign={"center"} variant={"h6"} sx={{ textDecoration: "underline" }}>
              送信完了
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ pt: 2 }}>
            <Typography textAlign={"center"}>お問合せいただきありがとうございました。</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography textAlign={"center"}>
              3営業日以内にご希望いただいた連絡方法にて、弊社からご連絡させていただきます。
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ pt: 2 }}>
            <Typography textAlign={"center"}>
              ＊3営業日以内に連絡がない場合は、お手数ですが、下記連絡先までお問合せください。
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ pt: 2 }}>
            <Typography variant={"h6"} textAlign={"center"}>
              080-5342-9617
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ pt: 4, pr: 2 }}>
            <Box textAlign={"center"}>
              {isClient && (
                <PDFDownloadLink
                  document={<Quote sendData={sendData} calcData={calcData} />}
                  fileName="[選挙レンタカーラボ]見積書.pdf"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Box textAlign={"center"}>
                    <Button variant="outlined" startIcon={<PictureAsPdfIcon />}>
                      お見積もりをダウンロード
                    </Button>
                  </Box>
                </PDFDownloadLink>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ pt: 4 }}>
            <Box textAlign={"center"}>
              <Button
                variant={"contained"}
                centerRipple={true}
                onClick={() => {
                  router.push("simulation");
                }}
              >
                {"シュミレーションに戻る"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

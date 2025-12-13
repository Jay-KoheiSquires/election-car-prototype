import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SendIcon from "@mui/icons-material/Send";

import { useRouter } from "next/router";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Quote } from "../../../public/pdfCreate";
import { CalcDataType } from "../calc/calcSimulation";
import { SendDataType } from "../utils/sendDataType";

interface Props {
  sendData: SendDataType;
  calcData: CalcDataType;
}

const Footer = ({ sendData, calcData }: Props) => {
  const router = useRouter();

  // hookを使用して、PDFDownloadLinkがSSRを実行しないようにする
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        mb: 0,
        // height: 110,
        background: "white",

        pl: 3,
        pr: 3,
      }}
    >
      <Box
        sx={{
          borderTop: "1px solid black",
        }}
      >
        <Grid container sx={{ pt: 1 }}>
          <Grid item sm={8}>
            <Grid container>
              <Grid item sm={12}>
                <Typography
                  variant={"h5"}
                  textAlign={"left"}
                  fontStyle={"italic"}
                  // noWrap={true}
                  paddingBottom={1}
                >
                  {`合計金額 ¥${calcData?.totalPrice?.toLocaleString()}（税込）`}
                </Typography>
              </Grid>
              <Typography variant={"caption"} textAlign={"left"} color={"red"}>
                {`公費負担額(¥16,100/日)は別途当社から選管にてご請求させていただきます。`}
              </Typography>

              <Typography variant={"caption"} textAlign={"left"} color={"red"}>
                *工費負担額とは、レンタカー利用の場合の借り入れ金額を指します。
              </Typography>
            </Grid>
          </Grid>

          <Grid item sm={4}>
            <Grid container rowSpacing={1}>
              <Grid item sm={12}>
                {isClient && (
                  <PDFDownloadLink
                    document={<Quote sendData={sendData} calcData={calcData} />}
                    fileName="[選挙レンタカーラボ]見積書.pdf"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <Box textAlign={"right"}>
                      <Button variant="outlined" startIcon={<PictureAsPdfIcon />}>
                        見積もり
                      </Button>
                    </Box>
                  </PDFDownloadLink>
                )}
              </Grid>

              <Grid item sm={12}>
                <Box textAlign={"right"}>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => {
                      router.push("contact");
                    }}
                  >
                    お問合せ
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Footer;

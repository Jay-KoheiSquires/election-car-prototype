import React, { useEffect, useState } from "react";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SendIcon from "@mui/icons-material/Send";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { useRouter } from "next/router";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Quote } from "../../../public/pdfCreate";
import { CalcDataType } from "../calc/calcSimulation";
import { SendDataType } from "../utils/sendDataType";
import { prefCd } from "../../../constants/preCd";

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
        background: "white",
        pl: { xs: 1.5, sm: 3 },
        pr: { xs: 1.5, sm: 3 },
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Grid container sx={{ pt: 1.5, pb: 1 }}>
          {/* 合計金額エリア */}
          <Grid item xs={12} sm={8}>
            <Grid container>
              {/* 合計金額 */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "left" },
                  }}
                >
                  合計金額 ¥{calcData?.totalPrice?.toLocaleString()}（税込）
                </Typography>
              </Grid>

              {/* 配送料内訳 */}
              {calcData?.delivery && (
                <Grid item xs={12} sx={{ pb: 0.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      justifyContent: { xs: "center", sm: "flex-start" },
                      flexWrap: "wrap",
                    }}
                  >
                    <LocalShippingIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      配送料（往復）：
                    </Typography>
                    {calcData.delivery.isConsultation ? (
                      <Chip label="要相談" size="small" color="warning" sx={{ height: 18, fontSize: "0.7rem" }} />
                    ) : calcData.delivery.fee === 0 ? (
                      <Chip label="無料" size="small" color="success" sx={{ height: 18, fontSize: "0.7rem" }} />
                    ) : (
                      <Typography variant="caption" fontWeight="bold">
                        ¥{calcData.delivery.fee.toLocaleString()}
                      </Typography>
                    )}
                    {sendData?.deliveryPrefecture && (
                      <Typography variant="caption" color="text.secondary">
                        （{prefCd.find(p => p.value === sendData.deliveryPrefecture)?.label}）
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}

              {/* 注意書き（PC表示のみ） */}
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="caption" textAlign="left" color="red">
                  公費負担額(¥16,100/日)は別途当社から選管にてご請求させていただきます。
                </Typography>
                <br />
                <Typography variant="caption" textAlign="left" color="red">
                  *公費負担額とは、レンタカー利用の場合の借り入れ金額を指します。
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* ボタンエリア */}
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: { xs: "center", sm: "flex-end" },
                flexDirection: { xs: "row", sm: "column" },
                pt: { xs: 1, sm: 0 },
              }}
            >
              {isClient && (
                <PDFDownloadLink
                  document={<Quote sendData={sendData} calcData={calcData} />}
                  fileName="[選挙レンタカーラボ]見積書.pdf"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<PictureAsPdfIcon />}
                    size="small"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    見積もり
                  </Button>
                </PDFDownloadLink>
              )}
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                size="small"
                onClick={() => router.push("contact")}
                sx={{ whiteSpace: "nowrap" }}
              >
                お問合せ
              </Button>
            </Box>
          </Grid>

          {/* 注意書き（スマホ表示のみ） */}
          <Grid item xs={12} sx={{ display: { xs: "block", sm: "none" }, pt: 1 }}>
            <Typography variant="caption" color="red" sx={{ fontSize: "0.65rem" }}>
              ※公費負担額(¥16,100/日)は別途選管にご請求
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Footer;

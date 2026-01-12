import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
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

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        background: "white",
        borderTop: "2px solid #e0e0e0",
        mx: { xs: -1, sm: -3 },
        px: { xs: 1, sm: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          px: { xs: 1, sm: 2 },
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        {/* 合計金額 */}
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="primary"
            sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
          >
            ¥{calcData?.totalPrice?.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            （税込）
          </Typography>
        </Box>

        {/* ボタンエリア */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
          {isClient && (
            <PDFDownloadLink
              document={<Quote sendData={sendData} calcData={calcData} />}
              fileName="[選挙レンタカーラボ]見積書.pdf"
              style={{ textDecoration: "none" }}
            >
              <Tooltip title="見積PDFダウンロード">
                <IconButton
                  color="primary"
                  sx={{
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: 1,
                  }}
                >
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>
            </PDFDownloadLink>
          )}
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => router.push("contact")}
            sx={{
              height: 40,
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            お問合せ
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;

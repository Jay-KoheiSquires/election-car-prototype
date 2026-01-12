import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Quote } from "../../public/pdfCreate";
import { clearQStateStorage, useQState } from "../../hooks/library/useQstate";
import { CalcDataType } from "../simulation/calc/calcSimulation";
import { SendDataType } from "../simulation/utils/sendDataType";
import {
  CarClassConv,
  CarTypeConv,
  PriceTaxConv,
} from "../../utils/dataConv";

// LINE Icon
const LineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

export const ThanksDisplay = () => {
  const router = useRouter();
  const [sendData] = useQState<SendDataType>(["sendData"]);
  const [calcData] = useQState<CalcDataType>(["calcData"]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // ページ離脱時にデータをクリア（PDFダウンロードを可能にするため即時クリアしない）
    const handleRouteChange = () => {
      clearQStateStorage([
        ["inputData"],
        ["sendData"],
        ["calcData"],
        ["stepper"],
      ]);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      // コンポーネントアンマウント時にもクリア
      handleRouteChange();
    };
  }, [router.events]);

  return (
    <Box sx={{ maxWidth: 480, mx: "auto" }}>
      {/* 成功アイコン */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <CheckCircleIcon
          sx={{
            fontSize: 64,
            color: "success.main",
          }}
        />
      </Box>

      {/* タイトル */}
      <Typography
        variant="h5"
        textAlign="center"
        fontWeight="bold"
        sx={{ mb: 1 }}
      >
        送信が完了しました！
      </Typography>
      <Typography
        variant="body2"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        お問合せいただきありがとうございます。
      </Typography>

      {/* お問合せ内容サマリー */}
      {(sendData || calcData) && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography
            variant="caption"
            fontWeight="bold"
            color="primary"
            sx={{ display: "block", mb: 1 }}
          >
            お問合せ内容
          </Typography>
          <Table size="small">
            <TableBody>
              {sendData?.carClass && (
                <TableRow>
                  <TableCell
                    sx={{ border: 0, py: 0.5, pl: 0, color: "text.secondary" }}
                  >
                    <Typography variant="caption">車種</Typography>
                  </TableCell>
                  <TableCell sx={{ border: 0, py: 0.5, pr: 0 }}>
                    <Typography variant="body2">
                      {CarClassConv(sendData.carClass)} /{" "}
                      {CarTypeConv(sendData.carType?.[sendData.carClass] || "")}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {calcData?.totalPrice && (
                <TableRow>
                  <TableCell
                    sx={{ border: 0, py: 0.5, pl: 0, color: "text.secondary" }}
                  >
                    <Typography variant="caption">合計金額</Typography>
                  </TableCell>
                  <TableCell sx={{ border: 0, py: 0.5, pr: 0 }}>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {PriceTaxConv(calcData.totalPrice)}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* 今後の流れ */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{ display: "block", mb: 1 }}
        >
          今後の流れ
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>2営業日以内</strong>
          にご希望の連絡方法にてご連絡いたします。
          <br />
          お急ぎの場合は下記までご連絡ください。
        </Typography>

        <Typography
          variant="h6"
          textAlign="center"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          080-5342-9617
        </Typography>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<LineIcon />}
              size="small"
              href="https://line.me/R/ti/p/@senkyocar-labo"
              target="_blank"
              sx={{ fontSize: "0.75rem" }}
            >
              LINEで相談
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PhoneIcon />}
              size="small"
              href="tel:080-5342-9617"
              sx={{ fontSize: "0.75rem" }}
            >
              電話で相談
            </Button>
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1, textAlign: "center" }}
        >
          受付時間: 平日 9:00〜18:00 / 土曜 9:00〜15:00
        </Typography>
      </Paper>

      {/* アクションボタン */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {isClient && sendData && calcData && (
          <PDFDownloadLink
            document={<Quote sendData={sendData} calcData={calcData} />}
            fileName="[選挙レンタカーラボ]見積書.pdf"
            style={{ textDecoration: "none" }}
          >
            <Button
              fullWidth
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
              size="large"
            >
              お見積書をダウンロード
            </Button>
          </PDFDownloadLink>
        )}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<HomeIcon />}
          size="large"
          onClick={() => router.push("/")}
        >
          シミュレーションに戻る
        </Button>
      </Box>
    </Box>
  );
};

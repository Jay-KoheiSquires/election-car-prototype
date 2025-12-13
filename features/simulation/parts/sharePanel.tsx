import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import QRCode from "qrcode.react";
import ShareIcon from "@mui/icons-material/Share";
import QrCodeIcon from "@mui/icons-material/QrCode2";
import EmailIcon from "@mui/icons-material/Email";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import { SendDataType } from "../utils/sendDataType";
import { CalcDataType } from "../calc/calcSimulation";

// LINE公式アカウントアイコン（SVG）
const LineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
  </svg>
);

interface SharePanelProps {
  sendData: SendDataType;
  calcData: CalcDataType;
}

const SharePanel: React.FC<SharePanelProps> = ({ sendData, calcData }) => {
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  // 見積もり内容をテキストに変換
  const estimateText = useMemo(() => {
    const electoralLabels: Record<string, string> = {
      general: "一般地方選挙",
      unity: "統一地方選挙",
      national: "衆・参議院選挙",
      ad: "広告宣伝車",
    };
    const carClassLabels: Record<string, string> = {
      s: "Sクラス",
      m: "Mクラス",
      l: "Lクラス",
      ll: "LLクラス",
    };

    return `【選挙カーレンタルラボ お見積り】
━━━━━━━━━━━━━━━━━
■ 選挙区分: ${electoralLabels[sendData?.electoralClass] || "-"}
■ 車両クラス: ${carClassLabels[sendData?.carClass] || "-"}
━━━━━━━━━━━━━━━━━
【料金内訳】
・車両基本料金: ¥${calcData?.subs?.carPrice?.toLocaleString() || 0}
・アンプ: ¥${calcData?.subs?.ampSize?.toLocaleString() || 0}
・回転灯: ¥${calcData?.subs?.signalLight?.toLocaleString() || 0}
・登壇台: ¥${calcData?.subs?.takingPlatform?.toLocaleString() || 0}
━━━━━━━━━━━━━━━━━
【オプション小計】
¥${calcData?.optionTotalPrice?.toLocaleString() || 0}
━━━━━━━━━━━━━━━━━
【合計金額】
¥${calcData?.totalPrice?.toLocaleString() || 0}（税込）
━━━━━━━━━━━━━━━━━
※公費負担額(¥16,100/日)は別途選管へ請求

詳細・お問い合わせはこちら:
https://senkyocar-labo.com/`;
  }, [sendData, calcData]);

  // 現在のURL（シミュレーション状態を含む）
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams();
    if (sendData?.electoralClass) params.set("ec", sendData.electoralClass);
    if (sendData?.carClass) params.set("cc", sendData.carClass);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [sendData]);

  // LINEで共有
  const shareToLine = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(estimateText)}`;
    window.open(lineUrl, "_blank", "width=600,height=500");
  };

  // LINE公式アカウントへ問い合わせ
  const contactViaLine = () => {
    // LINE公式アカウントのURLに見積もり内容を添付
    const lineOaUrl = `https://line.me/R/ti/p/@senkyocar-labo?text=${encodeURIComponent(estimateText)}`;
    window.open(lineOaUrl, "_blank");
  };

  // クリップボードにコピー
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(estimateText);
      setSnackbar({ open: true, message: "見積もり内容をコピーしました", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "コピーに失敗しました", severity: "error" });
    }
  };

  // メール送信（デモ）
  const sendEmail = () => {
    if (!email) {
      setSnackbar({ open: true, message: "メールアドレスを入力してください", severity: "error" });
      return;
    }
    // 実際にはEmailJSなどで送信
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent("選挙カーお見積り")}&body=${encodeURIComponent(estimateText)}`;
    window.location.href = mailtoUrl;
    setEmailDialogOpen(false);
    setSnackbar({ open: true, message: "メーラーを起動しました", severity: "success" });
  };

  return (
    <>
      <Card variant="outlined" sx={{ bgcolor: "grey.50" }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShareIcon fontSize="small" />
            見積もりを共有・保存
          </Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                color="success"
                startIcon={<LineIcon />}
                onClick={contactViaLine}
                size="small"
              >
                LINEで相談
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<QrCodeIcon />}
                onClick={() => setQrDialogOpen(true)}
                size="small"
              >
                QRコード
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={() => setEmailDialogOpen(true)}
                size="small"
              >
                メール送信
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={copyToClipboard}
                size="small"
              >
                コピー
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* QRコードダイアログ */}
      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          QRコードで共有
          <IconButton onClick={() => setQrDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <QRCode value={shareUrl} size={200} level="M" />
            <Typography variant="caption" display="block" sx={{ mt: 2, color: "text.secondary" }}>
              スマートフォンで読み取ると
              <br />
              この見積もり内容を確認できます
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* メール送信ダイアログ */}
      <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          見積もりをメールで送信
          <IconButton onClick={() => setEmailDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            sx={{ mt: 1, mb: 2 }}
          />
          <Button fullWidth variant="contained" onClick={sendEmail}>
            送信する
          </Button>
        </DialogContent>
      </Dialog>

      {/* スナックバー */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SharePanel;

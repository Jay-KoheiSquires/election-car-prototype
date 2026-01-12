import React from "react";
import { ThemeProvider } from "@mui/system";
import { createTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useGetWindowSize } from "../../hooks/useGetWindowSize";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff1250",
      light: "rgba(255, 18, 80, 0.08)",
      dark: "#d10040",
      contrastText: "#fff",
    },
    secondary: {
      main: "#1976d2",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1025,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Hiragino Sans"',
      '"Hiragino Kaku Gothic ProN"',
      "Meiryo",
      "sans-serif",
    ].join(","),
  },
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  const windowSize = useGetWindowSize();

  return (
    <ThemeProvider theme={theme}>
      {/* ヘッダー */}
      <AppBar position="sticky" color="default" elevation={0} sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* ロゴ + タイトル */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
            <Link href="https://senkyocar-labo.com/" style={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/image/common/logo.png"
                alt="選挙カーLABo."
                width={140}
                height={24}
                style={{ height: "auto" }}
              />
            </Link>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="text.primary"
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              料金シミュレーター
            </Typography>
          </Box>

          {/* TOPボタン */}
          <Button
            variant="contained"
            size="small"
            href="https://senkyocar-labo.com/"
          >
            TOP
          </Button>
        </Toolbar>
      </AppBar>

      {/* メインコンテンツ */}
      <Container disableGutters maxWidth="md">
        <Box
          sx={{
            mt: { xs: 0, md: 1 },
            pt: { xs: 2, sm: 3 },
            pl: { xs: 1, sm: 3 },
            pr: { xs: 1, sm: 3 },
            pb: { xs: 2, sm: 2 },
            minHeight: { xs: "auto", sm: windowSize.height - 150 },
            bgcolor: "white",
          }}
        >
          <Box
            sx={{
              pt: { xs: 0, sm: 2 },
              pl: { xs: 0, sm: 3 },
              pr: { xs: 0, sm: 3 },
              pb: { xs: 0, sm: 0 },
            }}
          >
            {children}
          </Box>
        </Box>
      </Container>

      {/* フッター */}
      <Box
        component="footer"
        sx={{
          py: 3,
          mt: 4,
          bgcolor: "grey.100",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="body2" color="text.secondary" gutterBottom>
            © 2024 選挙カーレンタルラボ All Rights Reserved.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <Link href="/contact" passHref style={{ textDecoration: "none" }}>
              <Typography variant="caption" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                お見積り・予約
              </Typography>
            </Link>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;

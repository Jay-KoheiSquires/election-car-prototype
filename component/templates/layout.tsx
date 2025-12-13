import React, { useState } from "react";
import { ThemeProvider } from "@mui/system";
import { createTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CalculateIcon from "@mui/icons-material/Calculate";
import HelpIcon from "@mui/icons-material/Help";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
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

const navItems = [
  { label: "料金シミュレーション", href: "/", icon: <CalculateIcon /> },
  { label: "よくある質問", href: "/faq", icon: <HelpIcon /> },
  { label: "導入事例", href: "/cases", icon: <PeopleIcon /> },
  { label: "活用ガイド", href: "/guide", icon: <MenuBookIcon /> },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const windowSize = useGetWindowSize();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <ThemeProvider theme={theme}>
      {/* ヘッダーナビゲーション */}
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: "white" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Link href="/" passHref style={{ textDecoration: "none", color: "inherit" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                選
              </Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="primary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                選挙カーレンタルラボ
              </Typography>
            </Box>
          </Link>

          {/* デスクトップナビゲーション */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref style={{ textDecoration: "none" }}>
                  <Button
                    startIcon={item.icon}
                    sx={{
                      color: "text.primary",
                      "&:hover": { bgcolor: "primary.light" },
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </Box>
          )}

          {/* モバイルメニューボタン */}
          {isMobile && (
            <IconButton onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* モバイルメニュードロワー */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            メニュー
          </Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <Link
                href={item.href}
                passHref
                style={{ textDecoration: "none", color: "inherit", width: "100%" }}
              >
                <ListItemButton onClick={() => setMobileMenuOpen(false)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* メインコンテンツ */}
      <Container disableGutters maxWidth="md">
        <Box sx={{ mt: { xs: 0, md: 1 } }}>
          <Paper
            elevation={3}
            sx={{
              pt: { xs: 2, sm: 3 },
              pl: { xs: 1, sm: 3 },
              pr: { xs: 1, sm: 3 },
              pb: { xs: 2, sm: 2 },
              minHeight: { xs: "auto", sm: windowSize.height - 150 },
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
          </Paper>
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
            <Link href="/faq" passHref style={{ textDecoration: "none" }}>
              <Typography variant="caption" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                よくある質問
              </Typography>
            </Link>
            <Link href="/cases" passHref style={{ textDecoration: "none" }}>
              <Typography variant="caption" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                導入事例
              </Typography>
            </Link>
            <Link href="/guide" passHref style={{ textDecoration: "none" }}>
              <Typography variant="caption" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                活用ガイド
              </Typography>
            </Link>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;

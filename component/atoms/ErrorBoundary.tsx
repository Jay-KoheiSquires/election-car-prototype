/**
 * Error Boundaryコンポーネント
 * 子コンポーネントのエラーをキャッチして優雅に処理
 */
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // エラーログをコンソールに出力（本番では外部サービスに送信）
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
              textAlign: "center",
              py: 4,
            }}
          >
            <ErrorOutlineIcon
              sx={{ fontSize: 64, color: "error.main", mb: 2 }}
              aria-hidden="true"
            />
            <Typography variant="h5" component="h1" gutterBottom>
              エラーが発生しました
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              申し訳ございません。予期しないエラーが発生しました。
              <br />
              ページを再読み込みしてお試しください。
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleRetry}
                aria-label="もう一度試す"
              >
                もう一度試す
              </Button>
              <Button
                variant="outlined"
                onClick={() => (window.location.href = "/")}
                aria-label="トップページに戻る"
              >
                トップページに戻る
              </Button>
            </Box>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <Typography variant="caption" component="pre" sx={{ whiteSpace: "pre-wrap" }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Chip,
  Grid,
} from "@mui/material";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CloseIcon from "@mui/icons-material/Close";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface CarGalleryProps {
  carClass: "s" | "m" | "l" | "ll";
}

// 各クラスの車両画像データ
const galleryData: Record<string, { images: string[]; title: string; features: string[] }> = {
  s: {
    title: "Sクラス - 軽自動車",
    images: [
      "image/car/sClass/heightWagon.png",
      "image/car/sClass/boxVan.png",
      "image/car/sClass/compact.png",
    ],
    features: ["小回りが利く", "住宅街に最適", "低コスト"],
  },
  m: {
    title: "Mクラス - コンパクトカー",
    images: [
      "image/car/mClass/corollaFielder.png",
      "image/car/mClass/shienta.png",
      "image/car/mClass/proBox.png",
    ],
    features: ["バランス型", "視認性良好", "汎用性高い"],
  },
  l: {
    title: "Lクラス - ミニバン",
    images: [
      "image/car/lClass/noah.png",
      "image/car/lClass/townAce.png",
    ],
    features: ["存在感抜群", "広い荷室", "登壇可能"],
  },
  ll: {
    title: "LLクラス - 大型バン",
    images: [
      "image/car/llClass/regiusaceAceBasic.png",
      "image/car/llClass/regiusaceAceWide.png",
    ],
    features: ["最大アピール力", "大型装備対応", "国政選挙向け"],
  },
};

// サンプル実績写真（実際の選挙カー）
const actualCarPhotos = [
  {
    src: "image/gallery/actual1.jpg",
    caption: "2023年 東京都議会議員選挙",
    area: "東京都",
  },
  {
    src: "image/gallery/actual2.jpg",
    caption: "2023年 統一地方選挙",
    area: "神奈川県",
  },
  {
    src: "image/gallery/actual3.jpg",
    caption: "2022年 参議院選挙",
    area: "大阪府",
  },
];

const CarGallery: React.FC<CarGalleryProps> = ({ carClass }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = galleryData[carClass] || galleryData.s;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : data.images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < data.images.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <Card variant="outlined">
        <CardContent sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhotoLibraryIcon fontSize="small" color="primary" />
              {data.title}
            </Typography>
            <Typography
              variant="caption"
              color="primary"
              sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
              onClick={() => setDialogOpen(true)}
            >
              実績写真を見る →
            </Typography>
          </Box>

          {/* 車両画像スライダー */}
          <Box sx={{ position: "relative", overflow: "hidden", borderRadius: 1 }}>
            <Box
              sx={{
                display: "flex",
                transition: "transform 0.3s ease",
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {data.images.map((img, idx) => (
                <Box
                  key={idx}
                  sx={{
                    minWidth: "100%",
                    height: 150,
                    backgroundImage: `url(${img})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    bgcolor: "grey.100",
                  }}
                />
              ))}
            </Box>

            {/* ナビゲーションボタン */}
            {data.images.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrev}
                  sx={{
                    position: "absolute",
                    left: 4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255,255,255,0.8)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
                  }}
                  size="small"
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: "absolute",
                    right: 4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255,255,255,0.8)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
                  }}
                  size="small"
                >
                  <NavigateNextIcon />
                </IconButton>
              </>
            )}

            {/* ドットインジケーター */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5, mt: 1 }}>
              {data.images.map((_, idx) => (
                <Box
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: idx === currentIndex ? "primary.main" : "grey.300",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* 特徴タグ */}
          <Box sx={{ display: "flex", gap: 0.5, mt: 1.5, flexWrap: "wrap" }}>
            {data.features.map((feature, idx) => (
              <Chip key={idx} label={feature} size="small" variant="outlined" color="primary" />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* 実績写真ダイアログ */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, pb: 0 }}>
          <Typography variant="h6">実際の選挙カー写真</Typography>
          <IconButton onClick={() => setDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Grid container spacing={2}>
            {actualCarPhotos.map((photo, idx) => (
              <Grid item xs={12} sm={4} key={idx}>
                <Card>
                  <Box
                    sx={{
                      height: 180,
                      backgroundImage: `url(${photo.src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      bgcolor: "grey.200",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="caption" sx={{ bgcolor: "rgba(0,0,0,0.5)", color: "white", px: 2, py: 1, borderRadius: 1 }}>
                      サンプル画像
                    </Typography>
                  </Box>
                  <CardContent sx={{ py: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {photo.caption}
                    </Typography>
                    <Chip label={photo.area} size="small" sx={{ mt: 0.5 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, textAlign: "center" }}>
            ※ 掲載写真は許可を得て掲載しています
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CarGallery;

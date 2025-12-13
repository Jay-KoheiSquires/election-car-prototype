import React, { useState } from "react";
import { Box, Typography, Chip, Paper, Grid, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface JapanMapProps {
  selectedPref: string;
  onSelect: (prefCode: string, prefName: string) => void;
}

// 都道府県データ
const prefectures = [
  { code: "01", name: "北海道", region: "北海道" },
  { code: "02", name: "青森県", region: "東北" },
  { code: "03", name: "岩手県", region: "東北" },
  { code: "04", name: "宮城県", region: "東北" },
  { code: "05", name: "秋田県", region: "東北" },
  { code: "06", name: "山形県", region: "東北" },
  { code: "07", name: "福島県", region: "東北" },
  { code: "08", name: "茨城県", region: "関東" },
  { code: "09", name: "栃木県", region: "関東" },
  { code: "10", name: "群馬県", region: "関東" },
  { code: "11", name: "埼玉県", region: "関東" },
  { code: "12", name: "千葉県", region: "関東" },
  { code: "13", name: "東京都", region: "関東" },
  { code: "14", name: "神奈川県", region: "関東" },
  { code: "15", name: "新潟県", region: "中部" },
  { code: "16", name: "富山県", region: "中部" },
  { code: "17", name: "石川県", region: "中部" },
  { code: "18", name: "福井県", region: "中部" },
  { code: "19", name: "山梨県", region: "中部" },
  { code: "20", name: "長野県", region: "中部" },
  { code: "21", name: "岐阜県", region: "中部" },
  { code: "22", name: "静岡県", region: "中部" },
  { code: "23", name: "愛知県", region: "中部" },
  { code: "24", name: "三重県", region: "近畿" },
  { code: "25", name: "滋賀県", region: "近畿" },
  { code: "26", name: "京都府", region: "近畿" },
  { code: "27", name: "大阪府", region: "近畿" },
  { code: "28", name: "兵庫県", region: "近畿" },
  { code: "29", name: "奈良県", region: "近畿" },
  { code: "30", name: "和歌山県", region: "近畿" },
  { code: "31", name: "鳥取県", region: "中国" },
  { code: "32", name: "島根県", region: "中国" },
  { code: "33", name: "岡山県", region: "中国" },
  { code: "34", name: "広島県", region: "中国" },
  { code: "35", name: "山口県", region: "中国" },
  { code: "36", name: "徳島県", region: "四国" },
  { code: "37", name: "香川県", region: "四国" },
  { code: "38", name: "愛媛県", region: "四国" },
  { code: "39", name: "高知県", region: "四国" },
  { code: "40", name: "福岡県", region: "九州" },
  { code: "41", name: "佐賀県", region: "九州" },
  { code: "42", name: "長崎県", region: "九州" },
  { code: "43", name: "熊本県", region: "九州" },
  { code: "44", name: "大分県", region: "九州" },
  { code: "45", name: "宮崎県", region: "九州" },
  { code: "46", name: "鹿児島県", region: "九州" },
  { code: "47", name: "沖縄県", region: "沖縄" },
];

const regions = [
  { name: "北海道", color: "#4CAF50", prefCodes: ["01"] },
  { name: "東北", color: "#2196F3", prefCodes: ["02", "03", "04", "05", "06", "07"] },
  { name: "関東", color: "#FF9800", prefCodes: ["08", "09", "10", "11", "12", "13", "14"] },
  { name: "中部", color: "#9C27B0", prefCodes: ["15", "16", "17", "18", "19", "20", "21", "22", "23"] },
  { name: "近畿", color: "#F44336", prefCodes: ["24", "25", "26", "27", "28", "29", "30"] },
  { name: "中国", color: "#00BCD4", prefCodes: ["31", "32", "33", "34", "35"] },
  { name: "四国", color: "#795548", prefCodes: ["36", "37", "38", "39"] },
  { name: "九州", color: "#E91E63", prefCodes: ["40", "41", "42", "43", "44", "45", "46"] },
  { name: "沖縄", color: "#009688", prefCodes: ["47"] },
];

const JapanMap: React.FC<JapanMapProps> = ({ selectedPref, onSelect }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const getRegionColor = (prefCode: string) => {
    const region = regions.find((r) => r.prefCodes.includes(prefCode));
    return region?.color || "#999";
  };

  const getRegionName = (prefCode: string) => {
    const region = regions.find((r) => r.prefCodes.includes(prefCode));
    return region?.name || "";
  };

  const filteredPrefs = selectedRegion
    ? prefectures.filter((p) => getRegionName(p.code) === selectedRegion)
    : [];

  const selectedPrefData = prefectures.find((p) => p.code === selectedPref);

  return (
    <Box>
      {/* 選択中の表示 */}
      {selectedPref && (
        <Paper
          sx={{
            p: 1.5,
            mb: 2,
            bgcolor: "primary.light",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CheckCircleIcon color="primary" fontSize="small" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              選択中の選挙区
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold" color="primary.dark">
              {selectedPrefData?.name}（{selectedPrefData?.region}）
            </Typography>
          </Box>
        </Paper>
      )}

      {/* 地域選択 */}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
        ① 地域を選択
      </Typography>
      <Grid container spacing={0.5} sx={{ mb: 2 }}>
        {regions.map((region) => (
          <Grid item xs={4} sm={3} key={region.name}>
            <Button
              fullWidth
              variant={selectedRegion === region.name ? "contained" : "outlined"}
              size="small"
              onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
              sx={{
                fontSize: "0.7rem",
                py: 0.75,
                borderColor: region.color,
                color: selectedRegion === region.name ? "white" : region.color,
                bgcolor: selectedRegion === region.name ? region.color : "transparent",
                "&:hover": {
                  bgcolor: selectedRegion === region.name ? region.color : `${region.color}20`,
                  borderColor: region.color,
                },
              }}
            >
              {region.name}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* 都道府県選択 */}
      {selectedRegion && (
        <>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
            ② {selectedRegion}の都道府県を選択
          </Typography>
          <Grid container spacing={0.5}>
            {filteredPrefs.map((pref) => {
              const isSelected = selectedPref === pref.code;
              const regionColor = getRegionColor(pref.code);

              return (
                <Grid item xs={4} sm={3} key={pref.code}>
                  <Button
                    fullWidth
                    variant={isSelected ? "contained" : "outlined"}
                    size="small"
                    onClick={() => onSelect(pref.code, pref.name)}
                    sx={{
                      fontSize: "0.7rem",
                      py: 0.75,
                      borderColor: isSelected ? "primary.main" : regionColor,
                      color: isSelected ? "white" : regionColor,
                      bgcolor: isSelected ? "primary.main" : "transparent",
                      "&:hover": {
                        bgcolor: isSelected ? "primary.dark" : `${regionColor}20`,
                      },
                    }}
                  >
                    {pref.name.replace(/県|府|都/, "")}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      {/* 未選択時のヒント */}
      {!selectedRegion && !selectedPref && (
        <Paper variant="outlined" sx={{ p: 2, textAlign: "center", bgcolor: "grey.50" }}>
          <Typography variant="body2" color="text.secondary">
            上の地域ボタンをタップして
            <br />
            選挙区を選んでください
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default JapanMap;

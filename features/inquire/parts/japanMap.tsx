import React, { useState } from "react";
import { Box, Tooltip, Typography, Chip, Paper } from "@mui/material";

interface JapanMapProps {
  selectedPref: string;
  onSelect: (prefCode: string, prefName: string) => void;
}

// 都道府県データ（コード、名前、地図上の位置）
const prefectures = [
  { code: "01", name: "北海道", region: "北海道", x: 80, y: 15 },
  { code: "02", name: "青森県", region: "東北", x: 75, y: 35 },
  { code: "03", name: "岩手県", region: "東北", x: 78, y: 42 },
  { code: "04", name: "宮城県", region: "東北", x: 76, y: 50 },
  { code: "05", name: "秋田県", region: "東北", x: 70, y: 43 },
  { code: "06", name: "山形県", region: "東北", x: 70, y: 52 },
  { code: "07", name: "福島県", region: "東北", x: 72, y: 58 },
  { code: "08", name: "茨城県", region: "関東", x: 75, y: 65 },
  { code: "09", name: "栃木県", region: "関東", x: 70, y: 62 },
  { code: "10", name: "群馬県", region: "関東", x: 64, y: 62 },
  { code: "11", name: "埼玉県", region: "関東", x: 68, y: 68 },
  { code: "12", name: "千葉県", region: "関東", x: 78, y: 72 },
  { code: "13", name: "東京都", region: "関東", x: 72, y: 72 },
  { code: "14", name: "神奈川県", region: "関東", x: 70, y: 76 },
  { code: "15", name: "新潟県", region: "中部", x: 60, y: 52 },
  { code: "16", name: "富山県", region: "中部", x: 52, y: 58 },
  { code: "17", name: "石川県", region: "中部", x: 48, y: 55 },
  { code: "18", name: "福井県", region: "中部", x: 45, y: 62 },
  { code: "19", name: "山梨県", region: "中部", x: 62, y: 70 },
  { code: "20", name: "長野県", region: "中部", x: 58, y: 65 },
  { code: "21", name: "岐阜県", region: "中部", x: 50, y: 67 },
  { code: "22", name: "静岡県", region: "中部", x: 58, y: 75 },
  { code: "23", name: "愛知県", region: "中部", x: 52, y: 73 },
  { code: "24", name: "三重県", region: "近畿", x: 47, y: 76 },
  { code: "25", name: "滋賀県", region: "近畿", x: 44, y: 68 },
  { code: "26", name: "京都府", region: "近畿", x: 40, y: 65 },
  { code: "27", name: "大阪府", region: "近畿", x: 40, y: 72 },
  { code: "28", name: "兵庫県", region: "近畿", x: 35, y: 68 },
  { code: "29", name: "奈良県", region: "近畿", x: 43, y: 75 },
  { code: "30", name: "和歌山県", region: "近畿", x: 38, y: 80 },
  { code: "31", name: "鳥取県", region: "中国", x: 30, y: 62 },
  { code: "32", name: "島根県", region: "中国", x: 22, y: 62 },
  { code: "33", name: "岡山県", region: "中国", x: 30, y: 70 },
  { code: "34", name: "広島県", region: "中国", x: 22, y: 70 },
  { code: "35", name: "山口県", region: "中国", x: 14, y: 70 },
  { code: "36", name: "徳島県", region: "四国", x: 35, y: 78 },
  { code: "37", name: "香川県", region: "四国", x: 32, y: 75 },
  { code: "38", name: "愛媛県", region: "四国", x: 24, y: 78 },
  { code: "39", name: "高知県", region: "四国", x: 28, y: 82 },
  { code: "40", name: "福岡県", region: "九州", x: 12, y: 75 },
  { code: "41", name: "佐賀県", region: "九州", x: 8, y: 78 },
  { code: "42", name: "長崎県", region: "九州", x: 4, y: 78 },
  { code: "43", name: "熊本県", region: "九州", x: 10, y: 82 },
  { code: "44", name: "大分県", region: "九州", x: 16, y: 80 },
  { code: "45", name: "宮崎県", region: "九州", x: 14, y: 88 },
  { code: "46", name: "鹿児島県", region: "九州", x: 8, y: 90 },
  { code: "47", name: "沖縄県", region: "沖縄", x: 5, y: 98 },
];

const regionColors: Record<string, string> = {
  北海道: "#4CAF50",
  東北: "#2196F3",
  関東: "#FF9800",
  中部: "#9C27B0",
  近畿: "#F44336",
  中国: "#00BCD4",
  四国: "#795548",
  九州: "#E91E63",
  沖縄: "#009688",
};

const JapanMap: React.FC<JapanMapProps> = ({ selectedPref, onSelect }) => {
  const [hoveredPref, setHoveredPref] = useState<string | null>(null);

  return (
    <Box>
      {/* 地図エリア */}
      <Paper
        variant="outlined"
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 280, sm: 350 },
          bgcolor: "#f5f9ff",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        {prefectures.map((pref) => {
          const isSelected = selectedPref === pref.code;
          const isHovered = hoveredPref === pref.code;

          return (
            <Tooltip
              key={pref.code}
              title={`${pref.name}（${pref.region}）`}
              arrow
              placement="top"
            >
              <Box
                onClick={() => onSelect(pref.code, pref.name)}
                onMouseEnter={() => setHoveredPref(pref.code)}
                onMouseLeave={() => setHoveredPref(null)}
                sx={{
                  position: "absolute",
                  left: `${pref.x}%`,
                  top: `${pref.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: { xs: 28, sm: 36 },
                  height: { xs: 28, sm: 36 },
                  borderRadius: "50%",
                  bgcolor: isSelected
                    ? "primary.main"
                    : isHovered
                    ? regionColors[pref.region]
                    : "white",
                  border: `2px solid ${regionColors[pref.region]}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: isSelected || isHovered ? 3 : 1,
                  zIndex: isSelected || isHovered ? 10 : 1,
                  "&:hover": {
                    transform: "translate(-50%, -50%) scale(1.2)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: "0.5rem", sm: "0.6rem" },
                    fontWeight: "bold",
                    color: isSelected || isHovered ? "white" : regionColors[pref.region],
                    lineHeight: 1,
                  }}
                >
                  {pref.name.slice(0, 2)}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Paper>

      {/* 地域凡例 */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1.5, justifyContent: "center" }}>
        {Object.entries(regionColors).map(([region, color]) => (
          <Chip
            key={region}
            label={region}
            size="small"
            sx={{
              bgcolor: color,
              color: "white",
              fontSize: "0.65rem",
              height: 22,
              "& .MuiChip-label": { px: 1 },
            }}
          />
        ))}
      </Box>

      {/* 選択中の都道府県 */}
      {selectedPref && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            選択中:
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {prefectures.find((p) => p.code === selectedPref)?.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default JapanMap;

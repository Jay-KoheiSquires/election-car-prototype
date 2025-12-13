import React, { useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { ElectoralClass } from "../calc/calcSimlationParts";

interface RecommendedCarProps {
  electoralClass: ElectoralClass;
  onSelect: (carClass: "s" | "m" | "l" | "ll", carType: string) => void;
}

interface Recommendation {
  carClass: "s" | "m" | "l" | "ll";
  carType: string;
  carName: string;
  reason: string;
  tags: string[];
}

const RecommendedCar: React.FC<RecommendedCarProps> = ({ electoralClass, onSelect }) => {
  // 選挙区分に応じたおすすめ車種を計算
  const recommendations: Recommendation[] = useMemo(() => {
    switch (electoralClass) {
      case "unity":
        return [
          {
            carClass: "m",
            carType: "corollaFielder",
            carName: "カローラ フィールダー",
            reason: "統一地方選挙で最も人気。バランスの取れた視認性と走行性能",
            tags: ["人気No.1", "コスパ◎"],
          },
          {
            carClass: "l",
            carType: "noah",
            carName: "NOAH",
            reason: "存在感を出したい場合に。登壇台も設置可能",
            tags: ["登壇可能", "存在感"],
          },
        ];
      case "general":
        return [
          {
            carClass: "s",
            carType: "heightWagon",
            carName: "軽ハイトワゴン",
            reason: "住宅街での取り回しが良く、コストを抑えたい場合に最適",
            tags: ["低コスト", "小回り◎"],
          },
          {
            carClass: "m",
            carType: "shienta",
            carName: "トヨタ シエンタ",
            reason: "広い荷室と良好な視認性。一般地方選挙の定番",
            tags: ["定番", "荷室広い"],
          },
        ];
      case "national":
        return [
          {
            carClass: "ll",
            carType: "regiusaceAceWide",
            carName: "レジアスエース（ワイド）",
            reason: "国政選挙向け。最大のアピール力と大型音響設備に対応",
            tags: ["国政向け", "最大級"],
          },
          {
            carClass: "l",
            carType: "noah_90",
            carName: "NOAH・VOXY 90型",
            reason: "最新モデルで視認性抜群。都市部での活動に最適",
            tags: ["最新型", "都市向け"],
          },
        ];
      case "ad":
        return [
          {
            carClass: "ll",
            carType: "regiusaceAceBasic",
            carName: "レジアスエース（標準）",
            reason: "広告宣伝車として十分なサイズ。ラッピングも映える",
            tags: ["ラッピング◎", "広告向け"],
          },
          {
            carClass: "l",
            carType: "townAce",
            carName: "タウンエース",
            reason: "コンパクトながら十分な存在感。街中での広告に最適",
            tags: ["街宣向け", "コンパクト"],
          },
        ];
      default:
        return [];
    }
  }, [electoralClass]);

  if (recommendations.length === 0) return null;

  const electoralLabels: Record<ElectoralClass, string> = {
    general: "一般地方選挙",
    unity: "統一地方選挙",
    national: "衆・参議院選挙",
    ad: "広告宣伝車",
  };

  return (
    <Alert
      severity="info"
      icon={<AutoAwesomeIcon />}
      sx={{
        "& .MuiAlert-message": { width: "100%" },
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        「{electoralLabels[electoralClass]}」におすすめの車種
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
        {recommendations.map((rec, idx) => (
          <Card
            key={idx}
            variant="outlined"
            sx={{
              flex: "1 1 250px",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "primary.main",
                boxShadow: 1,
              },
            }}
            onClick={() => onSelect(rec.carClass, rec.carType)}
          >
            <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <DirectionsCarIcon fontSize="small" color="primary" />
                <Typography variant="body2" fontWeight="bold">
                  {rec.carName}
                </Typography>
                <Chip
                  label={rec.carClass.toUpperCase() + "クラス"}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                {rec.reason}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {rec.tags.map((tag, tagIdx) => (
                  <Chip
                    key={tagIdx}
                    label={tag}
                    size="small"
                    color={tagIdx === 0 ? "success" : "default"}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Alert>
  );
};

export default RecommendedCar;

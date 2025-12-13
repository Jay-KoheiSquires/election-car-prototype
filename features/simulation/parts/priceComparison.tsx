import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { apiData } from "../../api/apiData";
import { ElectoralClass } from "../calc/calcSimlationParts";
import { ClassType } from "../../api/type";

interface PriceComparisonProps {
  electoralClass: ElectoralClass;
  currentCarClass: "s" | "m" | "l" | "ll";
  onSelect: (carClass: "s" | "m" | "l" | "ll") => void;
}

interface CarClassInfo {
  key: "s" | "m" | "l" | "ll";
  name: string;
  description: string;
  recommended: string[];
  basePrice: number;
}

const PriceComparison: React.FC<PriceComparisonProps> = ({
  electoralClass,
  currentCarClass,
  onSelect,
}) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 各クラスの情報を生成
  const carClasses: CarClassInfo[] = useMemo(() => {
    const getPrice = (classKey: "s" | "m" | "l" | "ll", carKey: string) => {
      try {
        const classData = apiData[classKey];
        if (classData && typeof classData === "object") {
          const carData = (classData as Record<string, ClassType>)[carKey];
          if (carData && carData[electoralClass]) {
            return carData[electoralClass].unitPrice?.car || 0;
          }
        }
        return 0;
      } catch {
        return 0;
      }
    };

    return [
      {
        key: "s" as const,
        name: "Sクラス",
        description: "軽自動車・コンパクト",
        recommended: ["町村議会", "小規模選挙区"],
        basePrice: getPrice("s", "heightWagon"),
      },
      {
        key: "m" as const,
        name: "Mクラス",
        description: "普通車",
        recommended: ["市議会", "県議会"],
        basePrice: getPrice("m", "corollaFielder"),
      },
      {
        key: "l" as const,
        name: "Lクラス",
        description: "ミニバン",
        recommended: ["政令市", "知事選"],
        basePrice: getPrice("l", "noah"),
      },
      {
        key: "ll" as const,
        name: "LLクラス",
        description: "大型バン",
        recommended: ["国政選挙", "大規模選挙"],
        basePrice: getPrice("ll", "regiusaceAceBasic"),
      },
    ];
  }, [electoralClass]);

  const currentClass = carClasses.find((c) => c.key === currentCarClass);
  const currentPrice = currentClass?.basePrice || 0;

  return (
    <Card variant="outlined">
      <CardContent sx={{ pb: expanded ? 2 : 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CompareArrowsIcon fontSize="small" color="primary" />
            他クラスと料金比較
          </Typography>
          <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          {/* モバイル：カードレイアウト */}
          {isMobile ? (
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              {carClasses.map((carClass) => {
                const isSelected = carClass.key === currentCarClass;
                const priceDiff = carClass.basePrice - currentPrice;

                return (
                  <Box
                    key={carClass.key}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      border: isSelected ? "2px solid" : "1px solid",
                      borderColor: isSelected ? "primary.main" : "grey.300",
                      bgcolor: isSelected ? "primary.light" : "white",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {isSelected && <CheckCircleIcon color="primary" sx={{ fontSize: 18 }} />}
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {carClass.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {carClass.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" fontWeight="bold">
                          ¥{carClass.basePrice.toLocaleString()}
                        </Typography>
                        {!isSelected && (
                          <Typography
                            variant="caption"
                            color={priceDiff > 0 ? "error.main" : "success.main"}
                          >
                            {priceDiff > 0 ? "+" : ""}¥{priceDiff.toLocaleString()}
                          </Typography>
                        )}
                        {isSelected && (
                          <Typography variant="caption" color="primary.main">
                            選択中
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {carClass.recommended.map((rec, idx) => (
                          <Chip key={idx} label={rec} size="small" variant="outlined" sx={{ height: 20, "& .MuiChip-label": { px: 0.75, fontSize: "0.65rem" } }} />
                        ))}
                      </Box>
                      {!isSelected && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onSelect(carClass.key)}
                          sx={{ minWidth: 60, py: 0.25 }}
                        >
                          選択
                        </Button>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            /* デスクトップ：テーブルレイアウト */
            <TableContainer sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>クラス</TableCell>
                    <TableCell>おすすめ</TableCell>
                    <TableCell align="right">基本料金</TableCell>
                    <TableCell align="right">差額</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {carClasses.map((carClass) => {
                    const isSelected = carClass.key === currentCarClass;
                    const priceDiff = carClass.basePrice - currentPrice;

                    return (
                      <TableRow
                        key={carClass.key}
                        sx={{
                          bgcolor: isSelected ? "primary.light" : "inherit",
                          "&:hover": { bgcolor: isSelected ? "primary.light" : "grey.50" },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {isSelected && <CheckCircleIcon color="primary" fontSize="small" />}
                            <Box>
                              <Typography variant="body2" fontWeight={isSelected ? "bold" : "normal"}>
                                {carClass.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {carClass.description}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                            {carClass.recommended.map((rec, idx) => (
                              <Chip key={idx} label={rec} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            ¥{carClass.basePrice.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {isSelected ? (
                            <Typography variant="caption" color="text.secondary">
                              選択中
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              color={priceDiff > 0 ? "error.main" : "success.main"}
                            >
                              {priceDiff > 0 ? "+" : ""}
                              ¥{priceDiff.toLocaleString()}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {!isSelected && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelect(carClass.key);
                              }}
                            >
                              選択
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            ※ 料金は選挙区分「{electoralClass === "general" ? "一般地方選挙" : electoralClass === "unity" ? "統一地方選挙" : electoralClass === "national" ? "衆・参議院選挙" : "広告宣伝車"}」の場合
          </Typography>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default PriceComparison;

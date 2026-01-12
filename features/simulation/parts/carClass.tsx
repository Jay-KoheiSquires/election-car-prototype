/**
 * 車クラス選択コンポーネント
 * S/M/L/LLクラスの選択と、選択されたクラスに応じた車種を表示
 */
import { Box, Card, CardContent, Chip, Container, Divider, Grid, Paper, Typography } from "@mui/material";
import React, { memo, useState, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { CompactCar, LightCar, StandardCar, VanCar } from "../carType";
import { apiData } from "../../api/apiData";
import { FullFormProps, CarClassType } from "../types/formTypes";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SectionHeader from "../../../component/molecules/SectionHeader";
import RecommendedCar from "./recommendedCar";
import { ClassType } from "../../api/type";
import { ElectoralClass } from "../calc/calcSimlationParts";

/**
 * シンプルなサブヘッダー（番号なし）
 */
const SubHeader = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
    {icon}
    <Typography variant="subtitle2" fontWeight={600}>
      {title}
    </Typography>
  </Box>
);

/**
 * 車クラスに応じた車種選択コンポーネントを返す
 */
const CarClassSelector = memo(({
  carClass,
  control,
  setValue
}: {
  carClass: CarClassType;
  control: FullFormProps["control"];
  setValue: FullFormProps["setValue"];
}) => {
  switch (carClass) {
    case "s":
      return <LightCar control={control} setValue={setValue} apiData={apiData} />;
    case "m":
      return <CompactCar control={control} setValue={setValue} apiData={apiData} />;
    case "l":
      return <StandardCar control={control} setValue={setValue} apiData={apiData} />;
    case "ll":
      return <VanCar control={control} setValue={setValue} apiData={apiData} />;
    default:
      return null;
  }
});
CarClassSelector.displayName = "CarClassSelector";

// クラス情報の定義
interface ClassInfo {
  key: CarClassType;
  name: string;
  description: string;
  target: string;
  defaultCarType: string;
}

const classInfoList: ClassInfo[] = [
  { key: "s", name: "Sクラス", description: "軽自動車", target: "町村議会向け", defaultCarType: "heightWagon" },
  { key: "m", name: "Mクラス", description: "普通車", target: "市議会向け", defaultCarType: "corollaFielder" },
  { key: "l", name: "Lクラス", description: "ミニバン", target: "政令市向け", defaultCarType: "noah" },
  { key: "ll", name: "LLクラス", description: "大型バン", target: "国政向け", defaultCarType: "regiusaceAceBasic" },
];

// おすすめクラスを選挙区分から取得
const getRecommendedClass = (electoralClass: string | undefined): CarClassType | null => {
  switch (electoralClass) {
    case "general": return "s";
    case "unity": return "m";
    case "national": return "ll";
    case "ad": return "ll";
    default: return null;
  }
};

interface CarClassProps extends FullFormProps {
  electoralClass?: string;
}

const CarClass = ({ setValue, control, errors, calcValue, electoralClass }: CarClassProps) => {
  const getCarClass = useWatch({ control, name: "carClass" }) as CarClassType;
  const [showRecommendation, setShowRecommendation] = useState(true);

  const recommendedClass = getRecommendedClass(electoralClass);

  // 各クラスの価格を取得
  const classPrices = useMemo(() => {
    const getPrice = (classKey: CarClassType, carKey: string) => {
      try {
        const classData = apiData[classKey];
        if (classData && typeof classData === "object") {
          const carData = (classData as Record<string, ClassType>)[carKey];
          const ec = (electoralClass || "general") as ElectoralClass;
          if (carData && carData[ec]) {
            return carData[ec].unitPrice?.car || 0;
          }
        }
        return 0;
      } catch {
        return 0;
      }
    };

    return {
      s: getPrice("s", "heightWagon"),
      m: getPrice("m", "corollaFielder"),
      l: getPrice("l", "noah"),
      ll: getPrice("ll", "regiusaceAceBasic"),
    };
  }, [electoralClass]);

  // 基準価格（選択中のクラスの価格）
  const basePrice = getCarClass ? classPrices[getCarClass] : classPrices.s;

  // おすすめ車種選択時のハンドラ
  const handleRecommendSelect = (carClassValue: CarClassType, carTypeValue: string) => {
    setValue("carClass", carClassValue);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(`carType.${carClassValue}` as any, carTypeValue as any);
  };

  // おすすめを閉じるハンドラ
  const handleDismissRecommendation = () => {
    setShowRecommendation(false);
  };

  // クラス選択時のハンドラ
  const handleClassSelect = (classKey: CarClassType) => {
    setValue("carClass", classKey);
    // デフォルト車種も設定
    const classInfo = classInfoList.find(c => c.key === classKey);
    if (classInfo) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(`carType.${classKey}` as any, classInfo.defaultCarType as any);
    }
  };

  return (
    <>
      <Grid item sm={12}>
        <SectionHeader
          icon={<DirectionsCarIcon />}
          title="車両を選択"
          subtitle="サイズと車種をお選びください"
        />
      </Grid>

      <Grid item sm={12} sx={{ pb: 2 }}>
        <Container fixed>
          <Grid container spacing={3}>
            {/* おすすめ車種 */}
            {showRecommendation && electoralClass && (
              <Grid item xs={12}>
                <RecommendedCar
                  electoralClass={electoralClass as ElectoralClass}
                  currentCarClass={getCarClass}
                  onSelect={handleRecommendSelect}
                  onDismiss={handleDismissRecommendation}
                />
              </Grid>
            )}

            {/* サイズ選択（カード型） */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: "grey.50",
                  borderRadius: 2,
                }}
              >
                <SubHeader title="サイズを選択" icon={<DirectionsCarIcon fontSize="small" color="action" />} />
                <Controller
                  control={control}
                  name="carClass"
                  render={({ field }) => (
                    <Grid container spacing={1.5}>
                      {classInfoList.map((classInfo) => {
                        const isSelected = field.value === classInfo.key;
                        const isRecommended = recommendedClass === classInfo.key;
                        const price = classPrices[classInfo.key];
                        const priceDiff = price - basePrice;

                        return (
                          <Grid item xs={6} sm={3} key={classInfo.key}>
                            <Card
                              variant="outlined"
                              onClick={() => {
                                field.onChange(classInfo.key);
                                handleClassSelect(classInfo.key);
                              }}
                              sx={{
                                cursor: "pointer",
                                height: "100%",
                                borderColor: isSelected ? "primary.main" : isRecommended ? "warning.main" : "grey.300",
                                borderWidth: isSelected ? 2 : 1,
                                bgcolor: isSelected ? "primary.light" : "white",
                                transition: "all 0.2s",
                                "&:hover": {
                                  borderColor: "primary.main",
                                  borderWidth: 2,
                                },
                              }}
                            >
                              <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                                {/* ヘッダー: クラス名 + チェック */}
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    {classInfo.name}
                                  </Typography>
                                  {isSelected && <CheckCircleIcon color="primary" sx={{ fontSize: 18 }} />}
                                </Box>

                                {/* 車種タイプ */}
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                                  {classInfo.description}
                                </Typography>

                                {/* 価格 */}
                                <Typography variant="body2" fontWeight="bold" color={isSelected ? "primary.main" : "text.primary"}>
                                  ¥{price.toLocaleString()}
                                </Typography>

                                {/* 差額（選択中以外） */}
                                {!isSelected && priceDiff !== 0 && (
                                  <Typography
                                    variant="caption"
                                    color={priceDiff > 0 ? "error.main" : "success.main"}
                                  >
                                    {priceDiff > 0 ? "+" : ""}¥{priceDiff.toLocaleString()}
                                  </Typography>
                                )}

                                {/* 選択中 or 推奨バッジ */}
                                {isSelected ? (
                                  <Typography variant="caption" color="primary.main" sx={{ display: "block", mt: 0.5 }}>
                                    選択中
                                  </Typography>
                                ) : isRecommended ? (
                                  <Chip
                                    label="推奨"
                                    size="small"
                                    color="warning"
                                    sx={{ mt: 0.5, height: 18, "& .MuiChip-label": { px: 0.75, fontSize: "0.65rem" } }}
                                  />
                                ) : (
                                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                                    {classInfo.target}
                                  </Typography>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                />
              </Paper>
            </Grid>

            {/* 車種選択 */}
            {getCarClass && (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    backgroundColor: "grey.50",
                    borderRadius: 2,
                  }}
                >
                  <SubHeader title="車種を選択" icon={<DirectionsCarIcon fontSize="small" color="action" />} />
                  <CarClassSelector
                    carClass={getCarClass}
                    control={control}
                    setValue={setValue}
                  />
                </Paper>
              </Grid>
            )}

          </Grid>
        </Container>
      </Grid>
      <Divider />
    </>
  );
};

export default CarClass;

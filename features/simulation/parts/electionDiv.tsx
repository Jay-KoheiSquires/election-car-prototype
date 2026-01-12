/**
 * 選挙区分選択コンポーネント
 * Contact page風のデザイン - カード選択 + JapanMap
 */
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { memo, useState, useCallback } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useGetWindowSize } from "../../../hooks/useGetWindowSize";
import { FormPropsWithSetValue } from "../types/formTypes";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import BusinessIcon from "@mui/icons-material/Business";
import CampaignIcon from "@mui/icons-material/Campaign";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import JapanMap from "../../inquire/parts/japanMap";
import SectionHeader from "../../../component/molecules/SectionHeader";

// 種別データ
const electionTypes = [
  {
    value: "general",
    label: "一般地方選挙",
    description: "市区町村議会・首長",
    icon: <BusinessIcon />,
    timing: "1ヶ月前までに予約",
  },
  {
    value: "unity",
    label: "統一地方選挙",
    description: "4年に1度の統一選",
    icon: <HowToVoteIcon />,
    timing: "2〜3ヶ月前に予約推奨",
  },
  {
    value: "national",
    label: "国政選挙",
    description: "衆議院・参議院選挙",
    icon: <CampaignIcon />,
    timing: "解散後すぐにご連絡を",
  },
  {
    value: "ad",
    label: "広告宣伝車",
    description: "イベント・PR活動",
    icon: <LocalShippingIcon />,
    timing: "随時受付中",
  },
];

interface ElectionDivProps extends FormPropsWithSetValue {
  setValue: any;
}

const ElectionDiv = memo(({ control, errors, setValue }: ElectionDivProps) => {
  const windowSize = useGetWindowSize();
  const noSmartPhone = windowSize.width >= 600;
  const selectedElection = useWatch({ control, name: "electoralClass" });
  const [selectedPref, setSelectedPref] = useState("");

  // JapanMapの選択ハンドラ
  const handlePrefSelect = useCallback((prefCode: string, prefName: string) => {
    setSelectedPref(prefCode);
    // deliveryPrefectureにも設定
    setValue("deliveryPrefecture", prefCode);
  }, [setValue]);

  const isAdCar = selectedElection === "ad";

  return (
    <>
      {/* セクションタイトル */}
      <Grid item sm={12}>
        <SectionHeader
          icon={isAdCar ? <LocalShippingIcon /> : <HowToVoteIcon />}
          title="ご利用目的"
          subtitle={isAdCar ? "ご利用用途をお選びください" : "選挙の種類をお選びください"}
        />
      </Grid>

      {/* 種別カード */}
      <Grid item sm={12} sx={{ pb: 2 }}>
        <Container fixed>
          <Controller
            control={control}
            name="electoralClass"
            render={({ field }) => (
              <Grid container spacing={1}>
                {electionTypes.map((type) => {
                  const isSelected = field.value === type.value;
                  return (
                    <Grid item xs={6} sm={3} key={type.value}>
                      <Card
                        variant="outlined"
                        onClick={() => field.onChange(type.value)}
                        onKeyDown={(e) => e.key === "Enter" && field.onChange(type.value)}
                        tabIndex={0}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${type.label}: ${type.description}`}
                        sx={{
                          cursor: "pointer",
                          borderColor: isSelected ? "primary.main" : "grey.300",
                          borderWidth: isSelected ? 2 : 1,
                          bgcolor: isSelected ? "primary.light" : "white",
                          transition: "all 0.2s",
                          height: "100%",
                          "&:hover": { borderColor: "primary.main" },
                          "&:focus": {
                            outline: "2px solid",
                            outlineColor: "primary.main",
                            outlineOffset: 2,
                          },
                        }}
                      >
                        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Box sx={{ color: isSelected ? "primary.main" : "action.active" }}>
                              {type.icon}
                            </Box>
                            <Typography variant="body2" fontWeight="bold">
                              {type.label}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                            {type.description}
                          </Typography>
                          <Chip
                            icon={<AccessTimeIcon sx={{ fontSize: 12 }} />}
                            label={type.timing}
                            size="small"
                            sx={{ mt: 0.5, height: 20, "& .MuiChip-label": { px: 0.5, fontSize: "0.6rem" } }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          />

          {/* 予約タイミング案内（選挙タイプ） */}
          {selectedElection && selectedElection !== "ad" && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="caption">
                <strong>{electionTypes.find((t) => t.value === selectedElection)?.label}</strong>
                の場合、
                <strong>{electionTypes.find((t) => t.value === selectedElection)?.timing}</strong>
                です。早めのご予約をお勧めします。
              </Typography>
            </Alert>
          )}

          {/* 広告宣伝車の場合の説明（選挙と同じ場所に表示） */}
          {isAdCar && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="caption">
                <strong>広告宣伝車</strong>：イベント告知、企業PR、キャンペーンなど選挙以外の用途に最適です。
              </Typography>
            </Alert>
          )}
        </Container>
      </Grid>

      {/* 都道府県選択（JapanMap） */}
      <Grid item sm={12}>
        <SectionHeader
          icon={<PlaceIcon />}
          title={isAdCar ? "配送先を選択" : "選挙区を選択"}
          subtitle={isAdCar
            ? "配送先の都道府県を選んでください（配送料の計算に使用します）"
            : "地図をタップして選挙区を選んでください（配送先にも適用されます）"
          }
        />
      </Grid>

      <Grid item sm={12} sx={{ pb: 2 }}>
        <Container fixed>
          <JapanMap selectedPref={selectedPref} onSelect={handlePrefSelect} />
        </Container>
      </Grid>
    </>
  );
});
ElectionDiv.displayName = "ElectionDiv";

export default ElectionDiv;

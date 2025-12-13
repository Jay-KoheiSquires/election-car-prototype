import React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import WarningIcon from "@mui/icons-material/Warning";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Layout from "../component/templates/layout";
import Link from "next/link";

const GuidePage = () => {
  const rentalSteps = [
    {
      label: "お問い合わせ・お見積り",
      description:
        "まずはWebフォームまたはお電話でお問い合わせください。選挙の種類、日程、希望車種などをお伺いし、お見積りをご提示します。",
      timing: "選挙日の1〜3ヶ月前",
    },
    {
      label: "ご予約・ご契約",
      description:
        "内容にご納得いただけましたらご予約確定。必要書類（免許証コピー等）をご提出いただき、契約を締結します。",
      timing: "お見積り後〜告示日の2週間前まで",
    },
    {
      label: "看板・装飾の準備",
      description:
        "候補者名、政党名、キャッチコピーなどの情報をもとに看板を作成。ラッピングをご希望の場合はデザイン確定後、施工を行います。",
      timing: "告示日の2週間〜1週間前",
    },
    {
      label: "納車",
      description:
        "ご指定の場所に選挙カーをお届けします。操作説明、音響機器の使い方などを丁寧にご説明します。",
      timing: "告示日前日または当日朝",
    },
    {
      label: "選挙期間中",
      description:
        "選挙活動にご利用ください。万が一のトラブルにも24時間対応いたします。",
      timing: "選挙期間中",
    },
    {
      label: "引取・返却",
      description:
        "選挙終了後、ご指定の場所で車両を引き取ります。簡単な状態確認を行い、手続き完了です。",
      timing: "投票日または翌日",
    },
  ];

  const effectiveTips = [
    {
      title: "時間帯による使い分け",
      icon: <AccessTimeIcon color="primary" />,
      tips: [
        "朝7〜9時: 駅前・通勤路線沿い（通勤者へのアピール）",
        "10〜16時: 住宅街（主婦層・高齢者へのアピール）",
        "17〜20時: 駅前・商業地域（帰宅者へのアピール）",
        "※20時以降の選挙活動は法律で禁止されています",
      ],
    },
    {
      title: "音響の効果的な使い方",
      icon: <VolumeUpIcon color="primary" />,
      tips: [
        "住宅街では音量を控えめに（苦情防止）",
        "交差点では一時停止してアピール",
        "録音音声と生声を組み合わせる",
        "候補者の声は聞き取りやすいトーンで",
      ],
    },
    {
      title: "走行ルートの工夫",
      icon: <DirectionsCarIcon color="primary" />,
      tips: [
        "事前にルートを計画し効率的に回る",
        "狭い道は軽自動車・コンパクトカーで",
        "同じ場所を時間を変えて複数回通過",
        "競合候補とバッティングしない時間帯を選ぶ",
      ],
    },
  ];

  return (
    <Layout>
      <Box>
        {/* ヘッダー */}
        <Box sx={{ mb: 3 }}>
          <Link href="/" passHref>
            <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} size="small">
              シミュレーションに戻る
            </Button>
          </Link>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
            選挙カー活用ガイド
          </Typography>
          <Typography variant="body2" color="text.secondary">
            選挙カーを効果的に活用するためのノウハウをご紹介します
          </Typography>
        </Box>

        {/* レンタルの流れ */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon color="primary" fontSize="small" />
            レンタルの流れ
          </Typography>
          <Stepper orientation="vertical">
            {rentalSteps.map((step, index) => (
              <Step key={index} active={true}>
                <StepLabel>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {step.description}
                  </Typography>
                  <Chip
                    icon={<AccessTimeIcon />}
                    label={step.timing}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* 効果的な使い方 */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TipsAndUpdatesIcon color="primary" fontSize="small" />
            効果的な選挙カーの使い方
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {effectiveTips.map((section, idx) => (
              <Grid item xs={12} sm={4} key={idx}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                      {section.icon}
                      <Typography variant="body2" fontWeight="bold">
                        {section.title}
                      </Typography>
                    </Box>
                    <List dense disablePadding>
                      {section.tips.map((tip, tipIdx) => (
                        <ListItem key={tipIdx} disableGutters sx={{ py: 0.25 }}>
                          <ListItemIcon sx={{ minWidth: 20 }}>
                            <LightbulbIcon sx={{ fontSize: 14 }} color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary={tip}
                            primaryTypographyProps={{ variant: "caption" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* 車種選びのポイント */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DirectionsCarIcon color="primary" fontSize="small" />
            車種選びのポイント
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    Sクラス（軽自動車）
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ■ おすすめ: 町村議会選挙、住宅密集地
                  </Typography>
                  <Typography variant="body2">■ メリット: 小回り、低コスト、狭い道OK</Typography>
                  <Typography variant="body2">■ デメリット: 存在感は控えめ</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    Mクラス（コンパクトカー）
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ■ おすすめ: 市議会選挙、バランス重視
                  </Typography>
                  <Typography variant="body2">■ メリット: 汎用性高い、荷室広い</Typography>
                  <Typography variant="body2">■ デメリット: 特になし（万能型）</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    Lクラス（ミニバン）
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ■ おすすめ: 県議会、政令市、知事選
                  </Typography>
                  <Typography variant="body2">■ メリット: 存在感、登壇台設置可</Typography>
                  <Typography variant="body2">■ デメリット: 狭い道は苦手</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    LLクラス（大型バン）
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ■ おすすめ: 国政選挙、大規模選挙区
                  </Typography>
                  <Typography variant="body2">■ メリット: 最大アピール力、大音量</Typography>
                  <Typography variant="body2">■ デメリット: コスト高め、取り回し注意</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* 注意事項 */}
        <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
          <Typography variant="caption" fontWeight="bold" gutterBottom sx={{ display: "block" }}>
            選挙カー利用時の注意事項
          </Typography>
          <List dense disablePadding>
            <ListItem disableGutters sx={{ py: 0.25 }}>
              <Typography variant="caption">
                • 選挙運動は告示日から投票日前日まで。それ以外の期間は使用できません。
              </Typography>
            </ListItem>
            <ListItem disableGutters sx={{ py: 0.25 }}>
              <Typography variant="caption">
                • 音声による選挙運動は8:00〜20:00まで。時間外は禁止されています。
              </Typography>
            </ListItem>
            <ListItem disableGutters sx={{ py: 0.25 }}>
              <Typography variant="caption">
                • 学校・病院・診療所の周辺では静穏を保つよう努めてください。
              </Typography>
            </ListItem>
            <ListItem disableGutters sx={{ py: 0.25 }}>
              <Typography variant="caption">
                • 連呼行為は走行中または停車中に限られます（演説は連呼行為に含まれません）。
              </Typography>
            </ListItem>
          </List>
        </Alert>

        {/* CTA */}
        <Card sx={{ bgcolor: "primary.light", mb: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              選挙カーの準備はお早めに
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              特に統一地方選挙は早期に予約が埋まります。まずはシミュレーションから。
            </Typography>
            <Link href="/" passHref>
              <Button variant="contained" size="medium">
                料金シミュレーションへ
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default GuidePage;

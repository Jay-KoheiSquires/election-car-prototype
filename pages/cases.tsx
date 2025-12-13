import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Rating,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Layout from "../component/templates/layout";
import Link from "next/link";

interface CaseStudy {
  id: number;
  name: string;
  title: string;
  area: string;
  electionType: string;
  carClass: string;
  carType: string;
  year: number;
  result: "当選" | "落選" | "次点";
  rating: number;
  comment: string;
  points: string[];
  image?: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    name: "T.S様",
    title: "市議会議員",
    area: "東京都 A市",
    electionType: "統一地方選挙",
    carClass: "Mクラス",
    carType: "カローラ フィールダー",
    year: 2023,
    result: "当選",
    rating: 5,
    comment:
      "初めての選挙で何も分からない状態でしたが、担当の方が丁寧にアドバイスしてくださり、安心して選挙活動に集中できました。車両の状態も良く、音響も申し分ありませんでした。次回もぜひお願いしたいと思います。",
    points: ["初めての選挙でも安心のサポート", "丁寧なアドバイス", "車両・音響の状態が良好"],
  },
  {
    id: 2,
    name: "K.Y様",
    title: "県議会議員",
    area: "神奈川県",
    electionType: "統一地方選挙",
    carClass: "Lクラス",
    carType: "NOAH",
    year: 2023,
    result: "当選",
    rating: 5,
    comment:
      "登壇台付きのNOAHを利用しました。駅前での街頭演説で存在感があり、多くの有権者の方に足を止めていただけました。ラッピングのデザインもイメージ通りに仕上げていただき、大変満足しています。",
    points: ["登壇台で存在感アップ", "ラッピングデザインが好評", "駅前演説で効果的"],
  },
  {
    id: 3,
    name: "M.H様",
    title: "町議会議員",
    area: "長野県 B町",
    electionType: "一般地方選挙",
    carClass: "Sクラス",
    carType: "軽ハイトワゴン",
    year: 2024,
    result: "当選",
    rating: 4,
    comment:
      "山間部の狭い道が多い地域なので、小回りの利く軽自動車を選びました。住宅街の細い路地もスムーズに回れて、効率よく選挙活動ができました。コスト面でも助かりました。",
    points: ["狭い道でも小回りが利く", "住宅街での活動に最適", "コストパフォーマンス良好"],
  },
  {
    id: 4,
    name: "A.N様",
    title: "衆議院議員",
    area: "大阪府 第X区",
    electionType: "衆議院選挙",
    carClass: "LLクラス",
    carType: "レジアスエース（ワイド）",
    year: 2024,
    result: "当選",
    rating: 5,
    comment:
      "国政選挙ということで最大サイズの車両を選びました。600Wのアンプで遠くまで声が届き、大きな看板で視認性も抜群でした。スタッフの方の対応も迅速で、トラブルなく選挙期間を終えられました。",
    points: ["600Wアンプで遠くまで声が届く", "大きな看板で視認性抜群", "迅速なサポート対応"],
  },
  {
    id: 5,
    name: "S.T様",
    title: "市議会議員（4期目）",
    area: "埼玉県 C市",
    electionType: "統一地方選挙",
    carClass: "Mクラス",
    carType: "シエンタ",
    year: 2023,
    result: "当選",
    rating: 5,
    comment:
      "4回目の選挙ですが、毎回こちらでお世話になっています。シエンタは荷室が広く、のぼりや備品をたくさん積めて便利です。毎回変わらない品質のサービスに感謝しています。",
    points: ["リピート利用", "荷室の広さが便利", "安定した品質"],
  },
  {
    id: 6,
    name: "R.K様",
    title: "企業広報担当",
    area: "福岡県",
    electionType: "広告宣伝車",
    carClass: "Lクラス",
    carType: "タウンエース",
    year: 2024,
    result: "当選",
    rating: 4,
    comment:
      "新商品のプロモーションで広告宣伝車として利用しました。ボディラッピングで商品イメージを大きくアピールでき、街中で多くの注目を集めました。選挙用だけでなく、企業広報にも活用できるのは良いですね。",
    points: ["ボディラッピングで商品PR", "選挙以外にも活用可能", "注目度の高い広告効果"],
  },
];

const CasesPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const filterByTab = (cases: CaseStudy[]) => {
    switch (selectedTab) {
      case 1:
        return cases.filter((c) => c.electionType.includes("統一"));
      case 2:
        return cases.filter((c) => c.electionType.includes("一般"));
      case 3:
        return cases.filter((c) => c.electionType.includes("衆議院") || c.electionType.includes("参議院"));
      case 4:
        return cases.filter((c) => c.electionType.includes("広告"));
      default:
        return cases;
    }
  };

  const displayedCases = filterByTab(caseStudies);

  return (
    <Layout>
      <Container maxWidth="md">
        {/* ヘッダー */}
        <Box sx={{ mb: 3 }}>
          <Link href="/" passHref>
            <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
              シミュレーションに戻る
            </Button>
          </Link>
          <Typography variant="h4" component="h1" gutterBottom>
            導入事例・お客様の声
          </Typography>
          <Typography variant="body1" color="text.secondary">
            選挙カーをご利用いただいたお客様からの声をご紹介します
          </Typography>
        </Box>

        {/* 実績サマリー */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                500+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                累計利用件数
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                47
              </Typography>
              <Typography variant="body2" color="text.secondary">
                対応都道府県
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                98%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                お客様満足度
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                85%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                リピート率
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* タブ */}
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="すべて" />
          <Tab label="統一地方選挙" />
          <Tab label="一般地方選挙" />
          <Tab label="国政選挙" />
          <Tab label="広告宣伝車" />
        </Tabs>

        {/* 事例一覧 */}
        <Grid container spacing={3}>
          {displayedCases.map((caseItem) => (
            <Grid item xs={12} key={caseItem.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
                      {caseItem.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                        <Typography variant="h6">{caseItem.name}</Typography>
                        <Chip
                          label={caseItem.result}
                          size="small"
                          color={caseItem.result === "当選" ? "success" : "default"}
                          icon={caseItem.result === "当選" ? <EmojiEventsIcon /> : undefined}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {caseItem.title} / {caseItem.area}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                        <Chip label={caseItem.electionType} size="small" variant="outlined" />
                        <Chip label={caseItem.carClass} size="small" variant="outlined" />
                        <Chip label={caseItem.year} size="small" variant="outlined" />
                      </Box>
                    </Box>
                    <Rating value={caseItem.rating} readOnly size="small" />
                  </Box>

                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1, mb: 2 }}>
                    <FormatQuoteIcon color="primary" sx={{ transform: "rotate(180deg)", opacity: 0.3 }} />
                    <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                      {caseItem.comment}
                    </Typography>
                    <Box sx={{ textAlign: "right" }}>
                      <FormatQuoteIcon color="primary" sx={{ opacity: 0.3 }} />
                    </Box>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    ポイント
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    {caseItem.points.map((point, idx) => (
                      <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                        <Typography variant="body2">{point}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
                    <Typography variant="caption" color="text.secondary">
                      利用車両: {caseItem.carType}（{caseItem.carClass}）
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <Card sx={{ mt: 4, mb: 4, bgcolor: "primary.light" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              あなたの選挙活動も、私たちにお任せください
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              まずは料金シミュレーションから
            </Typography>
            <Link href="/" passHref>
              <Button variant="contained" size="large">
                料金シミュレーションへ
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default CasesPage;

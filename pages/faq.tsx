/**
 * よくある質問ページ
 */
import React, { useState } from "react";
import Seo from "../component/atoms/Seo";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import Layout from "../component/templates/layout";
import Link from "next/link";

interface FAQItem {
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

const faqData: FAQItem[] = [
  // 料金関連
  {
    category: "料金・支払い",
    question: "料金に含まれるものは何ですか？",
    answer: "車両本体、選挙カー用看板（候補者名・政党名）、スピーカー、アンプなどの基本装備が含まれます。オプションとしてワイヤレスマイク、インカム、SDカード、保険などを追加いただけます。",
    tags: ["基本料金", "装備"],
  },
  {
    category: "料金・支払い",
    question: "公費負担制度について教えてください",
    answer: "選挙カーのレンタル費用のうち、1日あたり16,100円（上限）が公費から補助される制度です。当社から選挙管理委員会に直接請求いたしますので、お客様の手続き負担はありません。なお、公費負担額は選挙の種類によって異なる場合があります。",
    tags: ["公費負担", "補助金"],
  },
  {
    category: "料金・支払い",
    question: "支払い方法は何がありますか？",
    answer: "銀行振込、クレジットカード（VISA/Master/JCB）に対応しております。請求書払いも可能です。法人・団体のお客様には後払いも承っております。",
    tags: ["支払い", "クレジットカード"],
  },
  {
    category: "料金・支払い",
    question: "キャンセル料はかかりますか？",
    answer: "利用開始日の7日前まではキャンセル料は発生しません。7日前〜3日前は30%、2日前〜前日は50%、当日は100%のキャンセル料が発生します。選挙が中止・延期になった場合は別途ご相談ください。",
    tags: ["キャンセル", "返金"],
  },
  // 車両関連
  {
    category: "車両・装備",
    question: "どのサイズの車がおすすめですか？",
    answer: "選挙区の規模や道路環境によって最適な車種は異なります。町村議会選挙はSクラス（軽自動車）、市区議会はMクラス（コンパクトカー）、県議会・政令市はLクラス（ミニバン）、国政選挙はLLクラス（大型バン）が一般的です。シミュレーションページで詳しく比較できます。",
    tags: ["車種選び", "サイズ"],
  },
  {
    category: "車両・装備",
    question: "ボディラッピング（車体装飾）は可能ですか？",
    answer: "はい、フルラッピング・部分ラッピングともに対応しています。デザインデータをご用意いただくか、当社提携のデザイナーによるデザイン制作も承ります（別途料金）。施工には約1週間かかりますので、お早めにご相談ください。",
    tags: ["ラッピング", "デザイン"],
  },
  {
    category: "車両・装備",
    question: "登壇台（ステージ）は全車種に付けられますか？",
    answer: "Lクラス（ミニバン）以上の車種で登壇台オプションが選択できます。SクラスとMクラスは車両構造上、安全に登壇台を設置することができません。登壇演説を予定されている場合はLクラス以上をご検討ください。",
    tags: ["登壇台", "オプション"],
  },
  {
    category: "車両・装備",
    question: "音響設備の仕様を教えてください",
    answer: "アンプは60W/150W/300W/600Wから選択可能です。スピーカーは車両サイズに応じて2〜4個を標準装備。ワイヤレスマイク（ハンドマイク/ピンマイク）、SDカード（録音音声再生用）などのオプションもご用意しています。",
    tags: ["音響", "スピーカー", "アンプ"],
  },
  // 予約・手続き関連
  {
    category: "予約・手続き",
    question: "予約はいつまでにすればいいですか？",
    answer: "統一地方選挙は2〜3ヶ月前、一般選挙は1ヶ月前までのご予約をお勧めします。選挙期間は全国的に車両が混み合うため、特に統一選は早めのご予約が確実です。お急ぎの場合もまずはご相談ください。",
    tags: ["予約", "時期"],
  },
  {
    category: "予約・手続き",
    question: "必要な書類は何ですか？",
    answer: "ご予約時：運転される方の免許証の写し。立候補届出後：選挙事務所の開設届出書の写し。看板作成のため、候補者名・政党名・キャッチコピーなどの情報もお知らせください。",
    tags: ["書類", "手続き"],
  },
  {
    category: "予約・手続き",
    question: "代理での申し込みは可能ですか？",
    answer: "はい、選挙事務所スタッフや後援会の方による代理申し込みを承っております。最終的な契約者（利用者）は候補者本人または選挙事務所となります。",
    tags: ["代理", "申し込み"],
  },
  // 納車・利用関連
  {
    category: "納車・利用",
    question: "納車・引取の場所は選べますか？",
    answer: "選挙事務所、ご自宅、その他ご指定の場所への納車・引取が可能です。対応エリア内であれば追加料金はかかりません。遠方の場合は配送費をご案内させていただきます。",
    tags: ["納車", "引取"],
  },
  {
    category: "納車・利用",
    question: "対応エリアはどこですか？",
    answer: "全国対応しております。北海道から沖縄まで、離島を除き全国どこでも納車可能です。離島への対応についてはフェリー等の手配を含めご相談ください。",
    tags: ["エリア", "全国対応"],
  },
  {
    category: "納車・利用",
    question: "レンタル期間の延長は可能ですか？",
    answer: "車両の空き状況によりますが、可能な限り対応いたします。延長が見込まれる場合は事前にご連絡ください。次のお客様の予約がある場合は延長できないこともございます。",
    tags: ["延長", "期間"],
  },
  {
    category: "納車・利用",
    question: "事故を起こした場合はどうなりますか？",
    answer: "まず警察への届出と当社への連絡をお願いします。保険オプションにご加入の場合は、自己負担額の上限が設定されます。未加入の場合は実費でのご負担となりますので、保険加入をお勧めしています。",
    tags: ["事故", "保険"],
  },
];

const categories = [...new Set(faqData.map((f) => f.category))];

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);

  const filteredFaq = faqData.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.includes(searchQuery) ||
      faq.answer.includes(searchQuery) ||
      faq.tags.some((tag) => tag.includes(searchQuery));
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <Seo
        title="よくある質問（FAQ）"
        description="選挙カーレンタルに関するよくある質問。料金・公費負担・車種選び・予約方法などについてお答えします。"
      />
      <Box>
        {/* ヘッダー */}
        <Box sx={{ mb: 3 }}>
          <Link href="/" passHref>
            <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} size="small">
              シミュレーションに戻る
            </Button>
          </Link>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
            よくある質問（FAQ）
          </Typography>
          <Typography variant="body2" color="text.secondary">
            選挙カーレンタルに関するよくある質問をまとめました
          </Typography>
        </Box>

        {/* 検索 */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="キーワードで検索（例：公費負担、ラッピング、予約）"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
        </Paper>

        {/* カテゴリフィルター */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
          <Chip
            label="すべて"
            color={!selectedCategory ? "primary" : "default"}
            onClick={() => setSelectedCategory(null)}
          />
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              color={selectedCategory === cat ? "primary" : "default"}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </Box>

        {/* FAQ一覧 */}
        <Box sx={{ mb: 4 }}>
          {filteredFaq.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                該当する質問が見つかりませんでした
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                別のキーワードで検索するか、お問い合わせください
              </Typography>
            </Paper>
          ) : (
            filteredFaq.map((faq, idx) => (
              <Accordion
                key={idx}
                expanded={expandedPanel === `panel${idx}`}
                onChange={(_, isExpanded) => setExpandedPanel(isExpanded ? `panel${idx}` : false)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, width: "100%" }}>
                    <HelpOutlineIcon color="primary" sx={{ mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="bold">{faq.question}</Typography>
                      <Chip label={faq.category} size="small" sx={{ mt: 0.5 }} />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: "grey.50" }}>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>{faq.answer}</Typography>
                  <Box sx={{ display: "flex", gap: 0.5, mt: 2 }}>
                    {faq.tags.map((tag, tagIdx) => (
                      <Chip
                        key={tagIdx}
                        label={tag}
                        size="small"
                        variant="outlined"
                        onClick={() => setSearchQuery(tag)}
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>

        {/* お問い合わせ */}
        <Card sx={{ bgcolor: "primary.light", mb: 4 }}>
          <CardContent sx={{ px: { xs: 2, sm: 3 } }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              お探しの回答が見つかりませんか？
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              お気軽にお問い合わせください。専門スタッフが丁寧にお答えします。
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<LocalPhoneIcon />}
                  href="tel:03-1234-5678"
                  size="small"
                >
                  電話: 03-1234-5678
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  href="mailto:info@senkyocar-labo.com"
                  sx={{ bgcolor: "white" }}
                  size="small"
                >
                  メールで問い合わせ
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default FAQPage;

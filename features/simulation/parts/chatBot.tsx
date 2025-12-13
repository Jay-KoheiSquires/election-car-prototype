import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import SearchIcon from "@mui/icons-material/Search";

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    category: "料金",
    question: "料金に含まれるものは何ですか？",
    answer: "車両本体、看板、スピーカー、アンプなどの基本装備が含まれます。オプションで追加装備（ワイヤレスマイク、インカムなど）も選択いただけます。",
  },
  {
    category: "料金",
    question: "公費負担とは何ですか？",
    answer: "選挙カーのレンタル費用のうち、1日あたり16,100円が公費から補助される制度です。当社から選挙管理委員会に直接請求いたしますので、お客様のご負担が軽減されます。",
  },
  {
    category: "料金",
    question: "キャンセル料はかかりますか？",
    answer: "利用開始日の7日前まではキャンセル料は発生しません。7日前〜前日は50%、当日は100%のキャンセル料が発生します。詳細はお問い合わせください。",
  },
  {
    category: "車両",
    question: "どのサイズの車がおすすめですか？",
    answer: "選挙区の規模によって異なります。町村議会選挙はSクラス、市区議会はMクラス、県議会・政令市はLクラス、国政選挙はLLクラスが一般的です。",
  },
  {
    category: "車両",
    question: "ラッピング（車体装飾）は可能ですか？",
    answer: "はい、ボディラッピングに対応しています。デザインデータをご用意いただくか、当社でデザイン制作も承ります（別途料金）。",
  },
  {
    category: "車両",
    question: "登壇台は全車種に付けられますか？",
    answer: "Lクラス以上の車種で登壇台のオプションが選択できます。SクラスとMクラスは構造上、登壇台の設置ができません。",
  },
  {
    category: "手続き",
    question: "予約はいつまでにすればいいですか？",
    answer: "統一地方選挙の場合は2〜3ヶ月前、一般選挙の場合は1ヶ月前までのご予約をお勧めします。選挙期間は車両が混み合いますので、お早めにご相談ください。",
  },
  {
    category: "手続き",
    question: "必要な書類は何ですか？",
    answer: "選挙事務所の開設届出書の写し、運転される方の免許証の写しが必要です。立候補届出後に確定する情報は後日ご提出いただけます。",
  },
  {
    category: "納車",
    question: "納車・引取の場所は選べますか？",
    answer: "はい、選挙事務所、ご自宅、その他ご指定の場所への納車・引取が可能です。遠方の場合は別途配送費が発生する場合があります。",
  },
  {
    category: "納車",
    question: "対応エリアはどこですか？",
    answer: "全国対応しております。ただし、離島や一部地域では対応が難しい場合がございますので、事前にお問い合わせください。",
  },
];

const categories = [...new Set(faqData.map((f) => f.category))];

const ChatBot: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaq = faqData.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      {/* 検索 */}
      <TextField
        fullWidth
        size="small"
        placeholder="質問を検索..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
        }}
        sx={{ mb: 2 }}
      />

      {/* カテゴリフィルター */}
      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
        <Chip
          label="すべて"
          size="small"
          color={!selectedCategory ? "primary" : "default"}
          onClick={() => setSelectedCategory(null)}
        />
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            size="small"
            color={selectedCategory === cat ? "primary" : "default"}
            onClick={() => setSelectedCategory(cat)}
          />
        ))}
      </Box>

      {/* FAQ一覧 */}
      <Box sx={{ maxHeight: 400, overflow: "auto" }}>
        {filteredFaq.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              該当する質問が見つかりませんでした
            </Typography>
          </Paper>
        ) : (
          filteredFaq.map((faq, idx) => (
            <Accordion key={idx} disableGutters elevation={0} sx={{ border: 1, borderColor: "divider", mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <HelpOutlineIcon fontSize="small" color="primary" />
                  <Typography variant="body2">{faq.question}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: "grey.50" }}>
                <Typography variant="body2">{faq.answer}</Typography>
                <Chip label={faq.category} size="small" sx={{ mt: 1 }} />
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>

      {/* お問い合わせ導線 */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <QuestionAnswerIcon fontSize="small" />
        解決しない場合はお問い合わせください
      </Typography>
      <List dense>
        <ListItem disablePadding>
          <ListItemButton component="a" href="tel:03-1234-5678">
            <ListItemIcon>
              <LocalPhoneIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="電話でお問い合わせ"
              secondary="03-1234-5678（平日9:00〜18:00）"
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="mailto:info@senkyocar-labo.com">
            <ListItemIcon>
              <EmailIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="メールでお問い合わせ"
              secondary="info@senkyocar-labo.com"
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default ChatBot;

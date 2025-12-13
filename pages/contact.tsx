import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Layout from "../component/templates/layout";
import JapanMap from "../features/inquire/parts/japanMap";
import Link from "next/link";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import PhoneIcon from "@mui/icons-material/Phone";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import CampaignIcon from "@mui/icons-material/Campaign";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { useGetZipAddress } from "../hooks/api/useGetZipAddress";

// LINE Icon
const LineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

// 選挙種別データ
const electionTypes = [
  {
    value: "unity",
    label: "統一地方選挙",
    description: "4年に1度の統一選",
    icon: <HowToVoteIcon />,
    timing: "2〜3ヶ月前に予約推奨",
  },
  {
    value: "general",
    label: "一般地方選挙",
    description: "市区町村議会・首長選挙",
    icon: <BusinessIcon />,
    timing: "1ヶ月前までに予約",
  },
  {
    value: "national",
    label: "国政選挙",
    description: "衆議院・参議院選挙",
    icon: <CampaignIcon />,
    timing: "解散後すぐにご連絡を",
  },
];

// ステップ定義
const steps = ["選挙情報", "お客様情報", "納車・引取", "確認"];

const ContactPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPref, setSelectedPref] = useState("");
  const [selectedPrefName, setSelectedPrefName] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [zip, setZip] = useState("");
  const [zipTarget, setZipTarget] = useState<"personal" | "office">("personal");

  const address = useGetZipAddress(zip);

  // フォームバリデーション
  const schema = yup.object().shape({
    electionType: yup.string().required("選挙種別を選択してください"),
    name: yup.string().required("お名前は必須です"),
    furigana: yup.string().required("フリガナは必須です"),
    tel: yup.string().required("電話番号は必須です"),
    email: yup.string().email("正しいメールアドレスを入力してください").required("メールアドレスは必須です"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      electionType: "",
      parliamentType: "chairman",
      prefCode: "",
      prefName: "",
      notificationDate: "",
      name: "",
      furigana: "",
      postCode: "",
      address: "",
      tel: "",
      email: "",
      officePostCode: "",
      officeAddress: "",
      officeTel: "",
      contactPerson: "",
      preferredContact: "phone",
      deliveryDate: "",
      deliveryLocation: "office",
      deliveryOther: "",
      returnDate: "",
      returnLocation: "office",
      returnOther: "",
      notes: "",
    },
  });

  const electionType = watch("electionType");
  const deliveryLocation = watch("deliveryLocation");
  const returnLocation = watch("returnLocation");

  // 住所自動入力
  useEffect(() => {
    if (address?.results) {
      const addr =
        (address.results[0]?.address1 || "") +
        (address.results[0]?.address2 || "") +
        (address.results[0]?.address3 || "");
      if (zipTarget === "personal") {
        setValue("address", addr);
      } else {
        setValue("officeAddress", addr);
      }
    } else if (address && !address.results && zip) {
      setAlertOpen(true);
    }
  }, [address, zipTarget, setValue, zip]);

  const handlePrefSelect = (code: string, name: string) => {
    setSelectedPref(code);
    setSelectedPrefName(name);
    setValue("prefCode", code);
    setValue("prefName", name);
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // 送信処理
  };

  return (
    <Layout>
      <Box>
        {/* ヘッダー */}
        <Box sx={{ mb: 3 }}>
          <Link href="/" passHref>
            <Button startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 1 }}>
              シミュレーションに戻る
            </Button>
          </Link>
          <Typography variant="h5" component="h1" fontWeight="bold" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
            お見積り・ご予約
          </Typography>
          <Typography variant="body2" color="text.secondary">
            選挙カーのレンタルに関するお問い合わせ
          </Typography>
        </Box>

        {/* クイック連絡 */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
          <Typography variant="caption" fontWeight="bold" gutterBottom sx={{ display: "block" }}>
            お急ぎの方はこちら
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<LineIcon />}
                size="small"
                href="https://line.me/R/ti/p/@senkyocar-labo"
                target="_blank"
                sx={{ fontSize: "0.75rem" }}
              >
                LINEで相談
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PhoneIcon />}
                size="small"
                href="tel:03-1234-5678"
                sx={{ fontSize: "0.75rem" }}
              >
                電話で相談
              </Button>
            </Grid>
          </Grid>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            受付時間: 平日 9:00〜18:00 / 土曜 9:00〜15:00
          </Typography>
        </Paper>

        {/* ステッパー */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={activeStep > index}>
              <StepLabel>
                <Typography variant="caption" sx={{ fontSize: { xs: "0.6rem", sm: "0.75rem" } }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: 選挙情報 */}
          <Collapse in={activeStep === 0}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <HowToVoteIcon fontSize="small" color="primary" />
                選挙の種類
              </Typography>
              <Grid container spacing={1}>
                {electionTypes.map((type) => (
                  <Grid item xs={12} sm={4} key={type.value}>
                    <Card
                      variant="outlined"
                      onClick={() => setValue("electionType", type.value)}
                      sx={{
                        cursor: "pointer",
                        borderColor: electionType === type.value ? "primary.main" : "grey.300",
                        borderWidth: electionType === type.value ? 2 : 1,
                        bgcolor: electionType === type.value ? "primary.light" : "white",
                        transition: "all 0.2s",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                    >
                      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          {type.icon}
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
                ))}
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon fontSize="small" color="primary" />
                  選挙区を選択
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  地図をタップして選挙区を選んでください
                </Typography>
                <JapanMap selectedPref={selectedPref} onSelect={handlePrefSelect} />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon fontSize="small" color="primary" />
                  告示日（わかれば）
                </Typography>
                <Controller
                  name="notificationDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                  未定の場合は空欄で構いません
                </Typography>
              </Box>

              {/* 予約タイミング案内 */}
              {electionType && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="caption">
                    <strong>
                      {electionTypes.find((t) => t.value === electionType)?.label}
                    </strong>
                    の場合、
                    <strong>
                      {electionTypes.find((t) => t.value === electionType)?.timing}
                    </strong>
                    です。早めのご予約をお勧めします。
                  </Typography>
                </Alert>
              )}
            </Box>
          </Collapse>

          {/* Step 2: お客様情報 */}
          <Collapse in={activeStep === 1}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon fontSize="small" color="primary" />
                基本情報
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="お名前（候補者名）*"
                        fullWidth
                        size="small"
                        placeholder="例）選挙 太郎"
                        error={!!errors.name}
                        helperText={errors.name?.message as string}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="furigana"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="フリガナ*"
                        fullWidth
                        size="small"
                        placeholder="例）センキョ タロウ"
                        error={!!errors.furigana}
                        helperText={errors.furigana?.message as string}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Controller
                    name="postCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="郵便番号"
                        fullWidth
                        size="small"
                        placeholder="123-4567"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setZip(field.value);
                                  setZipTarget("personal");
                                }}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="住所" fullWidth size="small" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="tel"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="電話番号*"
                        fullWidth
                        size="small"
                        placeholder="090-1234-5678"
                        error={!!errors.tel}
                        helperText={errors.tel?.message as string}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="メールアドレス*"
                        fullWidth
                        size="small"
                        placeholder="example@email.com"
                        error={!!errors.email}
                        helperText={errors.email?.message as string}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BusinessIcon fontSize="small" color="primary" />
                選挙事務所情報（任意）
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                納車先として事務所を指定する場合はご記入ください
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5}>
                  <Controller
                    name="officePostCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="事務所郵便番号"
                        fullWidth
                        size="small"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setZip(field.value);
                                  setZipTarget("office");
                                }}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Controller
                    name="officeAddress"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="事務所住所" fullWidth size="small" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="officeTel"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="事務所電話番号" fullWidth size="small" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="contactPerson"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="ご担当者名" fullWidth size="small" placeholder="窓口となる方のお名前" />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Collapse>

          {/* Step 3: 納車・引取 */}
          <Collapse in={activeStep === 2}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalShippingIcon fontSize="small" color="primary" />
                納車について
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="deliveryDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="datetime-local"
                        label="希望納車日時"
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    納車場所
                  </Typography>
                  <Controller
                    name="deliveryLocation"
                    control={control}
                    render={({ field }) => (
                      <ToggleButtonGroup
                        {...field}
                        exclusive
                        fullWidth
                        size="small"
                        onChange={(_, val) => val && field.onChange(val)}
                      >
                        <ToggleButton value="office">選挙事務所</ToggleButton>
                        <ToggleButton value="home">自宅</ToggleButton>
                        <ToggleButton value="other">その他</ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  />
                </Grid>
                {deliveryLocation === "other" && (
                  <Grid item xs={12}>
                    <Controller
                      name="deliveryOther"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="納車場所詳細" fullWidth size="small" placeholder="具体的な場所をご記入ください" />
                      )}
                    />
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalShippingIcon fontSize="small" color="primary" sx={{ transform: "scaleX(-1)" }} />
                引取について
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="returnDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="datetime-local"
                        label="希望引取日時"
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    引取場所
                  </Typography>
                  <Controller
                    name="returnLocation"
                    control={control}
                    render={({ field }) => (
                      <ToggleButtonGroup
                        {...field}
                        exclusive
                        fullWidth
                        size="small"
                        onChange={(_, val) => val && field.onChange(val)}
                      >
                        <ToggleButton value="office">選挙事務所</ToggleButton>
                        <ToggleButton value="home">自宅</ToggleButton>
                        <ToggleButton value="other">その他</ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  />
                </Grid>
                {returnLocation === "other" && (
                  <Grid item xs={12}>
                    <Controller
                      name="returnOther"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="引取場所詳細" fullWidth size="small" placeholder="具体的な場所をご記入ください" />
                      )}
                    />
                  </Grid>
                )}
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="備考・ご要望"
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      placeholder="看板のデザイン希望、ラッピング希望、その他ご質問など"
                    />
                  )}
                />
              </Box>
            </Box>
          </Collapse>

          {/* Step 4: 確認 */}
          <Collapse in={activeStep === 3}>
            <Box sx={{ mb: 3 }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  入力内容をご確認の上、「送信する」ボタンを押してください。
                </Typography>
              </Alert>

              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="caption" fontWeight="bold" color="primary" gutterBottom>
                  選挙情報
                </Typography>
                <Typography variant="body2">
                  {electionTypes.find((t) => t.value === electionType)?.label || "未選択"} / {selectedPrefName || "未選択"}
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="caption" fontWeight="bold" color="primary" gutterBottom>
                  お客様情報
                </Typography>
                <Typography variant="body2">
                  {watch("name")} 様
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {watch("tel")} / {watch("email")}
                </Typography>
              </Paper>

              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                ※ 送信後、担当者より2営業日以内にご連絡いたします。
              </Typography>
            </Box>
          </Collapse>

          {/* ナビゲーションボタン */}
          <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              size="small"
            >
              戻る
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button onClick={handleNext} endIcon={<ArrowForwardIcon />} variant="contained" size="small">
                次へ
              </Button>
            ) : (
              <Button type="submit" endIcon={<CheckCircleIcon />} variant="contained" color="success" size="small">
                送信する
              </Button>
            )}
          </Box>
        </form>

        {/* 住所検索エラー */}
        <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)}>
          <Alert severity="error" onClose={() => setAlertOpen(false)}>
            住所が見つかりませんでした
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default ContactPage;

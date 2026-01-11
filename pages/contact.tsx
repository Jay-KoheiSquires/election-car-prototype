/**
 * お問い合わせ・予約ページ
 */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Seo from "../component/atoms/Seo";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
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
import RhfDatePicker from "../component/molecules/rhfForm/rhfDatePicker";
import RhfDateTimePicker from "../component/molecules/rhfForm/rhfDateTimePicker";
import Link from "next/link";
import { init, send } from "emailjs-com";
import moment from "moment";
import {
  getSubmissionDateTime,
  calcRentalDays,
  calcDaysUntilNotification,
  calcPublicSubsidy,
  generateMapsUrl,
  formatPrice,
  formatPriceWithTax,
} from "../utils/emailHelpers";
import { useQState } from "../hooks/library/useQstate";
import { SendDataType } from "../features/simulation/utils/sendDataType";
import { CalcDataType } from "../features/simulation/calc/calcSimulation";
import {
  CarClassConv,
  CarTypeConv,
  SignalLightConv,
  WattConv,
  SpeakerConv,
  OptionConv,
  DayConv,
  PriceTaxConv,
  PriceConv,
  LocationConv,
  PiecesConv,
} from "../utils/dataConv";
import { prefCd } from "../constants/preCd";

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
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPref, setSelectedPref] = useState("");
  const [selectedPrefName, setSelectedPrefName] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [zip, setZip] = useState("");
  const [zipTarget, setZipTarget] = useState<"personal" | "office">("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // シミュレーションからのデータ
  const [sendData] = useQState<SendDataType>(["sendData"]);
  const [calcData] = useQState<CalcDataType>(["calcData"]);

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
      notificationDate: null as Date | null,
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
      deliveryDate: null as Date | null,
      deliveryLocation: "office",
      deliveryOther: "",
      returnDate: null as Date | null,
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
    setIsSubmitting(true);

    const userID = process.env.NEXT_PUBLIC_USER_ID;
    const serviceID = process.env.NEXT_PUBLIC_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_TEMPLATE_ID_V2 || process.env.NEXT_PUBLIC_TEMPLATE_ID;

    if (!userID || !serviceID || !templateID) {
      console.error("Missing EmailJS config:", { userID, serviceID, templateID });
      alert("メール設定が不足しています。");
      setIsSubmitting(false);
      return;
    }

    init(userID);

    // 日時フォーマット
    const deliveryDateTime = data.deliveryDate ? moment(data.deliveryDate).format("YYYY/MM/DD HH:mm") : "";
    const returnDateTime = data.returnDate ? moment(data.returnDate).format("YYYY/MM/DD HH:mm") : "";
    const notificationDateStr = data.notificationDate ? moment(data.notificationDate).format("YYYY/MM/DD") : "";

    // 選挙種別ラベル
    const electionTypeLabel = electionTypes.find(t => t.value === data.electionType)?.label || "";

    // 納車・引取場所
    const deliveryLocationMap: { [key: string]: string } = {
      office: "選挙事務所",
      home: "自宅",
      other: "その他",
    };

    // レンタル日数と公費計算
    const rentalDays = calcRentalDays(deliveryDateTime, returnDateTime);
    const daysUntilNotification = calcDaysUntilNotification(notificationDateStr);
    const publicSubsidy = calcPublicSubsidy(rentalDays);

    // 納車・引取先住所（Google Maps用）
    const deliveryAddress = data.deliveryLocation === "office"
      ? data.officeAddress
      : data.deliveryLocation === "home"
      ? data.address
      : data.deliveryOther;
    const pickupAddress = data.returnLocation === "office"
      ? data.officeAddress
      : data.returnLocation === "home"
      ? data.address
      : data.returnOther;

    const template_param = {
      // ========== 受信情報 ==========
      submissionDateTime: getSubmissionDateTime(),

      // ========== お客様情報 ==========
      name: data.name,
      furigana: data.furigana,
      postCode: data.postCode,
      address: data.address,
      tel: data.tel,
      mail: data.email,

      // ========== 選挙事務所情報 ==========
      officePostCode: data.officePostCode,
      officeAddress: data.officeAddress,
      officeTel: data.officeTel,
      liabilityName: data.contactPerson,
      contactType: data.preferredContact === "phone" ? "電話" : data.preferredContact === "email" ? "メール" : data.preferredContact,

      // ========== 納車・引取情報 ==========
      startDateTime: deliveryDateTime,
      startLocation: deliveryLocationMap[data.deliveryLocation] || data.deliveryLocation,
      startAddress: deliveryAddress || "",
      startOther: data.deliveryOther,
      startMapsUrl: generateMapsUrl(deliveryAddress || ""),
      endDateTime: returnDateTime,
      endLocation: deliveryLocationMap[data.returnLocation] || data.returnLocation,
      endAddress: pickupAddress || "",
      endOther: data.returnOther,
      endMapsUrl: generateMapsUrl(pickupAddress || ""),
      note: data.notes,

      // ========== 選挙情報 ==========
      electoralClass: electionTypeLabel,
      electionArea: selectedPrefName || "未選択",
      parliamentClass: data.parliamentType === "chairman" ? "議員" : "首長",
      notificationDate: notificationDateStr,
      daysUntilNotification: daysUntilNotification > 0
        ? `${daysUntilNotification}日後`
        : daysUntilNotification === 0
        ? "本日"
        : `${Math.abs(daysUntilNotification)}日前`,

      // ========== 車両情報（シミュレーションから） ==========
      carClass: CarClassConv(sendData?.carClass || ""),
      carType: CarTypeConv(sendData?.carType?.[sendData?.carClass] || ""),
      signalLight: SignalLightConv(sendData?.signalLight || ""),
      ampSize: WattConv(sendData?.ampSize || ""),
      speaker: SpeakerConv(sendData?.speaker || ""),

      // ========== オプション ==========
      wirelessMike: OptionConv(sendData?.wirelessMike),
      wirelessMikeNumber: sendData?.wirelessMike ? sendData?.wirelessMikeNumber : null,
      sd: OptionConv(sendData?.sd),
      wirelessIncome: OptionConv(sendData?.wirelessIncome),
      handSpeaker: OptionConv(sendData?.handSpeaker),
      bluetoothUnit: OptionConv(sendData?.bluetoothUnit),
      insurance: OptionConv(sendData?.insurance),
      insuranceDays: sendData?.insurance ? DayConv(sendData?.insuranceDays) : DayConv(0),
      bodyRapping: OptionConv(sendData?.bodyRapping),

      // ========== 配送先 ==========
      deliveryPrefecture: prefCd.find((p) => p.value === sendData?.deliveryPrefecture)?.label || "未選択",
      deliveryFee: calcData?.delivery?.isConsultation
        ? "要相談"
        : calcData?.delivery?.fee === 0
        ? "無料"
        : PriceTaxConv(calcData?.deliveryPrice),

      // ========== 金額（合計） ==========
      subTotalPrice: PriceTaxConv(calcData?.subTotalPrice),
      optionTotalPrice: PriceTaxConv(calcData?.optionTotalPrice),
      deliveryPrice: calcData?.delivery?.isConsultation
        ? "要相談"
        : calcData?.delivery?.fee === 0
        ? "無料"
        : PriceTaxConv(calcData?.deliveryPrice),
      totalPrice: PriceTaxConv(calcData?.totalPrice),

      // ========== 金額（内訳詳細） ==========
      priceCarBase: formatPrice(calcData?.subs?.carPrice),
      priceAmp: formatPrice(calcData?.subs?.ampSize),
      priceSignalLight: formatPrice(calcData?.subs?.signalLight),
      priceTakingPlatform: formatPrice(calcData?.subs?.takingPlatform),
      priceWirelessMike: formatPrice(calcData?.options?.totalMikePrice),
      priceSd: formatPrice(calcData?.options?.sdPrice),
      priceWirelessIncome: formatPrice(calcData?.options?.incomePrice),
      priceHandSpeaker: formatPrice(calcData?.options?.handSpeakerPrice),
      priceBluetoothUnit: formatPrice(calcData?.options?.bluetoothUnit),
      priceInsuranceDaily: formatPrice(calcData?.options?.insurancePrice),
      priceInsuranceTotal: formatPrice(calcData?.options?.totalInsurancePrice),
      priceDeliveryFee: formatPrice(calcData?.delivery?.fee),

      // ========== レンタル情報 ==========
      rentalDays: rentalDays > 0 ? `${rentalDays}日間` : "",
      publicSubsidy: formatPriceWithTax(publicSubsidy),
    };

    console.log("Sending email with template:", templateID);
    console.log("Template params:", template_param);

    send(serviceID, templateID, template_param, "tvR3Qt2HckYv81QKY")
      .then((response) => {
        console.log("Email sent successfully:", response);
        setIsSubmitting(false);
        router.push("/thanks");
      })
      .catch((error) => {
        console.error("Email send failed:", error);
        alert("メール送信に失敗しました: " + JSON.stringify(error));
        setIsSubmitting(false);
      });
  };

  return (
    <Layout>
      <Seo
        title="お見積り・ご予約"
        description="選挙カーのレンタル予約・お見積りはこちら。LINEや電話でもお気軽にご相談いただけます。全国対応・公費負担対応。"
      />
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
                <RhfDatePicker
                  control={control}
                  errors={errors}
                  name="notificationDate"
                  label="告示日"
                  size="small"
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
                  <RhfDateTimePicker
                    control={control}
                    errors={errors}
                    name="deliveryDate"
                    label="希望納車日時"
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
                  <RhfDateTimePicker
                    control={control}
                    errors={errors}
                    name="returnDate"
                    label="希望引取日時"
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

              {/* お見積りサマリー */}
              {calcData && (
                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: "primary.light" }}>
                  <Typography variant="caption" fontWeight="bold" color="primary.dark" gutterBottom sx={{ display: "block" }}>
                    お見積りサマリー
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {CarClassConv(sendData?.carClass || "")} / {CarTypeConv(sendData?.carType?.[sendData?.carClass] || "")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <Typography variant="caption" color="text.secondary">合計金額（税込）</Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.dark">
                      {PriceTaxConv(calcData?.totalPrice)}
                    </Typography>
                  </Box>
                  {watch("deliveryDate") && watch("returnDate") && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">レンタル期間</Typography>
                      <Typography variant="body2">
                        {calcRentalDays(
                          moment(watch("deliveryDate")).format("YYYY/MM/DD HH:mm"),
                          moment(watch("returnDate")).format("YYYY/MM/DD HH:mm")
                        )}日間
                      </Typography>
                    </Box>
                  )}
                  {watch("deliveryDate") && watch("returnDate") && (() => {
                    const days = calcRentalDays(
                      moment(watch("deliveryDate")).format("YYYY/MM/DD HH:mm"),
                      moment(watch("returnDate")).format("YYYY/MM/DD HH:mm")
                    );
                    const subsidy = calcPublicSubsidy(days);
                    return subsidy > 0 ? (
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">公費負担額参考</Typography>
                        <Typography variant="body2" color="success.main">
                          {formatPriceWithTax(subsidy)}
                        </Typography>
                      </Box>
                    ) : null;
                  })()}
                </Paper>
              )}

              {/* 料金内訳 */}
              {calcData && (
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="caption" fontWeight="bold" color="primary" gutterBottom sx={{ display: "block", mb: 1 }}>
                    料金内訳
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ py: 0.5, border: 0 }}>
                            <Typography variant="caption">車両基本料金</Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 0.5, border: 0 }}>
                            <Typography variant="caption">{PriceConv(calcData?.subTotalPrice)}</Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ py: 0.5, border: 0 }}>
                            <Typography variant="caption">オプション小計</Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 0.5, border: 0 }}>
                            <Typography variant="caption">{PriceConv(calcData?.optionTotalPrice)}</Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ py: 0.5, border: 0 }}>
                            <Typography variant="caption">配送料（往復）</Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 0.5, border: 0 }}>
                            <Typography variant="caption">
                              {calcData?.delivery?.isConsultation
                                ? "要相談"
                                : calcData?.delivery?.fee === 0
                                ? "無料"
                                : PriceConv(calcData?.deliveryPrice)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
                          <TableCell sx={{ py: 1, border: 0 }}>
                            <Typography variant="body2" fontWeight="bold">合計（税込）</Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1, border: 0 }}>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {PriceTaxConv(calcData?.totalPrice)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              )}

              {/* 選挙情報 */}
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="caption" fontWeight="bold" color="primary" gutterBottom sx={{ display: "block" }}>
                  選挙情報
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">選挙種別</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">
                      {electionTypes.find((t) => t.value === electionType)?.label || "未選択"}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">選挙区</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{selectedPrefName || "未選択"}</Typography>
                  </Grid>
                  {watch("notificationDate") && (
                    <>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">告示日</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">
                          {moment(watch("notificationDate")).format("YYYY/MM/DD")}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>

              {/* お客様情報 */}
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="caption" fontWeight="bold" color="primary" gutterBottom sx={{ display: "block" }}>
                  お客様情報
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">お名前</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{watch("name")} 様</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">フリガナ</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{watch("furigana")}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">電話番号</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{watch("tel")}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">メール</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{watch("email")}</Typography>
                  </Grid>
                  {watch("address") && (
                    <>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">住所</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">{watch("postCode")} {watch("address")}</Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>

              {/* 選挙事務所情報（入力があれば表示） */}
              {(watch("officeAddress") || watch("officeTel")) && (
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="caption" fontWeight="bold" color="primary" gutterBottom sx={{ display: "block" }}>
                    選挙事務所情報
                  </Typography>
                  <Grid container spacing={1}>
                    {watch("officeAddress") && (
                      <>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">住所</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">{watch("officePostCode")} {watch("officeAddress")}</Typography>
                        </Grid>
                      </>
                    )}
                    {watch("officeTel") && (
                      <>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">電話番号</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">{watch("officeTel")}</Typography>
                        </Grid>
                      </>
                    )}
                    {watch("contactPerson") && (
                      <>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">担当者</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">{watch("contactPerson")}</Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Paper>
              )}

              {/* 納車・引取情報 */}
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="caption" fontWeight="bold" color="primary" gutterBottom sx={{ display: "block" }}>
                  納車・引取情報
                </Typography>
                <Grid container spacing={1}>
                  {/* 納車 */}
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">納車日時</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">
                      {watch("deliveryDate") ? moment(watch("deliveryDate")).format("YYYY/MM/DD HH:mm") : "未設定"}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">納車場所</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">
                      {LocationConv(watch("deliveryLocation"))}
                      {watch("deliveryLocation") === "other" && watch("deliveryOther") && `: ${watch("deliveryOther")}`}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  {/* 引取 */}
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">引取日時</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">
                      {watch("returnDate") ? moment(watch("returnDate")).format("YYYY/MM/DD HH:mm") : "未設定"}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">引取場所</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">
                      {LocationConv(watch("returnLocation"))}
                      {watch("returnLocation") === "other" && watch("returnOther") && `: ${watch("returnOther")}`}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* 車両・オプション情報（シミュレーションデータがある場合） */}
              {sendData && (
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="caption" fontWeight="bold" color="primary" gutterBottom sx={{ display: "block" }}>
                    レンタル車両情報
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">車種クラス</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{CarClassConv(sendData?.carClass || "")}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">車種</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{CarTypeConv(sendData?.carType?.[sendData?.carClass] || "")}</Typography>
                    </Grid>
                    {sendData?.signalLight && (
                      <>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">看板タイプ</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">{SignalLightConv(sendData?.signalLight)}</Typography>
                        </Grid>
                      </>
                    )}
                    {sendData?.ampSize && (
                      <>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">アンプ</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">{WattConv(sendData?.ampSize)}</Typography>
                        </Grid>
                      </>
                    )}
                    {sendData?.speaker && (
                      <>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">スピーカー</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">{SpeakerConv(sendData?.speaker)}</Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>

                  {/* オプション（選択されている場合のみ表示） */}
                  {(sendData?.wirelessMike || sendData?.sd || sendData?.wirelessIncome || sendData?.handSpeaker || sendData?.bluetoothUnit || sendData?.insurance || sendData?.bodyRapping) && (
                    <>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography variant="caption" fontWeight="bold" color="text.secondary" gutterBottom sx={{ display: "block" }}>
                        オプション
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {sendData?.wirelessMike && (
                          <Chip size="small" label={`ワイヤレスマイク ${PiecesConv(sendData?.wirelessMikeNumber)}`} variant="outlined" />
                        )}
                        {sendData?.sd && (
                          <Chip size="small" label="SDカード" variant="outlined" />
                        )}
                        {sendData?.wirelessIncome && (
                          <Chip size="small" label="ワイヤレスインカム" variant="outlined" />
                        )}
                        {sendData?.handSpeaker && (
                          <Chip size="small" label="ハンドスピーカー" variant="outlined" />
                        )}
                        {sendData?.bluetoothUnit && (
                          <Chip size="small" label="Bluetoothユニット" variant="outlined" />
                        )}
                        {sendData?.insurance && (
                          <Chip size="small" label={`保険 ${DayConv(sendData?.insuranceDays)}`} variant="outlined" />
                        )}
                        {sendData?.bodyRapping && (
                          <Chip size="small" label="ボディラッピング" variant="outlined" />
                        )}
                      </Box>
                    </>
                  )}
                </Paper>
              )}

              {/* 備考（入力があれば表示） */}
              {watch("notes") && (
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="caption" fontWeight="bold" color="primary" gutterBottom sx={{ display: "block" }}>
                    備考・ご要望
                  </Typography>
                  <Typography variant="body2">{watch("notes")}</Typography>
                </Paper>
              )}

              {/* 注意事項 */}
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="caption">
                  送信後、担当者より<strong>2営業日以内</strong>にご連絡いたします。
                  お急ぎの場合はLINEまたはお電話でお問い合わせください。
                </Typography>
              </Alert>
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

        {/* 送信中ローディング */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isSubmitting}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Layout>
  );
};

export default ContactPage;

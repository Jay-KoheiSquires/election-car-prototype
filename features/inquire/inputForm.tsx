import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { RhfAutocomplete, RhfSelectBox, RhfTextArea } from "../../component/molecules/rhfForm";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { furigana, mail, mailCheck, postCode, tel } from "../../utils/validation";

import SearchIcon from "@mui/icons-material/Search";
import { useGetZipAddress } from "../../hooks/api/useGetZipAddress";
import RhfDateTimePicker from "../../component/molecules/rhfForm/rhfDateTimePicker";
import * as yup from "yup";
import moment from "moment/moment";
import { prefCd } from "../../constants/preCd";
import RhfDatePicker from "../../component/molecules/rhfForm/rhfDatePicker";
import RhfToggleButtonGroup from "../../component/molecules/rhfForm/rhfToggleButtonGroup";
import { useQState } from "../../hooks/library/useQstate";
import {useLeavePageConfirmation} from "../../hooks/useLeavePageConfirmation";

export interface InputValueProps {
  // 選挙情報
  parliamentClass: "chairman" | "chief";
  electionArea: { label: string; value: string };
  notificationDate: string;

  name: string; //"お名前"
  furigana: string; //"フリガナ"
  postCode: string; //"郵便番号"
  address: string; //"住所"
  tel: string; //"電話番号"

  officePostCode: string; //"選挙事務所郵便番号"
  officeAddress: string; //"選挙事務所住所"
  officeTel: string; //"選挙事務所電話番号"

  mail: string; //"メールアドレス"
  mailCheck: string; // "確認用メールアドレス"

  liabilityName: string; //"選挙責任者（今後の窓口の方）"
  contactType: string; //"当社との連絡方法"

  startDateTime: string; // "納車日時"
  startLocation: string; // "納車場所"
  startOther: string; // "その他の場合の入力フォーム"

  endDateTime: string; // "引取日時"
  endLocation: string; // "引取場所"
  endOther: string; // "その他の場合の入力フォーム"

  note: string; //"備考"
}
export const InputForm = () => {
  const router = useRouter();
  const [stepper, setStepper] = useQState<number>(["stepper"],0);

  //
  // react hook form
  //
  const defaultValues: InputValueProps = {
    parliamentClass: "chairman",
    electionArea: { label: "", value: "" },
    notificationDate: "",

    name: "", //"お名前"
    furigana: "", //"フリガナ"
    postCode: "", //"郵便番号"
    address: "", //"住所"
    tel: "", //"電話番号"
    mail: "", //"メールアドレス"
    mailCheck: "", // "確認用メールアドレス"

    officePostCode: "", //"選挙事務所郵便番号"
    officeAddress: "", //"選挙事務所住所"
    officeTel: "", //"選挙事務所電話番号"
    liabilityName: "", //"選挙責任者（今後の窓口の方）"
    contactType: "", //"当社との連絡方法"

    startDateTime: "", // "納車日時"
    startLocation: "", // "納車場所"
    startOther: "", // "その他の場合の入力フォーム"
    endDateTime: "", // "引取日時"
    endLocation: "", // "引取場所"
    endOther: "", // "その他の場合の入力フォーム"
    note: "", //"備考"
  };
  const [inputData, setInputData] = useQState(["inputData"], defaultValues);

  const schema = yup.object().shape({
    name: yup.string().required("必須項目です。"),
    furigana: furigana.required("必須項目です。"),
    // TODO 全角も許容するよう要望あり
    tel: tel.required("必須項目です。"),
    mail: mail.required("必須項目です。"),
    mailCheck: mailCheck.required("必須項目です。"),
    // TODO 全角も許容するよう要望あり
    postCode: postCode,

    // TODO 全角も許容するよう要望あり
    officePostCode: postCode,
    officeTel: tel,

    contactType: yup.string().required("必須項目です。"),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<any>({
    defaultValues: inputData,
    resolver: yupResolver(schema),
  });

  const formSubmitHandler: SubmitHandler<InputValueProps> = (data) => {
    // dateをstringに変換。未入力の場合はそのままの値を返す
    data.startDateTime = data.startDateTime && moment(data.startDateTime).format("yyyy/MM/DD H:mm");
    data.endDateTime = data.endDateTime && moment(data.endDateTime).format("yyyy/MM/DD H:mm");
    data.notificationDate = data.notificationDate && moment(data.notificationDate).format("YYYY/MM/DD");
    // data.electionArea = data.electionArea.value

    setInputData(data);
    setStepper(1);
    // setBrowserBack(false);
    router.push("check");
  };

  //
  // 住所取得ロジック
  //
  const [zip, setZip] = useState("");
  const address = useGetZipAddress(zip);
  const [zipSetter, setZipSetter] = useState<string>("");

  const GetAdd = (getter: string, setter: string) => {
    const getPostCode = watch(getter);
    setZip(getPostCode);
    setZipSetter(setter);
  };

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  useEffect(() => {
    if (address) {
      if (address?.results !== null) {
        setValue(
          zipSetter,
          (address?.results?.[0]?.address1 || "") +
            (address?.results?.[0]?.address2 || "") +
            (address?.results?.[0]?.address3 || ""),
        );
        setAlertOpen(false);
      } else {
        setAlertOpen(true);
      }
    }
  }, [address, zipSetter]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  //
  //otherDisplay utils
  //
  const [startOtherDisplay, setStartOtherDisplay] = useState<boolean>(false);
  const [endOtherDisplay, setEndOtherDisplay] = useState<boolean>(false);
  const startLocation = useWatch({ control, name: "startLocation" });
  const endLocation = useWatch({ control, name: "endLocation" });

  useEffect(() => {
    if (startLocation === "other") {
      setStartOtherDisplay(true);
    } else {
      setStartOtherDisplay(false);
    }
  }, [startLocation]);

  useEffect(() => {
    if (endLocation === "other") {
      setEndOtherDisplay(true);
    } else {
      setEndOtherDisplay(false);
    }
  }, [endLocation]);

  //
  // 初回レンダリングの際にステッパーをセット
  //
  useEffect(() => {
    setStepper(0);
  }, []);

  // reload back対策
  // const [browserBack, setBrowserBack] = useState<boolean>(true)
  // useLeavePageConfirmation(browserBack);

  return (
    <form onSubmit={handleSubmit(formSubmitHandler)}>
      {/* container fixsed で可変スタイルでもいいかも */}
      <Container maxWidth="xs">
        <Grid container rowSpacing={2}>
          {alertOpen && (
            <Snackbar
              open={alertOpen}
              autoHideDuration={2000}
              onClose={handleClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity="error" onClose={handleClose} sx={{ width: "100%" }}>
                住所の検索に失敗しました。
              </Alert>
            </Snackbar>
          )}

          <Grid item xs={12}>
            <Typography>【選挙情報】</Typography>
          </Grid>

          <Grid item xs={12}>
            <RhfToggleButtonGroup
              control={control}
              errors={errors}
              name={"parliamentClass"}
              size={"medium"}
              sx={{ pt: "8px" }}
              options={[
                { label: "議員", value: "chairman" },
                { label: "首長", value: "chief" },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <RhfAutocomplete
              name={"electionArea"}
              label={"選挙区"}
              variant={"outlined"}
              control={control}
              errors={errors}
              options={prefCd}
            />
          </Grid>

          <Grid item xs={12}>
            <RhfDatePicker
              control={control}
              errors={errors}
              variant={"outlined"}
              size={"medium"}
              name={"notificationDate"}
              label={"告示日"}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography>【基本情報】</Typography>
          </Grid>
          <Grid item xs={12}>
            <RhfTextArea
              control={control}
              errors={errors}
              name={"name"}
              label={"お名前*"}
              placeholder="例）選挙 太郎"
              variant={"outlined"}
            />
          </Grid>

          <Grid item xs={12}>
            <RhfTextArea
              control={control}
              errors={errors}
              name={"furigana"}
              label={"フリガナ*"}
              placeholder="例）センキョ タロウ"
              variant={"outlined"}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              control={control}
              name={"postCode"}
              render={({ field }): JSX.Element => (
                <FormControl fullWidth>
                  <InputLabel error={!!errors.postCode}>郵便番号</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="郵便番号"
                    placeholder="例）100-0001"
                    error={!!errors.postCode}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            GetAdd("postCode", "address");
                          }}
                          edge="end"
                        >
                          <Tooltip title="住所を検索" placement="top">
                            <SearchIcon />
                          </Tooltip>
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors.postCode && (
                    <FormHelperText error={!!errors.postCode}>
                      {errors?.postCode?.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <RhfTextArea
              control={control}
              errors={errors}
              name={"address"}
              label={"住所"}
              placeholder="例）東京都千代田区千代田1-1"
              variant={"outlined"}
            />
          </Grid>

          <Grid item xs={12}>
            <RhfTextArea
              control={control}
              errors={errors}
              name={"tel"}
              label={"電話番号*"}
              placeholder="例）090-0000-0000"
              variant={"outlined"}
            />
          </Grid>

          <Grid item xs={12}>
            <RhfTextArea
              control={control}
              errors={errors}
              name={"mail"}
              label={"メールアドレス*"}
              placeholder="例）info@example.com"
              variant={"outlined"}
            />
          </Grid>

          <Grid item xs={12}>
            <RhfTextArea
              control={control}
              errors={errors}
              name={"mailCheck"}
              label={"メールアドレス確認用*"}
              placeholder="メールアドレスをもう一度入力してください"
              variant={"outlined"}
            />
          </Grid>

          {/* 事務所系*/}
          <Grid item xs={12}>
            <Typography>【選挙事務所情報】</Typography>
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name={"officePostCode"}
              render={({ field }): JSX.Element => (
                <FormControl fullWidth>
                  <InputLabel error={!!errors.officePostCode}>選挙事務所郵便番号</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="選挙事務所郵便番号"
                    placeholder="例）100-0001"
                    error={!!errors.officePostCode}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            GetAdd("officePostCode", "officeAddress");
                          }}
                          edge="end"
                        >
                          <Tooltip title="住所を検索" placement="top">
                            <SearchIcon />
                          </Tooltip>
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors.officePostCode && (
                    <FormHelperText error={!!errors.officePostCode}>
                      {errors?.officePostCode?.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <RhfTextArea
              control={control}
              errors={errors}
              name={"officeAddress"}
              label={"選挙事務所住所"}
              placeholder="例）東京都千代田区千代田1-1"
              variant={"outlined"}
            />
          </Grid>

          <Grid item xs={12}>
            <RhfTextArea
              control={control}
              errors={errors}
              name={"officeTel"}
              label={"選挙事務所電話番号"}
              placeholder="例）090-0000-0000"
              variant={"outlined"}
            />
          </Grid>

          <Grid item xs={12}>
            <RhfTextArea
              control={control}
              errors={errors}
              name={"liabilityName"}
              label={"選挙責任者（今後の窓口の方）"}
              placeholder="例）選挙 太郎"
              variant={"outlined"}
            />
          </Grid>

          <Grid item xs={12}>
            <RhfSelectBox
              control={control}
              errors={errors}
              name={"contactType"}
              label={"当社との連絡方法*"}
              variant={"outlined"}
              options={[
                { label: "電話", value: "tel" },
                { label: "メール", value: "mail" },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography>【納車・引き取り】（希望があればご記入ください）</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <RhfDateTimePicker
              control={control}
              errors={errors}
              name={"startDateTime"}
              label={"納車日時"}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ pl: { sm: 2 } }}>
            <RhfSelectBox
              control={control}
              errors={errors}
              name={"startLocation"}
              label={"納車場所"}
              variant={"outlined"}
              options={[
                { label: "事務所", value: "office" },
                { label: "自宅", value: "home" },
                { label: "その他", value: "other" },
              ]}
            />
          </Grid>
          {startOtherDisplay && (
            <Grid item xs={12}>
              <RhfTextArea
                control={control}
                errors={errors}
                name={"startOther"}
                label={"その他納車場所"}
                placeholder="例）〇〇前、駐車場"
                variant={"outlined"}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <RhfDateTimePicker
              control={control}
              errors={errors}
              name={"endDateTime"}
              label={"引取日時"}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ pl: { sm: 2 } }}>
            <RhfSelectBox
              control={control}
              errors={errors}
              name={"endLocation"}
              label={"引取場所"}
              variant={"outlined"}
              options={[
                { label: "事務所", value: "office" },
                { label: "自宅", value: "home" },
                { label: "その他", value: "other" },
              ]}
            />
          </Grid>
          {endOtherDisplay && (
            <Grid item xs={12}>
              <RhfTextArea
                control={control}
                errors={errors}
                name={"endOther"}
                label={"その他引取場所"}
                placeholder="例）〇〇前、駐車場"
                variant={"outlined"}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <RhfTextArea
              control={control}
              errors={errors}
              name={"note"}
              label={"備考"}
              variant={"outlined"}
              multiline={true}
              rows={5}
            />
          </Grid>

          <Grid item xs={6}>
            <Box textAlign={"center"} padding={2}>
              <Button
                variant={"outlined"}
                centerRipple={true}
                onClick={() => {
                  // setBrowserBack(false);
                  router.back();
                }}
              >
                戻る
              </Button>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box textAlign={"center"} padding={2}>
              <Button
                type={"submit"}
                variant={"contained"}
                centerRipple={true}
                sx={{ whiteSpace: "nowrap" }}
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                確認画面へ
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};
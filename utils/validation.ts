import * as yup from "yup";

export const furigana = yup
  .string()
  .test(
    "katakana-checker",
    "カタカナで入力して下さい。",
    function (value: any) {
      return !!value.match(/^[ァ-ヶー　]*$/);
    },
  );

export const tel = yup
  .string()
  .matches(/^(0[-0-9]{9,12})?$/, "電話番号の形式に誤りがあります");

export const mail = yup
  .string()
  .lowercase()
  .email("正しいメールアドレスを入力してください。");

export const mailCheck = yup
  .string()
  .lowercase()
  .email("正しいメールアドレスを入力してください。")
  .test(
    "emails-match",
    "入力されたメールアドレスが一致しません。",
    function (value) {
      return value === this.parent.mail;
    },
  );

export const postCode = yup
  .string()
  .matches(/^([0-9]{3}-?[0-9]{4})?$/, "郵便番号の形式に誤りがあります");

import React from "react";
import { Controller } from "react-hook-form";
import ja from "date-fns/locale/ja";
import { RhfProps } from "./type";

import { Box, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export interface DatePickerProps {
  name: string;
  label: string;

  variant?: "outlined" | "filled" | "standard";
  required?: boolean;
  views?: Array<"year" | "day" | "month">;
  openTo?: "year" | "day" | "month";
  size?: "medium" | "small";
  mask?: string;
  inputFormat?: string;
}

type RhfDatePickerProps = RhfProps & DatePickerProps;

const RhfDatePicker = ({
  control,
  errors,
  name,
  label,

  size = "small",
  variant = "outlined",
  required = false,
  views = ["year", "month", "day"],
  openTo = "year",
  inputFormat = "yyyy/MM/dd",
  mask = "____/__/__",
}: RhfDatePickerProps) => {
  const styles = {
    mobiledialogprops: {
      ".MuiDatePickerToolbar-title": {
        fontSize: "1.5rem",
      },
    },
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }): JSX.Element => (
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={ja}
          dateFormats={{ monthAndYear: "yyyy年 MM月", year: "yyyy年" }} // カレンダー左上の日付表示 年選択を○○年表示
          localeText={{
            previousMonth: "前月を表示", // < のツールチップ
            nextMonth: "次月を表示", // > のツールチップ
            cancelButtonLabel: "キャンセル", // スマホ画面のCANCELボタン
            okButtonLabel: "選択", // スマホ画面のOKボタン
          }}
        >
          <DatePicker
            views={views}
            openTo={openTo}
            mask={mask}
            inputFormat={inputFormat}
            label={label}
            value={field.value}
            minDate={new Date()}
            toolbarFormat="yyyy/MM/dd" // スマホ画面の左上 選択中日付表示
            onChange={(e): void => {
              field.onChange(e);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required={required}
                fullWidth
                size={size}
                variant={variant}
                inputProps={{
                  ...params.inputProps,
                  placeholder: "yyyy/MM/dd/", //プレースホルダー（フォーカスを合わせたときに薄く表示される入力例）
                }}
                error={name in errors}
                helperText={errors[name]?.message}
              />
            )}
            DialogProps={{ sx: styles.mobiledialogprops }} // スマホ画面の左上 選択中日付表示 文字の大きさ調整
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default RhfDatePicker;

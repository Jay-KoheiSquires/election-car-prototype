import React from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { RhfProps } from "./type";

export interface SelectBoxProps {
  name: string;
  label: string;
  options: Array<{ label: string; value: string | number }>;

  sx?: any,
  required?: boolean;
  disabled?: boolean;
  variant?: "outlined" | "filled" | "standard";
  readOnly?: boolean;
  onChange?: (e: any) => void;
  endAdornment?: React.ReactNode;
}

type RhfSelectBoxProps = RhfProps & SelectBoxProps;
// Todo error display
const RhfSelectBox = (
  {
    control,
    errors,
    name,
    label,
    options,
    sx,
    required = false,
    disabled = false,
    variant = "outlined",
    readOnly = false,
    onChange,
    endAdornment,
  }: RhfSelectBoxProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControl
          fullWidth
          required={required}
          disabled={disabled}
          variant={variant}
          error={errors && name in errors}
          sx={sx}
        >
          <InputLabel id="select-label">{label}</InputLabel>
          <Select
            labelId="select-label"
            id="select"
            value={field.value}
            label={label}
            inputProps={{ readOnly: readOnly }}
            endAdornment={
              <InputAdornment sx={{ mr: 2 }} position="end">
                {endAdornment}
              </InputAdornment>
            }
            onChange={(e): void => (
              field.onChange(e.target.value),
              onChange && onChange(e)
            )}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors?.[name]?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default RhfSelectBox;

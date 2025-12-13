import React from "react";
import { Controller } from "react-hook-form";
import { InputAdornment, TextField } from "@mui/material";
import { RhfProps } from "./type";

export interface TextAreaProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  type?: "text";
  defaultValue?: string;
  variant?: "outlined" | "filled" | "standard";
  size?: "medium" | "small";
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  readOnly?: boolean;
  inputProps?: any;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode | string;
}

type RhfTextAreaProps = RhfProps & TextAreaProps;

const RhfTextarea = ({
  control,
  errors,
  name,
  label,
  required = false,
  disabled = false,
  type = "text",
  defaultValue,
  variant = "outlined",
  size = "medium",
  placeholder,
  multiline = false,
  rows = 0,
  readOnly = false,
  inputProps,
  startAdornment,
  endAdornment,
}: RhfTextAreaProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <TextField
          {...field}
          type={type}
          label={label}
          defaultValue={defaultValue}
          required={required}
          disabled={disabled}
          variant={variant}
          size={size}
          placeholder={placeholder}
          multiline={multiline}
          rows={rows}
          error={name in errors}
          helperText={errors[name]?.message}
          fullWidth
          InputProps={{
            ...inputProps,
            readOnly: readOnly,
            startAdornment: startAdornment && (
              <InputAdornment position="start">{startAdornment}</InputAdornment>
            ),
            endAdornment: endAdornment && (
              <InputAdornment position="end">{endAdornment}</InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default RhfTextarea;

import React from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";
import { RhfProps } from "./type";

export interface AutocompleteProps {
  name: string;
  label: string;
  options: Array<{ label: string; value: string }>;
  size?: "small" | "medium";
  autoSx?: any;
  textSx?: any;
  required?: boolean;
  type?: string;
  variant?: "outlined" | "filled" | "standard";
}

type RhfAutocompleteProps = RhfProps & AutocompleteProps;

const RhfAutocomplete = (
  {
    control,
    errors,
    name,
    label,
    options,
    autoSx,
    textSx,

    size = "medium",
    required = false,
    variant = "outlined",
  }: RhfAutocompleteProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <Autocomplete
          options={options}
          disablePortal
          fullWidth
          value={field.value}
          sx={autoSx}
          onChange={(event, value, reason, details) => {
            field.onChange(value);
          }}
          isOptionEqualToValue={(option, value) => {
            return option.value == value.value;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={textSx}
              label={label}
              size={size}
              error={name in errors}
              helperText={errors[name]?.message}
              required={required}
              variant={variant}
            />
          )}
        />
      )}
    />
  );
};

export default RhfAutocomplete;

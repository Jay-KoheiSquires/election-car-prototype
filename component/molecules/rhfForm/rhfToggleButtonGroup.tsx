import { Controller } from "react-hook-form";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";
import { RhfProps } from "./type";

interface ToggleButtonGroupProps {
  name: string;
  options: Array<{ label: string; value: string | number }>;
  key?: string;
  sx?: any;
  size?: "small" | "medium" | "large";
}

type RhfToggleButtonGroupProps = RhfProps & ToggleButtonGroupProps;

const RhfToggleButtonGroup = ({
  control,
  name,
  options,
  key = "abc",
  sx,
  size = "medium",
}: RhfToggleButtonGroupProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <ToggleButtonGroup
          key={key}
          exclusive
          color="primary"
          fullWidth
          sx={sx}
          size={size}
          {...field}
          onChange={(e, value) => {
            if (value !== null) {
              field.onChange(value);
            }
          }}
        >
          {options.map((option, index) => (
            <ToggleButton key={index + key} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    />
  );
};

export default RhfToggleButtonGroup;

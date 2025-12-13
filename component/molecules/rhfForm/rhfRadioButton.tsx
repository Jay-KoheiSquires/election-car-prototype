import React from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { RhfProps } from "./type";

export interface RadioButtonProps {
  name: string;
  label: string;
  options: Array<{ label: string; value: string }>;
  sx?: any,
  size?: "medium" | "small";
  row?: boolean;
}

type RhfRadioButtonProps = RhfProps & RadioButtonProps;

const RhfRadioButton = (
  {
    control,
    name,
    label,
    options,
    sx,
    size = "medium",
    row = false,
  }: RhfRadioButtonProps) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }): JSX.Element => (
          <RadioGroup row={row} sx={sx} {...field}>
            {options.map((option, index) => (
              <FormControlLabel
                value={option.value}
                control={<Radio size={size} />}
                label={option.label}
                key={index}
              />
            ))}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};

export default RhfRadioButton;

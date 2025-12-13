import React from "react";
import { Controller } from "react-hook-form";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useGetWindowSize } from "../../../hooks/useGetWindowSize";

interface CarToggleProps {
  control: any;
  name: string;
  options: {
    label: string;
    value: string;
    priceLabel: string | number;
    image: any;
  }[];
}

const CarToggle = ({ control, name, options }: CarToggleProps) => {
  const windowSize = useGetWindowSize();
  const noSmartPhone = windowSize.width >= 600;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <ToggleButtonGroup
          {...field}
          exclusive
          color="primary"
          orientation={noSmartPhone ? "horizontal" : "vertical"}
          fullWidth
          sx={{
            pb: 3,
          }}
          onChange={(e, value) => {
            if (value !== null) {
              field.onChange(value);
            }
          }}
        >
          {options.map((option, index) => (
            <ToggleButton key={index} value={option.value}>
              <Card
                sx={{
                  backgroundColor: "#fff0",
                  boxShadow: "none",
                }}
              >
                <CardMedia>
                  <Box sx={{width: "100%"}}>
                    <img
                      src={option.image}
                      style={{ height: 260, width: "100%", objectFit: "contain" }}
                    />
                  </Box>
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom>{option.label}</Typography>
                  <Typography gutterBottom sx={{ wordBreak: "break-all" }}>
                    {option.priceLabel}
                  </Typography>
                </CardContent>
              </Card>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    />
  );
};
export default CarToggle;

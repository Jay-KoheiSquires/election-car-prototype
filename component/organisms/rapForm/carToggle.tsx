import React from "react";
import { Controller } from "react-hook-form";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useGetWindowSize } from "../../../hooks/useGetWindowSize";

interface CarToggleProps {
  control: any;
  name: string;
  options: {
    label: string;
    value: string;
    priceLabel: string | number;
    image: any;
    tags?: string[];
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
          orientation={noSmartPhone ? "horizontal" : "vertical"}
          fullWidth
          sx={{
            pb: 3,
            gap: 2,
            "& .MuiToggleButtonGroup-grouped": {
              border: "2px solid",
              borderColor: "grey.300",
              borderRadius: "12px !important",
              "&:not(:first-of-type)": {
                borderLeft: "2px solid",
                borderLeftColor: "grey.300",
                marginLeft: 0,
              },
              "&.Mui-selected": {
                borderColor: "primary.main",
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                "&:hover": {
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                },
              },
              "&:hover": {
                backgroundColor: "grey.50",
              },
            },
          }}
          onChange={(e, value) => {
            if (value !== null) {
              field.onChange(value);
            }
          }}
        >
          {options.map((option, index) => {
            const isSelected = field.value === option.value;
            return (
              <ToggleButton
                key={index}
                value={option.value}
                sx={{
                  p: 0,
                  overflow: "hidden",
                }}
              >
                <Card
                  sx={{
                    backgroundColor: "white",
                    boxShadow: "none",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {/* 選択チェックマーク */}
                  {isSelected && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 1,
                        backgroundColor: "white",
                        borderRadius: "50%",
                      }}
                    >
                      <CheckCircleIcon
                        color="primary"
                        sx={{ fontSize: 28 }}
                      />
                    </Box>
                  )}
                  <CardMedia>
                    <Box sx={{ width: "100%", pt: 1 }}>
                      <img
                        src={option.image.startsWith('/') ? option.image : `/${option.image}`}
                        style={{
                          height: noSmartPhone ? 180 : 140,
                          width: "100%",
                          objectFit: "contain"
                        }}
                        alt={option.label}
                      />
                    </Box>
                  </CardMedia>
                  <CardContent sx={{ py: 1.5, px: 2 }}>
                    <Typography
                      gutterBottom
                      fontWeight={isSelected ? 600 : 400}
                      color={isSelected ? "primary.main" : "text.primary"}
                    >
                      {option.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {option.priceLabel}
                    </Typography>
                    {option.tags && option.tags.length > 0 && (
                      <Box sx={{ display: "flex", gap: 0.5, mt: 1, flexWrap: "wrap" }}>
                        {option.tags.map((tag, tagIdx) => (
                          <Chip
                            key={tagIdx}
                            label={tag}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{
                              height: 20,
                              "& .MuiChip-label": { px: 0.75, fontSize: "0.65rem" },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      )}
    />
  );
};
export default CarToggle;

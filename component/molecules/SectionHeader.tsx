/**
 * 統一されたセクションヘッダーコンポーネント
 * 全ページで一貫したデザインを提供
 */
import React from "react";
import { Box, Typography, Chip } from "@mui/material";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  step?: number;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, step, subtitle }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      {step && (
        <Chip
          label={step}
          size="small"
          color="primary"
          sx={{
            fontWeight: 700,
            minWidth: 28,
            height: 28,
          }}
        />
      )}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "primary.main" }}>
        {icon}
      </Box>
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
    </Box>
    {subtitle && (
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5, ml: step ? 5.5 : 0 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default SectionHeader;

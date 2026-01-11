import React, { useMemo } from "react";
import {
  Alert,
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { prefCd } from "../../../constants/preCd";
import {
  getDeliveryFeeLabel,
  getDeliveryFeeRoundTripLabel,
  isConsultationArea,
  getDeliveryFee,
} from "../../api/deliveryData";
import { SendDataType } from "../utils/sendDataType";

interface Props {
  control: Control<SendDataType>;
  errors: FieldErrors<SendDataType>;
}

// 配送料金でグループ化した都道府県リスト
const getPrefecturesByFee = () => {
  const groups: Record<string, typeof prefCd> = {
    free: [],      // 無料
    low: [],       // ¥16,500
    mid: [],       // ¥27,500
    high: [],      // ¥37,400
    consultation: [], // 要相談
  };

  prefCd.forEach((pref) => {
    const fee = getDeliveryFee(pref.value);
    if (fee === "consultation") {
      groups.consultation.push(pref);
    } else if (fee === 0) {
      groups.free.push(pref);
    } else if (fee === 16500) {
      groups.low.push(pref);
    } else if (fee === 27500) {
      groups.mid.push(pref);
    } else if (fee === 37400) {
      groups.high.push(pref);
    }
  });

  return groups;
};

const DeliveryArea: React.FC<Props> = ({ control, errors }) => {
  const prefectureGroups = useMemo(() => getPrefecturesByFee(), []);

  return (
    <Grid item xs={12}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
        >
          <LocalShippingIcon color="primary" />
          配送先エリア
        </Typography>

        <Controller
          control={control}
          name="deliveryPrefecture"
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <InputLabel>配送先都道府県</InputLabel>
              <Select
                {...field}
                label="配送先都道府県"
                error={!!errors.deliveryPrefecture}
              >
                {/* 無料エリア */}
                <MenuItem disabled sx={{ bgcolor: "success.light", fontWeight: "bold" }}>
                  無料エリア
                </MenuItem>
                {prefectureGroups.free.map((pref) => (
                  <MenuItem key={pref.value} value={pref.value}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <span>{pref.label}</span>
                      <Chip label="無料" size="small" color="success" sx={{ height: 20 }} />
                    </Box>
                  </MenuItem>
                ))}

                {/* ¥16,500エリア */}
                <MenuItem disabled sx={{ bgcolor: "info.light", fontWeight: "bold", mt: 1 }}>
                  ¥16,500（片道）エリア
                </MenuItem>
                {prefectureGroups.low.map((pref) => (
                  <MenuItem key={pref.value} value={pref.value}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <span>{pref.label}</span>
                      <Chip label="¥16,500" size="small" color="info" sx={{ height: 20 }} />
                    </Box>
                  </MenuItem>
                ))}

                {/* ¥27,500エリア */}
                <MenuItem disabled sx={{ bgcolor: "warning.light", fontWeight: "bold", mt: 1 }}>
                  ¥27,500（片道）エリア
                </MenuItem>
                {prefectureGroups.mid.map((pref) => (
                  <MenuItem key={pref.value} value={pref.value}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <span>{pref.label}</span>
                      <Chip label="¥27,500" size="small" color="warning" sx={{ height: 20 }} />
                    </Box>
                  </MenuItem>
                ))}

                {/* ¥37,400エリア */}
                <MenuItem disabled sx={{ bgcolor: "error.light", fontWeight: "bold", mt: 1 }}>
                  ¥37,400（片道）エリア
                </MenuItem>
                {prefectureGroups.high.map((pref) => (
                  <MenuItem key={pref.value} value={pref.value}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <span>{pref.label}</span>
                      <Chip label="¥37,400" size="small" color="error" sx={{ height: 20 }} />
                    </Box>
                  </MenuItem>
                ))}

                {/* 要相談エリア */}
                <MenuItem disabled sx={{ bgcolor: "grey.300", fontWeight: "bold", mt: 1 }}>
                  要相談エリア
                </MenuItem>
                {prefectureGroups.consultation.map((pref) => (
                  <MenuItem key={pref.value} value={pref.value}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <span>{pref.label}</span>
                      <Chip label="要相談" size="small" sx={{ height: 20 }} />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        {/* 選択中の配送料表示 */}
        <Controller
          control={control}
          name="deliveryPrefecture"
          render={({ field }) => {
            const selectedPref = prefCd.find((p) => p.value === field.value);
            const isConsult = isConsultationArea(field.value);
            const feeLabel = getDeliveryFeeLabel(field.value);
            const roundTripLabel = getDeliveryFeeRoundTripLabel(field.value);

            if (!selectedPref) return <></>;

            return (
              <Box sx={{ mt: 1.5 }}>
                {isConsult ? (
                  <Alert severity="warning" icon={<InfoOutlinedIcon />}>
                    <Typography variant="body2">
                      <strong>{selectedPref.label}</strong>への配送は別途ご相談ください。
                    </Typography>
                  </Alert>
                ) : (
                  <Alert severity="info" icon={<LocalShippingIcon />}>
                    <Typography variant="body2">
                      <strong>{selectedPref.label}</strong>への配送料：
                      {feeLabel === "無料" ? (
                        <Chip label="無料" size="small" color="success" sx={{ ml: 1 }} />
                      ) : (
                        <>
                          <strong> {feeLabel}</strong>（片道）
                          → <strong>{roundTripLabel}</strong>（往復）
                        </>
                      )}
                    </Typography>
                  </Alert>
                )}
              </Box>
            );
          }}
        />

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          ※ 配送料は納車・引き取りの往復料金で計算されます
        </Typography>
      </Box>
    </Grid>
  );
};

export default DeliveryArea;

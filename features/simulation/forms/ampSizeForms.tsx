import { UnitPriceType } from "../../api/type";
import { RhfRadioButton } from "../../../component/molecules/rhfForm";
import React, { useEffect } from "react";
import { PriceConv } from "../../../utils/dataConv";

interface AmpSizeFormType {
  setValue: any;
  control: any;
  errors: any;
  apiData: UnitPriceType;
}

interface apiSizeLabelProps {
  "60": number | null;
  "150": number | null;
  "300": number | null;
  "600": number | null;
}
const AmpSizeLabel = (ampSize: apiSizeLabelProps) => {
  const label60 = ampSize["60"] !== null ? `60w（${PriceConv(ampSize["60"])}）` : "";
  const label150 = ampSize["150"] !== null ? `150w（${PriceConv(ampSize["150"])}）` : "";
  const label300 = ampSize["300"] !== null ? `300w（${PriceConv(ampSize["300"])}）` : "";
  const label600 = ampSize["600"] !== null ? `600w (${PriceConv(ampSize["600"])})` : "";

  return [label60, label150, label300, label600];
};

export const AmpSizeForm = ({ setValue, control, errors, apiData }: AmpSizeFormType) => {
  let options: { label: string; value: string }[] = [];
  const ampSize = apiData.unitPrice.ampSize;
  const [label60, label150, label300, label600] = AmpSizeLabel(apiData.unitPrice.ampSize)

  Object.keys(ampSize).map((key) => {
    switch (key) {
      case "60":
        ampSize[key] !== null && options.push({ label: label60, value: "60" });
        break;
      case "150":
        ampSize[key] !== null && options.push({ label: label150, value: "150" });
        break;
      case "300":
        ampSize[key] !== null && options.push({ label: label300, value: "300" });
        break;
      case "600":
        ampSize[key] !== null && options.push({ label: label600, value: "600" });
        break;
    }
  });

  useEffect(()=>{
    setValue("ampSize", options[0]?.value);
  },[ampSize])

  return (
    <RhfRadioButton
      control={control}
      errors={errors}
      name={"ampSize"}
      label={"アンプサイズ"}
      size={"small"}
      // row={true}
      sx={{ pl: "20px" }}
      options={options}
    />
  );
};

export const SwitchAmpSizeForm = ({ setValue, control, errors, apiData }: AmpSizeFormType) => {
  let options: { label: string; value: string }[] = [];
  const ampSize = apiData.changeDisplay?.ampSize;

  const [label60, label150, label300, label600] = AmpSizeLabel(apiData.unitPrice.ampSize)

  if (ampSize) {
    Object.keys(ampSize).map((key) => {
      switch (key) {
        case "60":
          if (ampSize[key]) {
            options.push({ label: label60, value: "60" });
          }
          break;
        case "150":
          if (ampSize[key]) {
            options.push({ label: label150, value: "150" });
          }
          break;
        case "300":
          if (ampSize[key]) {
            options.push({ label: label300, value: "300" });
          }
          break;
        case "600":
          if (ampSize[key]) {
            options.push({ label: label600, value: "600" });
          }
          break;
      }
    });
  }

  useEffect(()=>{
    setValue("ampSize", options[0]?.value);
  },[ampSize])

  return (
    <RhfRadioButton
      control={control}
      errors={errors}
      name={"ampSize"}
      label={"アンプサイズ"}
      size={"small"}
      // row={true}
      sx={{ pl: "20px" }}
      options={options}
    />
  );
};

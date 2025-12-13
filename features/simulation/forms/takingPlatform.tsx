import RhfCheckbox from "../../../component/molecules/rhfForm/rhfCheckbox";
import React, { useEffect, useState } from "react";
import { UnitPriceType } from "../../api/type";
import { PriceConv } from "../../../utils/dataConv";

interface AmpSizeFormType {
  control: any;
  errors: any;
  setValue: any;
  apiData: UnitPriceType;
}

// todo 時間ないから適当に書いてる。リファ必要
export const TakingPlatform = ({ control, errors, setValue, apiData }: AmpSizeFormType) => {
  const [jsx, setJsx] = useState<any>(
    <RhfCheckbox
      control={control}
      errors={errors}
      label={"登壇"}
      sx={{ pl: "20px" }}
      disabled={false}
      options={[
        {
          label:
            apiData.unitPrice.takingPlatform !== null
              ? PriceConv(apiData.unitPrice.takingPlatform)
              : "",
          name: "takingPlatform",
          defaultChecked: true,
        },
      ]}
    />,
  );
  useEffect(() => {
    if (apiData.takingPlatformFix === true) {
      setValue("takingPlatform", true);
      setJsx(
        <RhfCheckbox
          key={"qwe"}
          control={control}
          errors={errors}
          label={"登壇"}
          sx={{ pl: "20px" }}
          disabled={true}
          options={[
            {
              label:
                apiData.unitPrice.takingPlatform !== null
                  ? PriceConv(apiData.unitPrice.takingPlatform)
                  : "",
              name: "takingPlatform",
              defaultChecked: true,
            },
          ]}
        />,
      );
    } else {
      setValue("takingPlatform", false);
      setJsx(
        <RhfCheckbox
          key={"zxc"}
          control={control}
          errors={errors}
          label={"登壇"}
          sx={{ pl: "20px" }}
          disabled={false}
          options={[
            {
              label:
                apiData.unitPrice.takingPlatform !== null
                  ? PriceConv(apiData.unitPrice.takingPlatform)
                  : "",
              name: "takingPlatform",
              defaultChecked: false,
            },
          ]}
        />,
      );
    }
  }, [apiData.takingPlatformFix]);

  return jsx;
};

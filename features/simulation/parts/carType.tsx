import React, { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { ChangeCarForm } from "./changeCarForm";
import { apiData } from "../../api/apiData";
import {ElectoralClass} from "../calc/calcSimlationParts";

interface Props {
  setValue: any;
  control: any;
  errors: any;
  calcValue: any;
}

const CarType = ({ setValue, control, errors, calcValue }: Props) => {
  const [carType, setCarType] = useState<any>("");
  const getCarClass: "s" | "m" | "l" | "ll" = useWatch({ control, name: "carClass" });
  const getCarType = useWatch({ control, name: "carType" });
  const electoralClass: ElectoralClass = useWatch({ control, name: "electoralClass" });

  // 車のタイプによって、オプション表示を切り替える
  useEffect(() => {
    switch (getCarType[getCarClass]) {
      // sClass
      case "heightWagon":
        setCarType(
          <ChangeCarForm
            apiData={apiData.s.heightWagon[electoralClass]}
            control={control}
            errors={errors}
            calcValue={calcValue}
            setValue={setValue}
          />,
        );
        break;
      case "boxVan":
        setCarType(
          <ChangeCarForm
            apiData={apiData.s.boxVan[electoralClass]}
            control={control}
            errors={errors}
            calcValue={calcValue}
            setValue={setValue}
          />,
        );
        break;
      case "compact":
        setCarType(
          <ChangeCarForm
            apiData={apiData.s.compact[electoralClass]}
            control={control}
            errors={errors}
            calcValue={calcValue}
            setValue={setValue}
          />,
        );
        break;

      // mClass
      case "corollaFielder":
        setCarType(
          <ChangeCarForm
            apiData={apiData.m.corollaFielder[electoralClass]}
            control={control}
            errors={errors}
            calcValue={calcValue}
            setValue={setValue}
          />,
        );
        break;
      case "shienta":
        setCarType(
          <ChangeCarForm
            apiData={apiData.m.shienta[electoralClass]}
            control={control}
            errors={errors}
            calcValue={calcValue}
            setValue={setValue}
          />,
        );
        break;
      case "proBox":
        setCarType(
          <ChangeCarForm
            apiData={apiData.m.proBox[electoralClass]}
            control={control}
            errors={errors}
            calcValue={calcValue}
            setValue={setValue}
          />,
        );
        break;

      // lClass
      case "noah":
        setCarType(
          <ChangeCarForm
            apiData={apiData.l.noah[electoralClass]}
            control={control}
            errors={errors}
            calcValue={calcValue}
            setValue={setValue}
          />,
        );
        break;
      case "noah_80":
        setCarType(
          <ChangeCarForm
            apiData={apiData.l.noah_80[electoralClass]}
            control={control}
            errors={errors}
            calcValue={calcValue}
            setValue={setValue}
          />,
        );
        break;
      case "noah_90":
        setCarType(
          <ChangeCarForm
            apiData={apiData.l.noah_90[electoralClass]}
            control={control}
            errors={errors}
            calcValue={calcValue}
            setValue={setValue}
          />,
        );
        break;

      case "townAce":
        setCarType(
          <ChangeCarForm
            apiData={apiData.l.townAce[electoralClass]}
            control={control}
            errors={errors}
            calcValue={calcValue}
            setValue={setValue}
          />,
        );
        break;

      // llClass
      case "regiusaceAceBasic":
        setCarType(
          <ChangeCarForm
            apiData={apiData.ll.regiusaceAceBasic[electoralClass]}
            control={control}
            errors={errors}
            calcValue={calcValue}
            setValue={setValue}
          />,
        );
        break;
      case "regiusaceAceWide":
        setCarType(
          <ChangeCarForm
            apiData={apiData.ll.regiusaceAceWide[electoralClass]}
            control={control}
            errors={errors}
            calcValue={calcValue}
            setValue={setValue}
          />,
        );
        break;

      default:
        break;
    }
  }, [getCarClass, getCarType, calcValue, electoralClass]);

  return carType;
};

export default CarType;

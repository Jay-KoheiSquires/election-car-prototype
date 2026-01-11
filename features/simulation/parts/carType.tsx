/**
 * 車種別オプション表示コンポーネント
 * 選択された車種に応じたオプションフォームを表示
 */
import React, { memo, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { ChangeCarForm } from "./changeCarForm";
import { apiData } from "../../api/apiData";
import { ElectoralClass } from "../calc/calcSimlationParts";
import { FullFormProps, CarClassType } from "../types/formTypes";
import { UnitPriceType } from "../../api/type";

/**
 * 車種コードからAPIデータを取得するヘルパー関数
 */
const getApiDataByCarType = (
  carClass: CarClassType,
  carType: string,
  electoralClass: ElectoralClass
): UnitPriceType | null => {
  // 車クラスと車種に応じたデータを取得
  // apiDataの構造が複雑なため、型アサーションを使用
  const classDataMap = apiData[carClass as keyof typeof apiData] as unknown;
  if (!classDataMap || typeof classDataMap !== "object") return null;

  const carTypeDataMap = (classDataMap as Record<string, unknown>)[carType];
  if (!carTypeDataMap || typeof carTypeDataMap !== "object") return null;

  const result = (carTypeDataMap as Record<string, UnitPriceType>)[electoralClass];
  return result || null;
};

const CarType = memo(({ setValue, control, errors, calcValue }: FullFormProps) => {
  const getCarClass = useWatch({ control, name: "carClass" }) as CarClassType;
  const getCarType = useWatch({ control, name: "carType" });
  const electoralClass = useWatch({ control, name: "electoralClass" }) as ElectoralClass;

  // 車種に応じたAPIデータをメモ化
  const carApiData = useMemo(() => {
    if (!getCarClass || !getCarType || !electoralClass) return null;
    const currentCarType = getCarType[getCarClass];
    return getApiDataByCarType(getCarClass, currentCarType, electoralClass);
  }, [getCarClass, getCarType, electoralClass]);

  // APIデータがない場合は何も表示しない
  if (!carApiData) return null;

  return (
    <ChangeCarForm
      apiData={carApiData}
      control={control}
      errors={errors}
      calcValue={calcValue}
      setValue={setValue}
    />
  );
});
CarType.displayName = "CarType";

export default CarType;

/**
 * 車種選択コンポーネント群
 * 各車クラス（S/M/L/LL）の車種選択UIを提供
 */
import React from "react";
import CarToggle from "../../component/organisms/rapForm/carToggle";
import { PriceConv } from "../../utils/dataConv";
import { ApiDataType } from "../api/type";
import { useWatch } from "react-hook-form";
import { ElectoralClass } from "./calc/calcSimlationParts";
import { FormControl, FormSetValue } from "./types/formTypes";

interface CarCarProps {
  control: FormControl;
  setValue: FormSetValue;
  apiData: ApiDataType;
}

// sClass
export const LightCar = ({ control, setValue, apiData }: CarCarProps) => {
  const getElectoralClass: ElectoralClass = useWatch({
    control,
    name: "electoralClass",
  });
  return (
    <>
      <CarToggle
        control={control}
        name={"carType.s"}
        options={[
          {
            label: "軽ハイトワゴン",
            value: "heightWagon",
            priceLabel: PriceConv(apiData?.s.heightWagon[getElectoralClass].unitPrice.car),
            image: "image/car/sClass/heightWagon.png",
            tags: ["小回り◎", "低コスト"],
          },
          {
            label: "軽ハコバン",
            value: "boxVan",
            priceLabel: PriceConv(apiData?.s.boxVan[getElectoralClass].unitPrice.car),
            image: "image/car/sClass/boxVan.png",
            tags: ["荷物◎", "実用的"],
          },
          {
            label: "コンパクトカー",
            value: "compact",
            priceLabel: PriceConv(apiData?.s.compact[getElectoralClass].unitPrice.car),
            image: "image/car/sClass/compact.png",
            tags: ["乗り心地◎", "静粛性"],
          },
        ]}
      />
    </>
  );
};

// mClass
export const CompactCar = ({ control, setValue, apiData }: CarCarProps) => {
  const getElectoralClass: ElectoralClass = useWatch({
    control,
    name: "electoralClass",
  });
  return (
    <>
      <CarToggle
        control={control}
        name={"carType.m"}
        options={[
          {
            label: "カローラ フィルダー",
            value: "corollaFielder",
            priceLabel: PriceConv(apiData?.m.corollaFielder[getElectoralClass].unitPrice.car),
            image: "image/car/mClass/corollaFielder.png",
            tags: ["人気No.1", "バランス型"],
          },
          {
            label: "トヨタ シエンタ",
            value: "shienta",
            priceLabel: PriceConv(apiData?.m.shienta[getElectoralClass].unitPrice.car),
            image: "image/car/mClass/shienta.png",
            tags: ["広い荷室", "視認性◎"],
          },
          {
            label: "プロボックス",
            value: "proBox",
            priceLabel: PriceConv(apiData?.m.proBox[getElectoralClass].unitPrice.car),
            image: "image/car/mClass/proBox.png",
            tags: ["頑丈", "実用的"],
          },
        ]}
      />
    </>
  );
};

// lClass
export const StandardCar = ({ control, setValue, apiData }: CarCarProps) => {
  const getElectoralClass: ElectoralClass = useWatch({
    control,
    name: "electoralClass",
  });
  return (
    <>
      {getElectoralClass !== "national" ?
        <CarToggle
          control={control}
          name={"carType.l"}
          options={[
            {
              label: "NOAH",
              value: "noah",
              priceLabel: PriceConv(apiData?.l.noah[getElectoralClass].unitPrice.car),
              image: "image/car/lClass/noah.png",
              tags: ["存在感◎", "登壇可能"],
            },
            {
              label: "タウンエース",
              value: "townAce",
              priceLabel: PriceConv(apiData?.l.townAce[getElectoralClass].unitPrice.car),
              image: "image/car/lClass/townAce.png",
              tags: ["広い荷室", "コスパ◎"],
            },
          ]}
        />
      :
        <CarToggle
          control={control}
          name={"carType.l"}
          options={[
            {
              label: "NOAH・VOXY：70型",
              value: "noah",
              priceLabel: PriceConv(apiData?.l.noah[getElectoralClass].unitPrice.car),
              image: "image/car/noImage.png",
              tags: ["定番", "安定感"],
            },
            {
              label: "NOAH・VOXY：80型",
              value: "noah_80",
              priceLabel: PriceConv(apiData?.l.noah_80[getElectoralClass].unitPrice.car),
              image: "image/car/noImage.png",
              tags: ["人気", "実績多数"],
            },
            {
              label: "NOAH・VOXY：90型",
              value: "noah_90",
              priceLabel: PriceConv(apiData?.l.noah_90[getElectoralClass].unitPrice.car),
              image: "image/car/lClass/noah.png",
              tags: ["最新型", "注目度◎"],
            },
            {
              label: "タウンエース",
              value: "townAce",
              priceLabel: PriceConv(apiData?.l.townAce[getElectoralClass].unitPrice.car),
              image: "image/car/lClass/townAce.png",
              tags: ["広い荷室", "コスパ◎"],
            },
          ]}
        />}
    </>
  );
};

// llClass
export const VanCar = ({ control, setValue, apiData }: CarCarProps) => {
  const getElectoralClass: ElectoralClass = useWatch({
    control,
    name: "electoralClass",
  });
  return (
    <>
      <CarToggle
        control={control}
        name={"carType.ll"}
        options={[
          {
            label: "レジアスエース(標準)",
            value: "regiusaceAceBasic",
            priceLabel: PriceConv(apiData?.ll.regiusaceAceBasic[getElectoralClass].unitPrice.car),
            image: "image/car/llClass/regiusaceAceBasic.png",
            tags: ["大容量", "ラッピング◎"],
          },
          {
            label: "レジアスエース(ワイド)",
            value: "regiusaceAceWide",
            priceLabel: PriceConv(apiData?.ll.regiusaceAceWide[getElectoralClass].unitPrice.car),
            image: "image/car/llClass/regiusaceAceWide.png",
            tags: ["最大級", "国政向け"],
          },
        ]}
      />
    </>
  );
};

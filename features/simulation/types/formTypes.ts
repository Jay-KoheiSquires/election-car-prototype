/**
 * シミュレーションフォーム用の共通型定義
 * react-hook-formのControl, FieldErrors, UseFormSetValueの型を定義
 */
import { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { SendDataType } from "../utils/sendDataType";
import { CalcDataType } from "../calc/calcSimulation";

/**
 * フォームコントロールの型
 */
export type FormControl = Control<SendDataType>;

/**
 * フォームエラーの型
 */
export type FormErrors = FieldErrors<SendDataType>;

/**
 * フォーム値セッターの型
 */
export type FormSetValue = UseFormSetValue<SendDataType>;

/**
 * 基本的なフォームコンポーネントProps
 */
export interface BaseFormProps {
  control: FormControl;
  errors: FormErrors;
}

/**
 * setValue付きフォームコンポーネントProps
 */
export interface FormPropsWithSetValue extends BaseFormProps {
  setValue: FormSetValue;
}

/**
 * 計算結果付きフォームコンポーネントProps
 */
export interface FormPropsWithCalcValue extends BaseFormProps {
  calcValue: CalcDataType;
}

/**
 * 全機能付きフォームコンポーネントProps
 */
export interface FullFormProps extends BaseFormProps {
  setValue: FormSetValue;
  calcValue: CalcDataType;
}

/**
 * 車クラスの型
 */
export type CarClassType = "s" | "m" | "l" | "ll";

/**
 * 選挙区分の型
 */
export type ElectoralClassType = "unity" | "general" | "national" | "ad";

/**
 * ライト区分の型
 */
export type SignalLightType = "outLight" | "inLight";

/**
 * アンプサイズの型
 */
export type AmpSizeType = "60" | "150" | "300" | "600";

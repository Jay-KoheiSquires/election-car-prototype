/**
 * E2Eテスト用テストデータ
 */

export const testCustomer = {
  name: "テスト 太郎",
  furigana: "テスト タロウ",
  postCode: "100-0001",
  address: "東京都千代田区千代田1-1",
  tel: "03-1234-5678",
  email: "test@example.com",
};

export const testDelivery = {
  date: "2025-04-01",
  time: "10:00",
  location: "office" as const,
};

export const prefectures = {
  free: ["tottori", "chiba", "miyagi"],
  paid: {
    tokyo: 33000,
    osaka: 33000,
    fukuoka: 55000,
    aichi: 74800,
  },
  consultation: ["hokkaido", "okinawa"],
};

export const carClasses = ["s", "m", "l", "ll"] as const;

export const electionTypes = [
  { value: "general", label: "一般地方選挙" },
  { value: "unity", label: "統一地方選挙" },
  { value: "national", label: "衆・参議院選挙" },
  { value: "ad", label: "広告宣伝車" },
];

import { ClassType } from "../../type";

// カローラフィールダーのAPIデータを定義

export const corollaFielder: ClassType = {
  // 統一地方選挙
  unity: {
    unitPrice: {
      car: 550000,
      ampSize: {
        "60": null,
        "150": null,
        "300": 0,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: 55000,
      },
      takingPlatform: null,
    },
  },

  // todo スピーカ2個は選択できない様にしたいが、今の実装方法だとコントロールできない
  // 一般地方選挙
  general: {
    unitPrice: {
      car: 242000,
      ampSize: {
        "60": null,
        "150": 0,
        "300": 22000,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: 16500,
      },
      takingPlatform: null,
    },
  },
  // 衆・参議院選挙
  national: {
    unitPrice: {
      car: 440000,
      ampSize: {
        "60": null,
        "150": 0,
        "300": 22000,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: 2200,
      },
      takingPlatform: null,
    },
  },

  // 広告宣伝社
  ad: {
    unitPrice: {
      car: 239000,
      ampSize: {
        "60": null,
        "150": 0,
        "300": 55000,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: 55000,
      },
      takingPlatform: null,
    },
  },
};

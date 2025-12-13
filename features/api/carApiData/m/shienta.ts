import { ClassType } from "../../type";

// シエンタのAPIデータを定義

export const shienta: ClassType = {
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
        inLight: 16500
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
        inLight: 22000
      },
      takingPlatform: null,
    },
  },

  // 広告宣伝社
  ad: {
    unitPrice: {
      car: 249000,
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

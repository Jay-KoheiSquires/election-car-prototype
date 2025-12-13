import { ClassType } from "../../type";

// 軽ハイトワゴンのAPIデータを定義

export const heightWagon: ClassType = {
  // 統一地方選挙
  unity: {
    unitPrice: {
      car: 495000,
      ampSize: {
        "60": null,
        "150": 0,
        "300": 55000,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: null,
      },
      takingPlatform: null,
    },
  },

  // 一般地方選挙
  general: {
    unitPrice: {
      car: 198000,
      ampSize: {
        "60": null,
        "150": 0,
        "300": null,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: null,
      },
      takingPlatform: null,
    },
  },
  // 衆・参議院選挙
  national: {
    unitPrice: {
      car: 330000,
      ampSize: {
        "60": null,
        "150": 0,
        "300": null,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: null,
      },
      takingPlatform: null,
    },
  },

  // 広告宣伝社
  ad: {
    unitPrice: {
      car: 189000,
      ampSize: {
        "60": null,
        "150": 0,
        "300": 55000,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: null,
      },
      takingPlatform: null,
    },
  },
};

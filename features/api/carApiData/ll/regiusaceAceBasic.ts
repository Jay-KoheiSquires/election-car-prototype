import { ClassType } from "../../type";

// ハイエース（標準ボディ）のAPIデータを定義

export const regiusaceAceBasic: ClassType = {
  // 統一地方選挙
  unity: {
    unitPrice: {
      car: 1100000,
      ampSize: {
        "60": null,
        "150": null,
        "300": null,
        "600": 0,
      },
      signalLight: {
        outLight: 0,
        inLight: 200000,
      },
      takingPlatform: 0,
    },
    takingPlatformChangeDisplay: false,
    takingPlatformFix: true,
    changeDisplay: {
      ampSize: {
        "60": false,
        "150": false,
        "300": false,
        "600": true,
      },
      signalLight: {
        outLight: true,
        inLight: true,
      },
    },
  },

  // 一般地方選挙
  general: {
    unitPrice: {
      car: 555000,
      ampSize: {
        "60": null,
        "150": null,
        "300": null,
        "600": 0,
      },
      signalLight: {
        outLight: 0,
        inLight: 110000,
      },
      takingPlatform: 0,
    },
    takingPlatformChangeDisplay: false,
    takingPlatformFix: true,
    changeDisplay: {
      ampSize: {
        "60": false,
        "150": false,
        "300": false,
        "600": true,
      },
      signalLight: {
        outLight: true,
        inLight: true,
      },
    },
  },
  // 衆・参議院選挙
  national: {
    unitPrice: {
      car: 660000,
      ampSize: {
        "60": null,
        "150": null,
        "300": 0,
        "600": 55000,
      },
      signalLight: {
        outLight: 0,
        inLight: 55000,
      },
      takingPlatform: 0,
    },
    takingPlatformChangeDisplay: true,
    takingPlatformFix: false,
    changeDisplay: {
      ampSize: {
        "60": false,
        "150": false,
        "300": true,
        "600": true,
      },
      signalLight: {
        outLight: true,
        inLight: true,
      },
    },
  },

  // 広告宣伝社
  ad: {
    unitPrice: {
      car: 555000,
      ampSize: {
        "60": null,
        "150": null,
        "300": null,
        "600": 0,
      },
      signalLight: {
        outLight: 0,
        inLight: 110000,
      },
      takingPlatform: 0,
    },
    takingPlatformChangeDisplay: true,
    takingPlatformFix: false,
    changeDisplay: {
      ampSize: {
        "60": false,
        "150": false,
        "300": false,
        "600": true,
      },
      signalLight: {
        outLight: true,
        inLight: true,
      },
    },
  },
};

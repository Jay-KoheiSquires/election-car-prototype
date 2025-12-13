import { ClassType } from "../../type";

// ノアのAPIデータを定義

export const noah: ClassType = {
  // 統一地方選挙
  unity: {
    unitPrice: {
      car: 748000,
      ampSize: {
        "60": null,
        "150": null,
        "300": 0,
        "600": null,
      },
      signalLight: {
        outLight: null,
        inLight: 0,
      },
      takingPlatform: null,
    },
    takingPlatformChangeDisplay: undefined,
    takingPlatformFix: undefined,
    changeDisplay: undefined,
  },

  // 一般地方選挙
  general: {
    unitPrice: {
      car: 275000,
      ampSize: {
        "60": null,
        "150": 0,
        "300": 0,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: 55000,
      },
      takingPlatform: 55000,
    },
    takingPlatformChangeDisplay: true,
    takingPlatformFix: false,
    changeDisplay: {
      ampSize: {
        "60": false,
        "150": true,
        "300": true,
        "600": false,
      },
      signalLight: {
        outLight: false,
        inLight: true,
      },
    },
  },

  // 衆・参議院選挙
  national: {
    unitPrice: {
      car: 528000,
      ampSize: {
        "60": null,
        "150": 0,
        "300": 33000,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: 33000,
      },
      takingPlatform: 55000,
    },
    takingPlatformChangeDisplay: false,
    takingPlatformFix: false,
    changeDisplay: {
      ampSize: {
        "60": false,
        "150": true,
        "300": true,
        "600": false,
      },
      signalLight: {
        outLight: false,
        inLight: true,
      },
    },
  },

  // 広告宣伝社
  ad: {
    unitPrice: {
      car: 269000,
      ampSize: {
        "60": null,
        "150": 0,
        "300": 0,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: 55000,
      },
      takingPlatform: 55000,
    },
    takingPlatformChangeDisplay: true,
    takingPlatformFix: false,
    changeDisplay: {
      ampSize: {
        "60": false,
        "150": true,
        "300": true,
        "600": false,
      },
      signalLight: {
        outLight: false,
        inLight: true,
      },
    },
  },
};

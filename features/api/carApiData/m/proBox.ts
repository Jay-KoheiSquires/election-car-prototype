import { ClassType } from "../../type";

// プロボックスのAPIデータを定義

export const proBox: ClassType = {
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
      takingPlatform: 55000,
    },
    takingPlatformChangeDisplay: true,
    takingPlatformFix: false,
    changeDisplay: {
      ampSize: {
        "60": false,
        "150": false,
        "300": true,
        "600": false,
      },
      signalLight: {
        outLight: true,
        inLight: false,
      },
    },
  },

  // 一般地方選挙
  general: {
    unitPrice: {
      car: 242000,
      ampSize: {
        "60": null,
        "150": 0,
        "300": 0,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: 16500,
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
      car: 440000,
      ampSize: {
        "60": null,
        "150": 0,
        "300": 22000,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: 22000,
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

  // 広告宣伝社
  ad: {
    unitPrice: {
      car: 239000,
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
        "150": false,
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

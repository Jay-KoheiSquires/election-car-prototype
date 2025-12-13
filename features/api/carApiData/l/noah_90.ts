import { ClassType } from "../../type";

// ノアのAPIデータを定義

export const noah_90: ClassType = {

  // 現状使われていないよ！
  // 統一地方選挙
  unity: {
    unitPrice: {
      car: 999999,
      ampSize: {
        "60": 999999,
        "150": 999999,
        "300": 999999,
        "600": 999999,
      },
      signalLight: {
        outLight: 999999,
        inLight: 999999,
      },
      takingPlatform: 999999,
    },
    takingPlatformChangeDisplay: true,
    takingPlatformFix: true,
    changeDisplay: {
      ampSize: {
        "60": true,
        "150": true,
        "300": true,
        "600": true,
      },
      signalLight: {
        outLight: true,
        inLight: true,
      },
    },
  },

  // 現状使われていないよ！
  // 一般地方選挙
  general: {
    unitPrice: {
      car: 999999,
      ampSize: {
        "60": 999999,
        "150": 999999,
        "300": 999999,
        "600": 999999,
      },
      signalLight: {
        outLight: 999999,
        inLight: 999999,
      },
      takingPlatform: 999999,
    },
    takingPlatformChangeDisplay: true,
    takingPlatformFix: true,
    changeDisplay: {
      ampSize: {
        "60": true,
        "150": true,
        "300": true,
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
      car: 550000,
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

  // 現状使われていないよ！
  // 広告宣伝社
  ad: {
    unitPrice: {
      car: 999999,
      ampSize: {
        "60": 999999,
        "150": 999999,
        "300": 999999,
        "600": 999999,
      },
      signalLight: {
        outLight: 999999,
        inLight: 999999,
      },
      takingPlatform: 999999,
    },
    takingPlatformChangeDisplay: true,
    takingPlatformFix: true,
    changeDisplay: {
      ampSize: {
        "60": true,
        "150": true,
        "300": true,
        "600": true,
      },
      signalLight: {
        outLight: true,
        inLight: true,
      },
    },
  },
};

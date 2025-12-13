import { ClassType } from "../../type";

// 軽ハコバンのAPIデータを定義

export const boxVan: ClassType = {
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
      takingPlatform: 150000,
    },
    takingPlatformFix: true,
    changeDisplay: {
      ampSize: {
        "60": false,
        "150": true,
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
      car: 165000,
      ampSize: {
        "60": 0,
        "150": 33000,
        "300": 44000,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: null,
      },
      takingPlatform: 55000,
    },
    takingPlatformFix: false,
    takingPlatformChangeDisplay: true,
    changeDisplay: {
      ampSize: {
        "60": false,
        "150": true,
        "300": true,
        "600": false,
      },
      signalLight: {
        outLight: true,
        inLight: false,
      },
    },
  },
  // 衆・参議院選挙
  national: {
    unitPrice: {
      car: 330000,
      ampSize: {
        "60": null,
        "150": 0,
        "300": 22000,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: null,
      },
      takingPlatform: 55000,
    },
    takingPlatformFix: true,
    changeDisplay: {
      ampSize: {
        "60": false,
        "150": true,
        "300": true,
        "600": false,
      },
      signalLight: {
        outLight: true,
        inLight: false,
      },
    },
  },

  // 広告宣伝社
  ad: {
    unitPrice: {
      car: 198000,
      ampSize: {
        "60": null,
        "150": 33000,
        "300": 88000,
        "600": null,
      },
      signalLight: {
        outLight: 0,
        inLight: null,
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
        outLight: true,
        inLight: false,
      },
    },
  },
};

import { ClassType } from "../../type";

// コンパクトカーのAPIデータを定義

export const compact: ClassType = {
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
        inLight: 55000,
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
        outLight: false,
        inLight: true,
      },
    },
  },

  // todo アンプ選択時に他項目が変更になるケースを想定していなかったため、大幅に改修必要
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
        inLight: 55000,
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
        outLight: false,
        inLight: true,
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
        inLight: 22000,
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
        outLight: false,
        inLight: true,
      },
    },
  },

  // 広告宣伝社
  ad: {
    unitPrice: {
      car: 198000,
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
        outLight: false,
        inLight: true,
      },
    },
  },
};

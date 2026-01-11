/**
 * 料金シミュレーション計算ロジックのテスト
 */
import CalcSimulation, { CalcDataType } from '../../../../features/simulation/calc/calcSimulation';
import { SendDataType } from '../../../../features/simulation/utils/sendDataType';
import { formDefaultValue } from '../../../../features/simulation/utils/formDefaultValue';

describe('CalcSimulation', () => {
  // 基本的なテストデータ
  const createTestData = (overrides: Partial<SendDataType> = {}): SendDataType => ({
    ...formDefaultValue,
    ...overrides,
  });

  describe('基本料金計算', () => {
    it('デフォルト値で計算ができる', () => {
      const result = CalcSimulation(formDefaultValue);

      expect(result).toBeDefined();
      expect(result.totalPrice).toBeGreaterThan(0);
      expect(result.subTotalPrice).toBeGreaterThan(0);
    });

    it('車両料金が計算される', () => {
      const result = CalcSimulation(createTestData({
        electoralClass: 'general',
        carClass: 's',
      }));

      expect(result.subs.carPrice).toBeGreaterThan(0);
    });
  });

  describe('配送料計算', () => {
    it('無料エリア（鳥取）の配送料が0', () => {
      const result = CalcSimulation(createTestData({
        deliveryPrefecture: 'tottori',
      }));

      expect(result.delivery.fee).toBe(0);
      expect(result.delivery.isConsultation).toBe(false);
      expect(result.deliveryPrice).toBe(0);
    });

    it('東京の配送料が往復33,000円', () => {
      const result = CalcSimulation(createTestData({
        deliveryPrefecture: 'tokyo',
      }));

      expect(result.delivery.fee).toBe(33000);
      expect(result.delivery.isConsultation).toBe(false);
      expect(result.deliveryPrice).toBe(33000);
    });

    it('北海道は要相談エリア', () => {
      const result = CalcSimulation(createTestData({
        deliveryPrefecture: 'hokkaido',
      }));

      expect(result.delivery.isConsultation).toBe(true);
      expect(result.delivery.fee).toBe(0);
      expect(result.deliveryPrice).toBe(0);
    });

    it('配送料が合計金額に含まれる', () => {
      // 配送料なしの場合
      const resultFree = CalcSimulation(createTestData({
        deliveryPrefecture: 'tottori',
      }));

      // 配送料ありの場合
      const resultWithDelivery = CalcSimulation(createTestData({
        deliveryPrefecture: 'tokyo',
      }));

      // 配送料の差分が合計金額に反映されているか
      expect(resultWithDelivery.totalPrice - resultFree.totalPrice).toBe(33000);
    });
  });

  describe('オプション計算', () => {
    it('ワイヤレスマイクの料金が計算される', () => {
      const resultWithMike = CalcSimulation(createTestData({
        wirelessMike: true,
        wirelessMikeNumber: 2,
      }));

      const resultWithoutMike = CalcSimulation(createTestData({
        wirelessMike: false,
      }));

      expect(resultWithMike.options.totalMikePrice).toBeGreaterThan(0);
      expect(resultWithoutMike.options.totalMikePrice).toBe(0);
    });

    it('SDカードの料金が計算される', () => {
      const resultWithSD = CalcSimulation(createTestData({
        sd: true,
      }));

      const resultWithoutSD = CalcSimulation(createTestData({
        sd: false,
      }));

      expect(resultWithSD.options.sdPrice).toBeGreaterThan(0);
      expect(resultWithoutSD.options.sdPrice).toBe(0);
    });

    it('保険料金が日数に応じて計算される', () => {
      const result1Day = CalcSimulation(createTestData({
        insurance: true,
        insuranceDays: 1,
      }));

      const result5Days = CalcSimulation(createTestData({
        insurance: true,
        insuranceDays: 5,
      }));

      expect(result5Days.options.totalInsurancePrice).toBe(
        result1Day.options.insurancePrice * 5
      );
    });
  });

  describe('選挙区分による料金差', () => {
    it('統一地方選挙は一般地方選挙より高い', () => {
      const generalResult = CalcSimulation(createTestData({
        electoralClass: 'general',
        carClass: 's',
        deliveryPrefecture: 'tottori', // 配送料無料
      }));

      const unityResult = CalcSimulation(createTestData({
        electoralClass: 'unity',
        carClass: 's',
        deliveryPrefecture: 'tottori', // 配送料無料
      }));

      expect(unityResult.subTotalPrice).toBeGreaterThan(generalResult.subTotalPrice);
    });
  });

  describe('合計金額計算', () => {
    it('合計金額 = 小計 + オプション合計 + 配送料', () => {
      const result = CalcSimulation(createTestData({
        wirelessMike: true,
        wirelessMikeNumber: 1,
        sd: true,
        deliveryPrefecture: 'tokyo',
      }));

      const expectedTotal = result.subTotalPrice + result.optionTotalPrice + result.deliveryPrice;
      expect(result.totalPrice).toBe(expectedTotal);
    });
  });

  describe('CalcDataType構造', () => {
    it('必要なプロパティがすべて存在する', () => {
      const result = CalcSimulation(formDefaultValue);

      // subsプロパティ
      expect(result.subs).toBeDefined();
      expect(result.subs.carPrice).toBeDefined();
      expect(result.subs.ampSize).toBeDefined();
      expect(result.subs.signalLight).toBeDefined();
      expect(result.subs.takingPlatform).toBeDefined();

      // optionsプロパティ
      expect(result.options).toBeDefined();
      expect(result.options.totalMikePrice).toBeDefined();
      expect(result.options.sdPrice).toBeDefined();
      expect(result.options.incomePrice).toBeDefined();
      expect(result.options.handSpeakerPrice).toBeDefined();
      expect(result.options.bluetoothUnit).toBeDefined();
      expect(result.options.insurancePrice).toBeDefined();
      expect(result.options.totalInsurancePrice).toBeDefined();

      // deliveryプロパティ
      expect(result.delivery).toBeDefined();
      expect(result.delivery.fee).toBeDefined();
      expect(result.delivery.isConsultation).toBeDefined();

      // 合計プロパティ
      expect(result.subTotalPrice).toBeDefined();
      expect(result.optionTotalPrice).toBeDefined();
      expect(result.deliveryPrice).toBeDefined();
      expect(result.totalPrice).toBeDefined();
    });
  });
});

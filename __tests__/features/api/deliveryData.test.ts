/**
 * 配送料計算ロジックのテスト
 */
import {
  getDeliveryFee,
  calcDeliveryFeeRoundTrip,
  isConsultationArea,
  getDeliveryFeeLabel,
  getDeliveryFeeRoundTripLabel,
  deliveryFeeByPrefecture,
} from '../../../features/api/deliveryData';

describe('deliveryData', () => {
  describe('getDeliveryFee', () => {
    // 無料エリアのテスト
    describe('無料エリア', () => {
      it('鳥取県は無料', () => {
        expect(getDeliveryFee('tottori')).toBe(0);
      });

      it('千葉県は無料', () => {
        expect(getDeliveryFee('chiba')).toBe(0);
      });

      it('宮城県は無料', () => {
        expect(getDeliveryFee('miyagi')).toBe(0);
      });
    });

    // 16,500円エリアのテスト
    describe('16,500円エリア', () => {
      const prefectures = [
        'iwate', 'akita', 'yamagata', 'fukushima',
        'ibaraki', 'tochigi', 'gunma', 'saitama',
        'tokyo', 'kanagawa', 'osaka', 'hyogo',
        'okayama', 'hiroshima', 'shimane', 'kagawa',
      ];

      prefectures.forEach((pref) => {
        it(`${pref}は16,500円`, () => {
          expect(getDeliveryFee(pref)).toBe(16500);
        });
      });
    });

    // 27,500円エリアのテスト
    describe('27,500円エリア', () => {
      const prefectures = [
        'aomori', 'nigata', 'nagano', 'yamanashi',
        'shizuoka', 'kyoto', 'nara', 'wakayama',
        'yamaguchi', 'tokushima', 'ehime', 'kochi',
        'fukuoka', 'oita',
      ];

      prefectures.forEach((pref) => {
        it(`${pref}は27,500円`, () => {
          expect(getDeliveryFee(pref)).toBe(27500);
        });
      });
    });

    // 37,400円エリアのテスト
    describe('37,400円エリア', () => {
      const prefectures = [
        'toyama', 'ishikawa', 'fukui', 'gifu',
        'aichi', 'mie', 'shiga', 'saga',
        'nagasaki', 'kumamoto', 'kagoshima', 'miyazaki',
      ];

      prefectures.forEach((pref) => {
        it(`${pref}は37,400円`, () => {
          expect(getDeliveryFee(pref)).toBe(37400);
        });
      });
    });

    // 要相談エリアのテスト
    describe('要相談エリア', () => {
      it('北海道は要相談', () => {
        expect(getDeliveryFee('hokkaido')).toBe('consultation');
      });

      it('沖縄県は要相談', () => {
        expect(getDeliveryFee('okinawa')).toBe('consultation');
      });
    });

    // 未定義の都道府県
    it('未定義の都道府県コードは要相談を返す', () => {
      expect(getDeliveryFee('unknown')).toBe('consultation');
    });
  });

  describe('calcDeliveryFeeRoundTrip', () => {
    it('無料エリアは0を返す', () => {
      expect(calcDeliveryFeeRoundTrip('tottori')).toBe(0);
      expect(calcDeliveryFeeRoundTrip('chiba')).toBe(0);
    });

    it('16,500円エリアは往復で33,000円', () => {
      expect(calcDeliveryFeeRoundTrip('tokyo')).toBe(33000);
    });

    it('27,500円エリアは往復で55,000円', () => {
      expect(calcDeliveryFeeRoundTrip('fukuoka')).toBe(55000);
    });

    it('37,400円エリアは往復で74,800円', () => {
      expect(calcDeliveryFeeRoundTrip('aichi')).toBe(74800);
    });

    it('要相談エリアは0を返す', () => {
      expect(calcDeliveryFeeRoundTrip('hokkaido')).toBe(0);
      expect(calcDeliveryFeeRoundTrip('okinawa')).toBe(0);
    });
  });

  describe('isConsultationArea', () => {
    it('北海道は要相談エリア', () => {
      expect(isConsultationArea('hokkaido')).toBe(true);
    });

    it('沖縄県は要相談エリア', () => {
      expect(isConsultationArea('okinawa')).toBe(true);
    });

    it('東京都は要相談エリアではない', () => {
      expect(isConsultationArea('tokyo')).toBe(false);
    });

    it('無料エリアは要相談エリアではない', () => {
      expect(isConsultationArea('tottori')).toBe(false);
    });

    it('未定義の都道府県コードは要相談エリア', () => {
      expect(isConsultationArea('unknown')).toBe(true);
    });
  });

  describe('getDeliveryFeeLabel', () => {
    it('無料エリアは「無料」を返す', () => {
      expect(getDeliveryFeeLabel('tottori')).toBe('無料');
    });

    it('有料エリアは金額を返す', () => {
      expect(getDeliveryFeeLabel('tokyo')).toBe('¥16,500');
    });

    it('要相談エリアは「要相談」を返す', () => {
      expect(getDeliveryFeeLabel('hokkaido')).toBe('要相談');
    });
  });

  describe('getDeliveryFeeRoundTripLabel', () => {
    it('無料エリアは「無料」を返す', () => {
      expect(getDeliveryFeeRoundTripLabel('chiba')).toBe('無料');
    });

    it('有料エリアは往復金額を返す', () => {
      expect(getDeliveryFeeRoundTripLabel('tokyo')).toBe('¥33,000');
    });

    it('要相談エリアは「要相談」を返す', () => {
      expect(getDeliveryFeeRoundTripLabel('okinawa')).toBe('要相談');
    });
  });

  describe('deliveryFeeByPrefecture', () => {
    it('全47都道府県がマッピングされている', () => {
      // 47都道府県すべてがマッピングされているか確認
      const expectedPrefectures = 47;
      const actualCount = Object.keys(deliveryFeeByPrefecture).length;

      // 宮崎県が追加されているので47県あるはず
      expect(actualCount).toBe(expectedPrefectures);
    });
  });
});

/**
 * データ変換ユーティリティ関数のテスト
 * 各種コード値を日本語表示用テキストに変換する関数群をテスト
 */
import {
  ElectoralClassConv,
  ParliamentClassConv,
  CarClassConv,
  CarTypeConv,
  LocationConv,
  ContactType,
  SignalLightConv,
  SpeakerConv,
  PriceTaxConv,
  PriceConv,
  OptionConv,
  WattConv,
  PiecesConv,
  DayConv,
} from '../../utils/dataConv';

describe('dataConv', () => {
  describe('ElectoralClassConv - 選挙区分変換', () => {
    it('統一地方選挙を変換', () => {
      expect(ElectoralClassConv('unity')).toBe('統一地方選挙');
    });

    it('一般地方選挙を変換', () => {
      expect(ElectoralClassConv('general')).toBe('一般地方選挙');
    });

    it('衆・参議院選挙を変換', () => {
      expect(ElectoralClassConv('national')).toBe('衆・参議院選挙');
    });

    it('広告宣伝車を変換', () => {
      expect(ElectoralClassConv('ad')).toBe('広告宣伝車');
    });

    it('未定義の値は空文字を返す', () => {
      expect(ElectoralClassConv('unknown')).toBe('');
    });
  });

  describe('ParliamentClassConv - 議会タイプ変換', () => {
    it('議員を変換', () => {
      expect(ParliamentClassConv('chairman')).toBe('議員');
    });

    it('首長を変換', () => {
      expect(ParliamentClassConv('chief')).toBe('首長');
    });

    it('未定義の値は空文字を返す', () => {
      expect(ParliamentClassConv('unknown')).toBe('');
    });
  });

  describe('CarClassConv - 車クラス変換', () => {
    it('Sクラスを変換', () => {
      expect(CarClassConv('s')).toBe('Sクラス');
    });

    it('Mクラスを変換', () => {
      expect(CarClassConv('m')).toBe('Mクラス');
    });

    it('Lクラスを変換', () => {
      expect(CarClassConv('l')).toBe('Lクラス');
    });

    it('LLクラスを変換', () => {
      expect(CarClassConv('ll')).toBe('LLクラス');
    });

    it('未定義の値は空文字を返す', () => {
      expect(CarClassConv('unknown')).toBe('');
    });
  });

  describe('CarTypeConv - 車両名変換', () => {
    describe('Sクラス車両', () => {
      it('軽ハイトワゴンを変換', () => {
        expect(CarTypeConv('heightWagon')).toBe('軽ハイトワゴン');
      });

      it('軽ハコバンを変換', () => {
        expect(CarTypeConv('boxVan')).toBe('軽ハコバン');
      });

      it('コンパクトカーを変換', () => {
        expect(CarTypeConv('compact')).toBe('コンパクトカー');
      });
    });

    describe('Mクラス車両', () => {
      it('カローラ フィルダーを変換', () => {
        expect(CarTypeConv('corollaFielder')).toBe('カローラ フィルダー');
      });

      it('トヨタ シエンタを変換', () => {
        expect(CarTypeConv('shienta')).toBe('トヨタ シエンタ');
      });

      it('プロボックスを変換', () => {
        expect(CarTypeConv('proBox')).toBe('プロボックス');
      });
    });

    describe('Lクラス車両', () => {
      it('NOAHを変換', () => {
        expect(CarTypeConv('noah')).toBe('NOAH');
      });

      it('NOAH・VOXY：80型を変換', () => {
        expect(CarTypeConv('noah_80')).toBe('NOAH・VOXY：80型');
      });

      it('NOAH・VOXY：90型を変換', () => {
        expect(CarTypeConv('noah_90')).toBe('NOAH・VOXY：90型');
      });

      it('タウンエースを変換', () => {
        expect(CarTypeConv('townAce')).toBe('タウンエース');
      });
    });

    describe('LLクラス車両', () => {
      it('レジアスエース標準ボディを変換', () => {
        expect(CarTypeConv('regiusaceAceBasic')).toBe('REGISTRYACEACE（標準ボディ）');
      });

      it('レジアスエースワイドボディを変換', () => {
        expect(CarTypeConv('regiusaceAceWide')).toBe('REGISTRYACEACE（ワイドボディ）');
      });
    });

    it('未定義の値は空文字を返す', () => {
      expect(CarTypeConv('unknown')).toBe('');
    });
  });

  describe('LocationConv - 納車・引取場所変換', () => {
    it('事務所を変換', () => {
      expect(LocationConv('office')).toBe('事務所');
    });

    it('自宅を変換', () => {
      expect(LocationConv('home')).toBe('自宅');
    });

    it('その他を変換', () => {
      expect(LocationConv('other')).toBe('その他');
    });

    it('未定義の値は空文字を返す', () => {
      expect(LocationConv('unknown')).toBe('');
    });
  });

  describe('ContactType - 連絡方法変換', () => {
    it('電話を変換', () => {
      expect(ContactType('tel')).toBe('電話');
    });

    it('メールを変換', () => {
      expect(ContactType('mail')).toBe('メール');
    });

    it('未定義の値は空文字を返す', () => {
      expect(ContactType('unknown')).toBe('');
    });
  });

  describe('SignalLightConv - ライト区分変換', () => {
    it('外照明を変換', () => {
      expect(SignalLightConv('outLight')).toBe('外照明');
    });

    it('内照明を変換', () => {
      expect(SignalLightConv('inLight')).toBe('内照明');
    });

    it('登壇を変換', () => {
      expect(SignalLightConv('topLight')).toBe('登壇');
    });

    it('未定義の値は空文字を返す', () => {
      expect(SignalLightConv('unknown')).toBe('');
    });
  });

  describe('SpeakerConv - スピーカー数変換', () => {
    it('2個を変換', () => {
      expect(SpeakerConv('twe')).toBe('2個');
    });

    it('4個を変換', () => {
      expect(SpeakerConv('four')).toBe('4個');
    });

    it('未定義の値は空文字を返す', () => {
      expect(SpeakerConv('unknown')).toBe('');
    });
  });

  describe('PriceTaxConv - 税込金額変換', () => {
    it('数値を税込金額フォーマットに変換', () => {
      expect(PriceTaxConv(10000)).toBe('¥ 10,000（税込）');
    });

    it('0円も正しく変換', () => {
      expect(PriceTaxConv(0)).toBe('¥ 0（税込）');
    });

    it('大きな金額をカンマ区切りで変換', () => {
      expect(PriceTaxConv(1234567)).toBe('¥ 1,234,567（税込）');
    });

    it('文字列の数値も変換（カンマなし）', () => {
      // 文字列の場合、toLocaleStringはカンマ区切りにならない
      expect(PriceTaxConv('5000')).toBe('¥ 5000（税込）');
    });

    it('空値は空文字を返す', () => {
      expect(PriceTaxConv('')).toBe('');
    });
  });

  describe('PriceConv - 金額変換', () => {
    it('数値を金額フォーマットに変換', () => {
      expect(PriceConv(10000)).toBe('¥ 10,000');
    });

    it('0円も正しく変換', () => {
      expect(PriceConv(0)).toBe('¥ 0');
    });

    it('大きな金額をカンマ区切りで変換', () => {
      expect(PriceConv(1234567)).toBe('¥ 1,234,567');
    });

    it('空値は空文字を返す', () => {
      expect(PriceConv('')).toBe('');
    });
  });

  describe('OptionConv - オプション追加変換', () => {
    it('trueは「追加する」を返す', () => {
      expect(OptionConv(true)).toBe('追加する');
    });

    it('falseは「追加しない」を返す', () => {
      expect(OptionConv(false)).toBe('追加しない');
    });
  });

  describe('WattConv - ワット単位追加', () => {
    it('値にWを追加', () => {
      expect(WattConv('300')).toBe('300W');
    });

    it('空値はfalsyを返す', () => {
      expect(WattConv('')).toBeFalsy();
    });
  });

  describe('PiecesConv - 個数単位追加', () => {
    it('数値に「個」を追加', () => {
      expect(PiecesConv(2)).toBe('2 個');
    });

    it('文字列にも対応', () => {
      expect(PiecesConv('3')).toBe('3 個');
    });

    it('0にも対応', () => {
      expect(PiecesConv(0)).toBeFalsy();
    });
  });

  describe('DayConv - 日数単位追加', () => {
    it('数値に「日」を追加', () => {
      expect(DayConv(5)).toBe('5 日');
    });

    it('文字列にも対応', () => {
      expect(DayConv('7')).toBe('7 日');
    });

    it('0はfalsyを返す', () => {
      expect(DayConv(0)).toBeFalsy();
    });
  });
});

/**
 * バリデーションルールのテスト
 * Yupスキーマによる入力値検証をテスト
 */
import { furigana, tel, mail, mailCheck, postCode } from '../../utils/validation';

describe('validation', () => {
  describe('furigana - フリガナバリデーション', () => {
    it('カタカナのみ許可', async () => {
      await expect(furigana.validate('タナカタロウ')).resolves.toBe('タナカタロウ');
    });

    it('全角カタカナと長音を許可', async () => {
      await expect(furigana.validate('スズキイチロー')).resolves.toBe('スズキイチロー');
    });

    it('全角スペースを許可', async () => {
      await expect(furigana.validate('ヤマダ　ハナコ')).resolves.toBe('ヤマダ　ハナコ');
    });

    it('ひらがなは拒否', async () => {
      await expect(furigana.validate('たなかたろう')).rejects.toThrow('カタカナで入力して下さい。');
    });

    it('漢字は拒否', async () => {
      await expect(furigana.validate('田中太郎')).rejects.toThrow('カタカナで入力して下さい。');
    });

    it('半角英数字は拒否', async () => {
      await expect(furigana.validate('Tanaka123')).rejects.toThrow('カタカナで入力して下さい。');
    });
  });

  describe('tel - 電話番号バリデーション', () => {
    it('ハイフンあり10桁を許可', async () => {
      await expect(tel.validate('03-1234-5678')).resolves.toBe('03-1234-5678');
    });

    it('ハイフンあり11桁を許可', async () => {
      await expect(tel.validate('090-1234-5678')).resolves.toBe('090-1234-5678');
    });

    it('ハイフンなし10桁を許可', async () => {
      await expect(tel.validate('0312345678')).resolves.toBe('0312345678');
    });

    it('ハイフンなし11桁を許可', async () => {
      await expect(tel.validate('09012345678')).resolves.toBe('09012345678');
    });

    it('空文字を許可', async () => {
      await expect(tel.validate('')).resolves.toBe('');
    });

    it('0以外で始まる番号は拒否', async () => {
      await expect(tel.validate('1234567890')).rejects.toThrow('電話番号の形式に誤りがあります');
    });

    it('文字混じりは拒否', async () => {
      await expect(tel.validate('090-abcd-5678')).rejects.toThrow('電話番号の形式に誤りがあります');
    });

    it('桁数不足は拒否', async () => {
      await expect(tel.validate('03-123')).rejects.toThrow('電話番号の形式に誤りがあります');
    });
  });

  describe('mail - メールアドレスバリデーション', () => {
    it('有効なメールアドレスを許可', async () => {
      await expect(mail.validate('test@example.com')).resolves.toBe('test@example.com');
    });

    it('サブドメイン付きを許可', async () => {
      await expect(mail.validate('user@mail.example.co.jp')).resolves.toBe('user@mail.example.co.jp');
    });

    it('大文字を小文字に変換', async () => {
      await expect(mail.validate('TEST@EXAMPLE.COM')).resolves.toBe('test@example.com');
    });

    it('@なしは拒否', async () => {
      await expect(mail.validate('testexample.com')).rejects.toThrow('正しいメールアドレスを入力してください。');
    });

    it('ドメインなしは拒否', async () => {
      await expect(mail.validate('test@')).rejects.toThrow('正しいメールアドレスを入力してください。');
    });
  });

  describe('mailCheck - メールアドレス確認バリデーション', () => {
    // mailCheckはオブジェクトスキーマ内で使用される相互参照バリデーション
    // 単体では親オブジェクトがないため、オブジェクトスキーマでテスト
    const mailSchema = require('yup').object({
      mail: mail.required(),
      mailCheck: mailCheck.required(),
    });

    it('一致するメールアドレスを許可', async () => {
      await expect(
        mailSchema.validate({ mail: 'test@example.com', mailCheck: 'test@example.com' })
      ).resolves.toEqual({ mail: 'test@example.com', mailCheck: 'test@example.com' });
    });

    it('大文字小文字を統一して比較', async () => {
      await expect(
        mailSchema.validate({ mail: 'test@example.com', mailCheck: 'TEST@EXAMPLE.COM' })
      ).resolves.toEqual({ mail: 'test@example.com', mailCheck: 'test@example.com' });
    });

    it('不一致のメールアドレスは拒否', async () => {
      await expect(
        mailSchema.validate({ mail: 'test@example.com', mailCheck: 'other@example.com' })
      ).rejects.toThrow('入力されたメールアドレスが一致しません。');
    });
  });

  describe('postCode - 郵便番号バリデーション', () => {
    it('ハイフンあり形式を許可', async () => {
      await expect(postCode.validate('123-4567')).resolves.toBe('123-4567');
    });

    it('ハイフンなし形式を許可', async () => {
      await expect(postCode.validate('1234567')).resolves.toBe('1234567');
    });

    it('空文字を許可', async () => {
      await expect(postCode.validate('')).resolves.toBe('');
    });

    it('桁数不足は拒否', async () => {
      await expect(postCode.validate('123-456')).rejects.toThrow('郵便番号の形式に誤りがあります');
    });

    it('文字混じりは拒否', async () => {
      await expect(postCode.validate('abc-defg')).rejects.toThrow('郵便番号の形式に誤りがあります');
    });

    it('桁数超過は拒否', async () => {
      await expect(postCode.validate('123-45678')).rejects.toThrow('郵便番号の形式に誤りがあります');
    });
  });
});

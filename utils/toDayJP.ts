// 今日の日付を西暦で返す
export const ToDayJP = () => {
  //今日の日付データを変数に格納
  const toDay = new Date();

  //年・月・日・曜日を取得する
  const year = toDay.getFullYear();
  const day = toDay.getDate();
  const month = toDay.getMonth() + 1;

  return year + "年" + month + "月" + day + "日 ";
};

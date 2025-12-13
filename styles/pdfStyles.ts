//
// PDFスタイルの定義
//

import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  //
  // 共通部品
  //

  // フォントサイズ
  fontSize10: {
    fontSize: 10,
  },
  fontSize15: {
    fontSize: 15,
  },
  fontSize20: {
    fontSize: 20,
  },

  // ボックス
  box: {
    padding: "0.5 1",
    border: "solid 3px #000000",
  },

  // アンダーライン
  underline1: {
    borderBottom: 1,

    marginTop: 10,
    marginBottom: 10,
  },
  underline5: {
    borderBottom: 5,

    // marginTop: 2,
    // marginBottom: 2,
  },

  //
  // ページ全体
  //
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
  },

  //
  // ヘッダー
  //
  header: {
    fontFamily: "Nasu-Bold",

    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  //
  // メイン
  //

  main: {
    fontFamily: "Nasu-Regular",

    padding: 10,
  },

  // ヘッダー
  tableCellHeader: {
    fontFamily: "Nasu-Bold",
    margin: 5,
    fontSize: 20,
    fontWeight: 500,
  },

  // セクション
  section: {
    fontFamily: "Nasu-Regular",
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

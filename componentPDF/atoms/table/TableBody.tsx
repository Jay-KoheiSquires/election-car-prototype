import React from "react";
import { StyleSheet, View } from "@react-pdf/renderer";

import { Grid } from "../grid";

//
// テーブルボディのレイアウト定義のみに徹する
// テーブルボディとはヘッダー以外の部分を指す
//

interface TableBodyProps {
  style?: {};
  children?: React.ReactNode;
}

export const TableBody = (props: TableBodyProps) => {
  const styles = StyleSheet.create({
    tableBody: {
      fontFamily: "Nasu-Regular",
      ...props.style,
    },
  });
  return <View style={styles.tableBody}>{props.children}</View>;
};

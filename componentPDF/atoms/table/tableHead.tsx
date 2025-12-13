import React from "react";
import { StyleSheet, View } from "@react-pdf/renderer";

import { Grid } from "../grid";

//
// テーブルヘッダーのレイアウト定義のみに徹する
//

interface TableHeadProps {
  style?: {};
  children?: React.ReactNode;
}

export const TableHead = (props: TableHeadProps) => {
  const styles = StyleSheet.create({
    tableHead: {
      fontFamily: "Nasu-Bold",
      backgroundColor: "#E4E4E4",
      ...props.style,
    },
  });
  return <View style={styles.tableHead}>{props.children}</View>;
};

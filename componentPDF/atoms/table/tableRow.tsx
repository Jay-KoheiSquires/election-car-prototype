import React from "react";
import { StyleSheet, View } from "@react-pdf/renderer";

import { Grid } from "../grid";

//
// テーブルの行部分を定義する
//

interface TableRowProps {
  flexDirection?: "column" | "row";
  style?: {};
  children?: React.ReactNode;
}

export const TableRow = (props: TableRowProps) => {
  const styles = StyleSheet.create({
    tableRow: {
      flexDirection: props.flexDirection || "row",

      ...props.style,
    },
  });
  return <View style={styles.tableRow}>{props.children}</View>;
};

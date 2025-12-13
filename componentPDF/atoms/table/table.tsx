import React from "react";
import { StyleSheet, View } from "@react-pdf/renderer";

import { Grid } from "../grid";

//
// テーブル全体のレイアウト定義のみに止める
//

interface TableProps {
  flexDirection?: "column" | "row";
  style?: {};
  children?: React.ReactNode;
}

export const Table = (props: TableProps) => {
  const styles = StyleSheet.create({
    table: {
      flexDirection: props.flexDirection || "column",
      borderCollapse: "separate",

      width: "100%",
      ...props.style,
    },
  });
  return <View style={styles.table}>{props.children}</View>;
};

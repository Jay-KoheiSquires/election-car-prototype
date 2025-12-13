import React from "react";
import { StyleSheet, Text } from "@react-pdf/renderer";

//
// テーブルの行部分を定義する
//

interface TableCellProps {
  border?: boolean;
  width?: string;
  backgroundColor?: string;
  style?: {};
  bold?: boolean;
  textAlign?: "center" | "left" | "right" | "justify";
  children?: React.ReactNode;
}

export const TableCell = (props: TableCellProps) => {
  const styles = StyleSheet.create({
    tableCell: {
      border: props.border === false ? 0 : 1,
      padding: 2,
      width: props.width || "100%",
      fontSize: 12,
      backgroundColor: props.backgroundColor,
      textAlign: props.textAlign || "center",
      fontFamily: props.bold ? "Nasu-Bold" : "Nasu-Regular",

      ...props.style,
    },
  });
  return <Text style={styles.tableCell}>{props.children}</Text>;
};

import React from "react";
import { StyleSheet, View } from "@react-pdf/renderer";

interface GridProps {
  flexDirection: "row" | "column";
  flex?: number;

  borderLeft?: boolean;
  borderRight?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;

  style?: {};
  children?: React.ReactNode;
}

export const Grid = (props: GridProps) => {
  const styles = StyleSheet.create({
    grid: {
      flexDirection: props.flexDirection || "row",
      flex: props.flex,
      borderLeftWidth: props.borderLeft ? 1 : 0,
      borderRightWidth: props.borderRight ? 1 : 0,
      borderTopWidth: props.borderTop ? 1 : 0,
      borderBottomWidth: props.borderBottom ? 1 : 0,
      ...props.style,
    },
  });

  return <View style={styles.grid}>{props.children}</View>;
};

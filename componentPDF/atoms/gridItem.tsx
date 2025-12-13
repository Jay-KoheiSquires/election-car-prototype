import React from "react";
import { StyleSheet, View } from "@react-pdf/renderer";

interface GridItemProps {
  flexGrow?: number;

  border?: boolean;
  borderLeft?: boolean;
  borderRight?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;

  style?: {};
  children?: React.ReactNode;
}

export const GridItem = (props: GridItemProps) => {
  const styles = StyleSheet.create({
    col: {
      // padding: 3,
      flexGrow: props.flexGrow || 1,

      border: props.border ? 1 : 0,
      borderLeftWidth: props.borderLeft ? 1 : 0,
      borderRightWidth: props.borderRight ? 1 : 0,
      borderTopWidth: props.borderTop ? 1 : 0,
      borderBottomWidth: props.borderBottom ? 1 : 0,
      ...props.style,
    },
  });

  return <View style={styles.col}>{props.children}</View>;
};

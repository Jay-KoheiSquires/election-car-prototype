import React from "react";
import { Text, StyleSheet } from "@react-pdf/renderer";

interface TextPops {
  size?: "large" | "normal" | "small";
  position?: "left" | "center" | "right";
  bold?: boolean;
  style?: {};
  children?: React.ReactNode;
}

export const SimpleText = (props: TextPops) => {
  const sizes = {
    large: 15,
    normal: 10,
    small: 6,
  };

  const position = {
    left: { marginRight: "auto" },
    center: { marginLeft: "auto", marginRight: "auto" },
    right: { marginLeft: "auto" },
  };

  const styles = StyleSheet.create({
    text: {
      fontSize: sizes[props.size || "normal"],
      fontFamily: props.bold ? "Nasu-Bold" : "Nasu-Regular",
      padding: 1,
      ...position[props.position || "left"],
      ...props.style,
    },
  });

  return <Text style={styles.text}>{props.children}</Text>;
};

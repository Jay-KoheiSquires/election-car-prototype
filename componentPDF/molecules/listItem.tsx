import React from "react";
import { GridItem } from "../atoms/gridItem";
import { SimpleText } from "../atoms/simpleText";
import { Grid } from "../atoms/grid";
import { Col } from "../atoms/col";

interface ListItemProps {
  flexDirection: "row" | "column";
  bold?: boolean;
  borderTop?: boolean;
  borderLeft?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  label?: string;
  children?: React.ReactNode;
}

export const ListItem = (props: ListItemProps) => (
  <Grid flexDirection={props.flexDirection}>
    <GridItem flexGrow={1}>
      <Col
        subTitle
        borderTop={props.borderTop}
        borderLeft={props.borderLeft}
        borderRight={props.borderRight}
        borderBottom={props.borderBottom}
        style={{
          width: "100%",
        }}
      >
        <SimpleText position={"center"} bold={props.bold}>
          {props.label}
        </SimpleText>
      </Col>
    </GridItem>
    <GridItem flexGrow={1}>
      <Col
        borderRight
        borderTop={props.borderTop}
        borderBottom={props.borderBottom}
        style={{
          width: "100%",
        }}
      >
        <SimpleText position={"right"} bold={props.bold}>
          {props.children}
        </SimpleText>
      </Col>
    </GridItem>
  </Grid>
);

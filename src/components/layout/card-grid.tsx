import type { HTMLAttributes } from "react";
import { Grid } from "./grid";

type Props = HTMLAttributes<HTMLDivElement> & { cols?: 2 | 3 | 4 };

export function CardGrid({ cols = 3, ...props }: Props) {
  return <Grid cols={cols} gap="md" {...props} />;
}

export function MetricGrid({ cols = 4, ...props }: Props) {
  return <Grid cols={cols} gap="none" {...props} className={props.className} />;
}

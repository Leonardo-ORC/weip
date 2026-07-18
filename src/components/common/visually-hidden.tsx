import { forwardRef, type HTMLAttributes } from "react";

export const VisuallyHidden = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ style, ...props }, ref) => (
    <span
      ref={ref}
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
        ...style,
      }}
      {...props}
    />
  ),
);
VisuallyHidden.displayName = "VisuallyHidden";

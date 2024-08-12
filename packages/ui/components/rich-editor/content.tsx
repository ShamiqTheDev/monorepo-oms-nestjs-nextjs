import { css } from "@atdb/design-system";
import { cn } from "@udecode/cn";
import { createBoldPlugin, createItalicPlugin, createUnderlinePlugin, createCodePlugin } from "@udecode/plate-basic-marks";
import { createPlugins } from "@udecode/plate-common";

export const plugins = createPlugins([
  createBoldPlugin({
    component: (props) => <strong {...props} className={cn(css({ fontWeight: "bold" }))} />,
  }),
  createItalicPlugin({
    component: (props) => <em {...props} className={cn(css({ fontStyle: "italic" }))} />,
  }),
  createUnderlinePlugin({
    component: (props) => <u {...props} className={cn(css({ textDecoration: "underline" }))} />,
  }),
  createCodePlugin({
    component: (props) => <code {...props} className={cn(css({ fontFamily: "monospace" }))} />,
  }),
]);

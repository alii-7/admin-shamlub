import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {},
  overrides: {}
});

export const defaultTheme = createMuiTheme();

Object.assign(defaultTheme, {
  overrides: {
    MUIRichTextEditor: {
      root: {
        border: "2px solid",
        borderRadius: theme.spacing(1),
        padding: theme.spacing(2),
        borderColor: "lightgrey"
      },
      editor: {
        borderBottom: "1px solid gray"
      }
    }
  }
});

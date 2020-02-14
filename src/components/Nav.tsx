import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Filter1Icon from "@material-ui/icons/Filter1";
import Filter2Icon from "@material-ui/icons/Filter2";
import Filter3Icon from "@material-ui/icons/Filter3";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import { useHistory } from "react-router-dom";
import { auth } from "firebase";

const DRAWER_WIDTH = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: DRAWER_WIDTH,
      flexShrink: 0
    }
  },
  drawerPaper: {
    width: DRAWER_WIDTH
  },
  toolbar: theme.mixins.toolbar
}));

interface NavProps {
  mobileOpen: boolean;
  handleDrawerToggle: any;
  tab: { key: string; value: string };
  setTab: any;
}

export const Nav: React.FC<NavProps> = ({
  tab,
  setTab,
  mobileOpen,
  handleDrawerToggle
}) => {
  const classes = useStyles();

  const theme = useTheme();

  let history = useHistory();

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        localStorage.clear();
        history.push("/");
      })
      .catch(error => {
        // An error happened.
        console.log("error signing out", error);
      });
  };

  const handleSelected = (index: number, value: string) => {
    localStorage.setItem(
      "tab",
      JSON.stringify({ key: index.toString(), value: value })
    );
    setTab({ key: index.toString(), value: value.toString() });
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {["ShamLub", "ShamOil", "Sham"].map((text, index) => (
          <ListItem
            onClick={() => handleSelected(index, text)}
            button
            key={text}
            selected={index === Number(tab.key) ? true : false}
          >
            <ListItemIcon>
              {index === 0 ? (
                <Filter1Icon />
              ) : index === 1 ? (
                <Filter2Icon />
              ) : index === 2 ? (
                <Filter3Icon />
              ) : (
                <ExitToAppIcon />
              )}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem button onClick={signOut} key={"Sign Out"}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary={"Sign Out"} />
      </ListItem>
    </div>
  );

  return (
    <nav className={classes.drawer}>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
};

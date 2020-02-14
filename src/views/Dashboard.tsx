import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import { ListProducts } from "../components/ListProducts";
import { AddProduct } from "../components/AddProduct";
import { Header } from "../components/Header";
import { Nav } from "../components/Nav";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

export const Dashboard: React.FC = () => {
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [tab, setTab] = useState<{ key: string; value: string }>(
    JSON.parse(
      localStorage.getItem("tab") ||
        JSON.stringify({ key: "1", value: "ShamLub" })
    )
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header tab={tab} handleDrawerToggle={handleDrawerToggle} />
      <Nav
        tab={tab}
        setTab={setTab}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {/* <ListProducts tab={tab} /> */}
        <AddProduct tab={tab} />
      </main>
    </div>
  );
};

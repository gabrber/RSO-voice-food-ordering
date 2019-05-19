import React, { useContext } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { GlobalContext } from "../../context/GlobalContext";

const useStyles = makeStyles({
  root: {
    color: "green"
  }
});

const Menu: React.FC = () => {
  const classes = useStyles();
  const [state, setState] = useContext(GlobalContext);

  return <Typography className={classes.root}>To jest {state}!</Typography>;
};

export default Menu;

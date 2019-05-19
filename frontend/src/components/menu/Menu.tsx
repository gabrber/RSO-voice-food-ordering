import React, { useContext, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { GlobalContext } from "../../context/GlobalContext";
import { addMenuItem } from "../../context/actions";

const useStyles = makeStyles({
  root: {
    color: "green"
  }
});

const Menu: React.FC = () => {
  const classes = useStyles();
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    dispatch(addMenuItem({ id: 1 }));
    return console.log(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Typography className={classes.root}>To jest kappa!</Typography>;
};

export default Menu;

import React, { useEffect } from "react";
import MaterialTable from "material-table";

import { makeStyles } from "@material-ui/styles";

import { setNewMenu } from "../../../context/actions";
import { PizzaModel } from "../../../context/models";
import { useGlobalContext } from "../../../context/GlobalContext";

const useStyles = makeStyles({
  tableRoot: {
    "& img": {
      height: "300px"
    }
  },
  ingredients: {
    "& p": {
      margin: 0
    }
  }
});

const columns = [
  {
    title: "Zdjęcie",
    field: "pizza_img",
    render: (rowData: PizzaModel) => (
      <img
        src={rowData.pizza_img}
        alt="pizza"
        style={{ width: "100px", borderRadius: "50%" }}
      />
    )
  },
  { title: "Pizza ID", field: "pizza_id", type: "numeric" },
  { title: "Nazwa", field: "name" },
  {
    title: "Cena mała",
    field: "price_small",
    type: "numeric"
  },
  {
    title: "Cena duża",
    field: "price_big",
    type: "numeric"
  },
  {
    title: "Składnki",
    field: "ingredients",
    render: (rowData: PizzaModel) => {
      return (
        <ul>
          {rowData.ingredients.map(ingredient => {
            return <li>{ingredient}</li>;
          })}
        </ul>
      );
    }
  }
];

const Menu: React.FC = () => {
  const classes = useStyles();
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    state.socket.emit("get_menu");
    state.socket.on("menu", (menu: PizzaModel[]) => {
      dispatch(setNewMenu(menu));
    });
    return () => {
      state.socket.off("menu");
    };
  }, [state.socket, dispatch]);

  return (
    <div>
      <MaterialTable
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const newMenu = state.menu.concat([
                  {
                    pizza_id: Number(newData.pizza_id) | 0,
                    name: String(newData.name),
                    pizza_img: String(newData.pizza_img),
                    ingredients: newData.ingredients
                      ? newData.ingredients.split(",")
                      : [],
                    price_small: Number(newData.price_small) | 0,
                    price_big: Number(newData.price_big) | 0
                  } as PizzaModel
                ]);
                state.socket.emit("new_menu", newMenu);
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                console.log(newData);
                console.log(oldData);
                const oldIndex = state.menu.indexOf(oldData);
                const newMenu = state.menu;
                newMenu[oldIndex] = newData;
                state.socket.emit("new_menu", newMenu);
                resolve();
              }, 1000);
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const oldIndex = state.menu.indexOf(oldData);
                const newMenu = state.menu;
                newMenu.splice(oldIndex, 1);
                state.socket.emit("new_menu", newMenu);
                resolve();
              }, 1000);
            })
        }}
        localization={{
          header: {
            actions: "Akcje"
          },
          body: {
            emptyDataSourceMessage: "Brak pozycji",
            deleteTooltip: "Usuń",
            addTooltip: "Dodaj",
            editTooltip: "Edytuj",
            editRow: {
              deleteText: "Czy na pewno chcesz usunąć pozycję?",
              cancelTooltip: "Nie",
              saveTooltip: "Tak"
            }
          }
        }}
        title="Menu"
        columns={columns}
        data={state.menu}
      />
    </div>
  );
};

export default Menu;

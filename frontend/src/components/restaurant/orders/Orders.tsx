import React from "react";
import { Select, MenuItem } from "@material-ui/core";
import { useGlobalContext } from "../../../context/GlobalContext";
import { OrdersModel } from "../../../context/models";
import MaterialTable from "material-table";

const Orders: React.FC = () => {
  const { state, dispatch } = useGlobalContext();

  const columns = [
    { title: "Order ID", field: "order_id" },
    {
      title: "Zamówienie",
      field: "orders",
      render: (rowData: OrdersModel) => {
        return (
          <ul>
            {rowData.orders.map(order => {
              return (
                <li>
                  {order.pizza_id} + {order.name} + {order.size}
                </li>
              );
            })}
          </ul>
        );
      }
    },
    {
      title: "Adres",
      field: "address",
      render: (rowData: OrdersModel) => {
        return (
          <div>
            {rowData.address.city}, {rowData.address.street}{" "}
            {rowData.address.building}
            {rowData.address.flat ? "/" + rowData.address.flat : ""}
          </div>
        );
      }
    },
    {
      title: "Status",
      field: "status",
      render: (rowData: OrdersModel) => {
        return (
          <Select
            style={{ width: "150px" }}
            value={rowData.status}
            onChange={event =>
              state.socket.emit("update_order", {
                order_id: rowData.order_id,
                status: event.target.value
              })
            }
          >
            <MenuItem value={"złożone"}>Złożone</MenuItem>
            <MenuItem value={"przyjęte"}>Przyjęte</MenuItem>
            <MenuItem value={"przygotowywanie"}>Przygotowywanie</MenuItem>
            <MenuItem value={"wysłane"}>Wysłane</MenuItem>
          </Select>
        );
      }
    }
  ];

  return (
    <MaterialTable
      title="Zamówienia"
      columns={columns}
      // data={state.orders}
      data={state.orders.filter(order => order.status !== "wysłane")}
      localization={{
        body: {
          emptyDataSourceMessage: "Brak pozycji"
        }
      }}
    />
  );
};

export default Orders;

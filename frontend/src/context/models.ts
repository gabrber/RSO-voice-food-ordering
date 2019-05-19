export interface PizzaModel {
  id: number;
  name?: string;
  price_small?: number;
  price_big?: number;
  ingredients?: [string];
  pizza_img?: string;
}

export interface MenuModel {
  menu: PizzaModel[];
}

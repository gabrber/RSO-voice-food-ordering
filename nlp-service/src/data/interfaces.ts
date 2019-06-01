interface PizzaJSON {
    menu_id: string
    name: string
    price_small: number
    price_big: number
    ingredients: string[]
    image_url: string
}

interface Order {
    orders: SizedPizza[]
    phone: string
    address: Address
}

interface Address {
    city: string
    street: string
    building: string
    flat: string
}

interface SizedPizza {
    pizza: string
    size: string
}

export { PizzaJSON, Order }
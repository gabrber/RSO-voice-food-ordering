interface MenuJSON {
    items: PizzaJSON[]
}

interface PizzaJSON {
    name: string
    priceSmall: number
    priceBig: number
    ingredients: string[]
    imageUrl: string
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

export { MenuJSON, PizzaJSON, Order }
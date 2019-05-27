import {Entity, ObjectID, ObjectIdColumn, Column, BaseEntity} from 'typeorm';

@Entity()
class PizzaEntity {

    @ObjectIdColumn()
    id?: ObjectID

    @Column()
    name: string

    @Column()
    priceSmall: number

    @Column()
    priceBig: number

    @Column()
    ingredients: string[]

    @Column()
    imageUrl: string
}

@Entity()
class MenuEntity {
    @ObjectIdColumn()
    id?: ObjectID

    // @Column()
    // remoteId: string

    @Column(type => PizzaEntity)
    items: PizzaEntity[]
}

export { PizzaEntity, MenuEntity }
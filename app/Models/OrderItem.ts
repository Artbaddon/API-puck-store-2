import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Order from './Order'
import CartItem from './CartItem'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public order_id: number

  @column()
  public quantity: number

  @column()
  public unit_price: number

  @column()
  public total_price: number

  @column()
  public cart_item_id: number

  @belongsTo(() => Order)
  public order: BelongsTo<typeof Order>

  @belongsTo(() => CartItem, {
    localKey: 'cart_item_id',
    foreignKey: 'id', 
  })
  public product: BelongsTo<typeof CartItem>
  

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

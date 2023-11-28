import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import WishlistItem from './WishlistItem'
import CartItem from './CartItem'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public price: number

  @column()
  public image: string

  @column()
  public category_id: number

  @belongsTo(() => Category, {
    localKey: 'id',
    foreignKey: 'category_id',
  })
  public category: BelongsTo<typeof Category>

  @hasMany(() => WishlistItem)
  public wishlistItems: HasMany<typeof WishlistItem>

  @hasMany(() => CartItem)
  public cartItems: HasMany<typeof CartItem>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /* Methods */

  public static storeProduct = async (data: storeProductType, trx: TransactionClientContract) => {
    const product = await this.create(
      {
        name: data.name,
        description: data.name,
        price: data.price,
        image: data.image,
        category_id: data.category_id,
      },
      { client: trx }
    )
    return product
  }

  public static updateProduct = async (data: updateProductType, trx: TransactionClientContract) => {
    let product = await this.query({ client: trx }).where('id', data.id).first()
    if (!product) {
      return Promise.reject(new Error('Product Not Found'))
    }
    if (data.name) {
      product.name = data.name
    }
    if (data.description) {
      product.description = data.description
    }
    if (data.price) {
      product.price = data.price
    }
    if (data.image) {
      product.image = data.image
    }

    if (data.category_id) {
      product.category_id = data.category_id
    }
    await product.save()
    return product
  }
}

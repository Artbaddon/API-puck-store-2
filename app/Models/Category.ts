import { DateTime } from 'luxon'
import { BaseModel, hasMany, HasMany, column } from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public category_img: string

  @hasMany(() => Product, {
    foreignKey: 'category_id',
    localKey: 'id',
  })
  public products: HasMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**Methods */
  public static storeCategory = async (data: storeCategoryType, trx: TransactionClientContract) => {
    const category = await this.create(
      {
        name: data.name,
        description: data.description,
        category_img: data.category_image,
      },
      { client: trx }
    )
    return category
  }

  public static updateCategory = async (
    data: updateCategoryType,
    trx: TransactionClientContract
  ) => {
    let category = await this.query({ client: trx }).where('id', data.id).first()
    if (!category) {
      return Promise.reject(new Error('Category Not Found'))
    }
    if (data.name) {
      category.name = data.name
    }
    if (data.description) {
      category.description = data.description
    }
    if (data.category_img) {
      category.category_img = data.category_img
    }

    await category.save()

    return category
  }
}

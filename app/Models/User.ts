import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  column,
  beforeSave,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import Address from './Address'
import WishlistItem from './WishlistItem'
import CartItem from './CartItem'
import Order from './Order'
import Database from '@ioc:Adonis/Lucid/Database'
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public is_admin: boolean
  
  @hasOne(() => Profile, {
    localKey: 'id',
    foreignKey: 'user_id',
  })
  public profile: HasOne<typeof Profile>

  @hasMany(() => Address, {
    localKey: 'id',
    foreignKey: 'user_id',
  })
  public addresses: HasMany<typeof Address>

  @hasMany(() => WishlistItem, {
    localKey: 'id',
    foreignKey: 'user_id',
  })
  public wishlist_items: HasMany<typeof WishlistItem>

  @hasMany(() => CartItem, {
    localKey: 'id',
    foreignKey: 'user_id',
  })
  public cart_items: HasMany<typeof CartItem>

  @hasMany(() => Order, {
    localKey: 'id',
    foreignKey: 'user_id',
  })
  public orders: HasMany<typeof Order>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  /**Methods  */

  public static createUser = async (data: createUserType) => {
    const trx = await Database.transaction()

    try {
      const existingUser = await this.findBy('email', data.email, { client: trx })

      if (existingUser) {
        await trx.rollback()
        throw new Error('User with this email already exists')
      }

      const createdUser = await User.create(
        { email: data.email, password: data.password },
        { client: trx }
      )

      await Profile.createProfile(
        {
          first_name: data.first_name,
          last_name: data.last_name,
          user_id: createdUser.id,
        },
        trx
      )

      await trx.commit()

      return createdUser
    } catch (error) {
      await trx.rollback()
      console.error(error)
      throw new Error('Failed to create user')
    }
  }
}

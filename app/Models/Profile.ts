import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public profile_picture: string | null

  @column()
  public user_id: number

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static createProfile = async (
    data: updateOrCreateProfileType,
    trx: TransactionClientContract
  ) => {
    await this.create(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        user_id: data.user_id,
      },
      { client: trx }
    )
    return 'Profile Created'
  }
  public static getProfileById = async (id: number) => {
    const profile = await this.query()
      .where('id', id)
      .preload('user', (userQuery) => {
        userQuery.preload('addresses'),
          userQuery.preload('orders'),
          userQuery.preload('cart_items'),
          userQuery.preload('wishlist_items')
      })
      .firstOrFail()
    return profile
  }

  public static updateProfile = async (data: updateProfileType, trx: TransactionClientContract) => {
    const { id, first_name, last_name, password, profile_picture } = data

    const profile = await this.query({ client: trx }).where('id', id).preload('user').firstOrFail()
    if (password) {
      profile.user.password = password
    }
    if (first_name) {
      profile.first_name = first_name
    }
    if (last_name) {
      profile.last_name = last_name
    }
   
    if (profile_picture) {
      profile.profile_picture = profile_picture
  
    }
    await profile.save()
    return profile
  }
}

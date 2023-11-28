import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import WishlistItem from 'App/Models/WishlistItem'

export default class WishlistItemPolicy extends BasePolicy {
  public async update(user: User, wishList: WishlistItem) {
    return user.id === wishList.user_id
  }
  public async delete(user: User, wishList: WishlistItem) {
    return user.id === wishList.user_id
  }
}

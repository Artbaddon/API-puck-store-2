import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import CartItem from 'App/Models/CartItem'

export default class CartItemPolicy extends BasePolicy {
  public async update(user: User, cartItem: CartItem) {
    return user.id === cartItem.user_id
  }
  public async delete(user: User, cartItem: CartItem) {
    return user.id === cartItem.user_id
  }
}

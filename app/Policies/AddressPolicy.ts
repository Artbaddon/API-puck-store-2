import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Address from 'App/Models/Address'

export default class AddressPolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user && user.is_admin) {
      return true
    }
  }
  public async update(user: User, address: Address) {
    return address.user_id === user.id
  }
  public async delete(user: User, address: Address) {
    return address.user_id === user.id
  }
}

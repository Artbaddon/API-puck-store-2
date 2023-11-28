import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'


export default class AdminPolicy extends BasePolicy {
  public async create(user: User) {
    if (user && user.is_admin) {
      return true
    }
  }
  public async update(user: User) {
    if (user && user.is_admin) {
      return true
    }
  }
  public async delete(user: User) {
	if (user && user.is_admin) {
		return true
	  }
  }
}

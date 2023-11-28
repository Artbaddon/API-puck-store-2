import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'

export default class ProfilePolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user && user.is_admin) {
      return true
    }
  }
  public async viewList(user: User, profile: Profile) {
     
    return profile.user_id === user.id
  }

  public async update(user: User, profile: Profile) {
    return profile.user_id === user.id
  }
}

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import ProfileUpdateValidator from 'App/Validators/ProfileUpdateValidator'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import path from 'path'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'

export default class ProfilesController {
  public show = async ({ params,bouncer, response }: HttpContextContract) => {
    const { id } = params
  
    try {
      
      const fetched_profile = await Profile.getProfileById(id)
  
      try {
        await bouncer.with('ProfilePolicy').authorize('viewList', fetched_profile)
      } catch (error) {
        console.log('error')
        return response.status(403).json({ error: error.message})
      }
      return fetched_profile
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }

  public update = async ({ auth, params, request, response,bouncer }: HttpContextContract) => {
    const { id } = params
    const payload = await request.validate(ProfileUpdateValidator)

    let profile: Profile
    try {
      profile = await Profile.findOrFail(id)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Profile Not Found' })
    }
    try {
      await bouncer.with('ProfilePolicy').authorize('update', profile)
    } catch (error) {
      console.log('error')
      return response.status(403).json({ error: error.message})
    }
    let user_dir = String(auth.user!.id)
    let profile_picture = ''
    let new_image_name = ''

    if (payload.profile_picture) {
      new_image_name = `${cuid()}.${payload.profile_picture.extname}`
      profile_picture = path.posix.join(user_dir.toString(), new_image_name)
    }
    
    const trx = await Database.transaction()
   
    try {
      const updated_profile = await Profile.updateProfile(
        {
          id,
          first_name: payload.first_name,
          last_name: payload.last_name,
          password: payload.password,
          profile_picture: this.generateImageUrl(profile_picture),
        },
        trx
      )

      if (payload.profile_picture) {
        await payload.profile_picture.moveToDisk(
          user_dir,
          { name: new_image_name },
          Env.get('DRIVE_DISK')
        )
        if (profile.profile_picture) {
          let img = profile.profile_picture
          let img_path = img.replace('http://localhost:3333/uploads/', '')
          await Drive.delete(img_path)
        }
      }
      await trx.commit()
      return updated_profile
    } catch (error) {
      await trx.rollback()
      //deleting uploaded image in case of query fails or image deletion fails
      const uploaded = await Drive.exists(profile_picture)
      if (uploaded) {
        const pic_path = profile.profile_picture!.replace('http://127.0.0.1:3333/uploads/', '')
        await Drive.delete(pic_path)
      }
      return response.status(500).json({ error: error.message })
    }
  }
  private generateImageUrl(imageName: string) {
    return `http://localhost:3333/uploads/${imageName}`
  }
}

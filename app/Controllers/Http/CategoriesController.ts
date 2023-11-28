import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CategoryCreateValidator from 'App/Validators/CategoryCreateValidator'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import path from 'path'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import Category from 'App/Models/Category'
import CategoryUpdateValidator from 'App/Validators/CategoryUpdateValidator'
import Drive from '@ioc:Adonis/Core/Drive'

export default class CategoriesController {
  public index = async ({}: HttpContextContract) => {
    const categories = await Category.all()
    return categories
  }

  public show = async ({ params }: HttpContextContract) => {
    const category = await Category.find(params.id)
    if (category) {
      return category
    }
  }

  public store = async ({ request, auth, response, bouncer }: HttpContextContract) => {
    // Pass the form data to the validator
    const payload = await request.validate(CategoryCreateValidator)

    const user_dir = String(auth.user!.id)
    const new_image_name = `${cuid()}.${payload.category_img.extname}`
    const category_image = path.posix.join(user_dir.toString(), new_image_name)
    try {
      await bouncer.with('AdminPolicy').authorize('create')
    } catch (error) {
      console.log('error')
      return response.status(403).json({ error: error.message })
    }
    const trx = await Database.transaction()

    try {
      const existingCategory = await Category.findBy('name', payload.name, { client: trx })
      if (existingCategory) {
        await trx.rollback()
        throw new Error('Category with this name already exists')
      }

      const category = await Category.storeCategory(
        {
          name: payload.name,
          description: payload.description,
          category_image: this.generateImageUrl(category_image),
        },
        trx
      )
      await payload.category_img.moveToDisk(
        user_dir,
        { name: new_image_name },
        Env.get('DRIVE_DISK')
      )
      await trx.commit()
      return category
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }

  public update = async ({ params, auth, response, request, bouncer }: HttpContextContract) => {
    const { id } = params
    const payload = await request.validate(CategoryUpdateValidator)
    const user_dir = String(auth.user!.id)
    let category: Category
    try {
      await bouncer.with('AdminPolicy').authorize('update')
    } catch (error) {
      console.log('error')
      return response.status(403).json({ error: error.message })
    }
    try {
      category = await Category.findOrFail(id)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }

    const trx = await Database.transaction()

    try {
      let category_image = category.category_img
      let new_image_name = ''

      if (payload.category_img) {
        new_image_name = `${cuid()}.${payload.category_img.extname}`
        category_image = path.posix.join(user_dir.toString(), new_image_name)
      }

      const updatedData = {
        name: payload.name,
        description: payload.description,
        category_img: this.generateImageUrl(category_image),
      }

      const updatedCategory = await Category.updateCategory({ id, ...updatedData }, trx)

      if (payload.category_img) {
        // If a new image is uploaded, update the image and delete the previous one
        await payload.category_img.moveToDisk(
          user_dir,
          { name: new_image_name },
          Env.get('DRIVE_DISK')
        )

        if (category.category_img) {
          // Delete the previous image associated with the category
          let img = category.category_img
          let img_path = img.replace('http://localhost:3333/uploads/', '')
          console.log(img_path)
          await Drive.delete(img_path)
        }
      }

      await trx.commit()
      return updatedCategory
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }

  public destroy = async ({ params, response, bouncer }: HttpContextContract) => {
    const { id } = params
    try {
      await bouncer.with('AdminPolicy').authorize('delete')
    } catch (error) {
      console.log('error')
      return response.status(403).json({ error: error.message })
    }
    const trx = await Database.transaction()

    let category: Category

    try {
      category = await Category.findOrFail(id, { client: trx })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
    try {
      await category.delete()
      let img = category.category_img
      let img_path = img.replace('http://localhost:3333/uploads/', '')
      console.log(img_path)
      await Drive.delete(img_path)
      await trx.commit()
      return response.status(200).json({ success: 'Category Deleted' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }
  private generateImageUrl(imageName: string) {
    return `http://localhost:3333/uploads/${imageName}`
  }
}

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import ProductStoreValidator from 'App/Validators/ProductStoreValidator'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import path from 'path'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'
import Category from 'App/Models/Category'
import ProductUpdateValidator from 'App/Validators/ProductUpdateValidator'

export default class ProductsController {
  public index = async ({}: HttpContextContract) => {
    const products = await Product.query().preload('category')
    return products
  }

  public show = async ({ params }: HttpContextContract) => {
    const product = await Product.find(params.id)
    if (product) {
      return product
    }
  }
  public store = async ({ auth, response, request, bouncer }: HttpContextContract) => {
    const payload = await request.validate(ProductStoreValidator)
    try {
      await bouncer.with('AdminPolicy').authorize('create')
    } catch (error) {
      console.log('error')
      return response.status(403).json({ error: error.message })
    }
    const user_dir = String(auth.user!.id)

    const new_image_name = `${cuid()}.${payload.image.extname}`
    const product_img = path.posix.join(user_dir.toString(), new_image_name)

    const trx = await Database.transaction()
    try {
      const existingProduct = await Product.findBy('name', payload.name)
      const existingCategory = await Category.findBy('id', payload.category_id)
      if (existingProduct) {
        await trx.rollback()
        throw new Error('Product with this name already exists')
      } else if (!existingCategory) {
        await trx.rollback()
        throw new Error('Category with this name does not exists')
      }

      const product = await Product.storeProduct(
        {
          name: payload.name,
          category_id: payload.category_id,
          image: this.generateImageUrl(product_img),
          price: payload.price,
          description: payload.description,
        },
        trx
      )
      await payload.image.moveToDisk(user_dir, { name: new_image_name }, Env.get('DRIVE_DISK'))

      await trx.commit()
      return response.ok(product)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }
  public update = async ({ params, request, response, bouncer, auth }: HttpContextContract) => {
    const { id } = params
    const payload = await request.validate(ProductUpdateValidator)
    let product: Product

    const user_dir = String(auth.user!.id)
    let product_image = ''
    let new_image_name = ''
    try {
      await bouncer.with('AdminPolicy').authorize('update')
    } catch (error) {
      console.log('error')
      return response.status(403).json({ error: error.message })
    }

    try {
      product = await Product.findOrFail(id)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
    if (payload.image) {
      new_image_name = `${cuid()}.${payload.image.extname}`
      product_image = path.posix.join(user_dir.toString(), new_image_name)
    }

    const trx = await Database.transaction()

    try {
      const updated_product = await Product.updateProduct(
        {
          id,
          name: payload.name,
          description: payload.description,
          image: this.generateImageUrl(product_image),
          price: payload.price,
          category_id: payload.category_id,
        },
        trx
      )
      if (payload.image) {
        await payload.image.moveToDisk(user_dir, { name: new_image_name }, Env.get('DRIVE_DISK'))
        if (product.image) {
          let img = product.image
          let img_path = img.replace('http://localhost:3333/uploads/', '')
          console.log(img_path)
          await Drive.delete(img_path)
        }
      }

      await trx.commit()
      return updated_product
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
    let product: Product
    try {
      product = await Product.findOrFail(id, { client: trx })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
    try {
      await product.delete()
      let img = product.image
      let img_path = img.replace('http://localhost:3333/uploads/', '')
      console.log(img_path)
      await Drive.delete(img_path)
      await trx.commit()
      return response.status(200).json({ success: 'Product Deleted' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }
  private generateImageUrl(imageName: string) {
    return `http://localhost:3333/uploads/${imageName}`
  }
}

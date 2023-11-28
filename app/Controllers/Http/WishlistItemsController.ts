import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WishlistItem from 'App/Models/WishlistItem'
import Database from '@ioc:Adonis/Lucid/Database'
import Product from 'App/Models/Product'

export default class WishlistItemsController {
  public index = async ({ auth }: HttpContextContract) => {
    const wishlist_items = WishlistItem.query().where('user_id', auth.user!.id).preload('product')
    return wishlist_items
  }
  public store = async ({ request, response, auth }: HttpContextContract) => {
    const product_id = request.input('product_id')
    const user_id = auth.user!.id
    const trx = await Database.transaction()
    try {
      const exisitingProduct = await Product.find(product_id)
      if (!exisitingProduct) {
        await trx.rollback()
        throw new Error('Product with this id does not exists')
      }
      const exisitingProductinWishlist = await WishlistItem.findBy('product_id', product_id)
      if(exisitingProductinWishlist){
        await trx.rollback()
        throw new Error('Product already exists in wishlist')

      }
      const wishlist_item = await WishlistItem.create(
        {
          user_id: user_id,
          product_id: product_id,
        },
        trx
      )
      await trx.commit()
      return response.ok(wishlist_item)
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }

  public destroy = async ({ params, response,bouncer }: HttpContextContract) => {
    const { id } = params
    const trx = await Database.transaction()
    let wishlist_item: WishlistItem
    try {
      wishlist_item = await WishlistItem.findOrFail(id, { client: trx })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
    try {
      await bouncer.with('WishlistItemPolicy').authorize('delete', wishlist_item)
    } catch (error) {
      console.log('error')
      return response.status(403).json({ error: error.message })
    }
    try {
      await wishlist_item.delete()
      await trx.commit()
      return response.status(200).json({ success: 'Product  Deleted' })
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }
}

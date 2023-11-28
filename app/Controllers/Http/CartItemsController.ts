import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import CartItem from 'App/Models/CartItem'
import Product from 'App/Models/Product'
import CartItemStoreValidator from 'App/Validators/CartItemStoreValidator'
import CartItemUpdateValidator from 'App/Validators/CartItemUpdateValidator'

export default class CartItemsController {
  public index = async ({ auth }: HttpContextContract) => {
    const user_id = auth.user!.id
    const cart_items = CartItem.query().where('user_id', user_id).preload('product')
    return cart_items
  }
  public store = async ({ request, auth, response }: HttpContextContract) => {
    const payload = await request.validate(CartItemStoreValidator)

    const product_id = payload.product_id

    const user_id = auth.user!.id

    const trx = await Database.transaction()

    try {
      let cart_item = await CartItem.query()
        .where('user_id', user_id)
        .where('product_id', product_id)
        .first()

      const existingProduct = await Product.find(product_id)
      if (!existingProduct) {
        await trx.rollback()
        throw new Error('Product with this id does not exist')
      }
      const price = existingProduct.price

      if (cart_item) {
        // If the product already exists in the cart, update the quantity
        cart_item.quantity += payload.quantity
        await cart_item.save()
      } else {
        // If the product is not in the cart, create a new cart item
        cart_item = await CartItem.create({
          user_id: user_id,
          product_id: product_id,
          quantity: payload.quantity,
          price: price,
        })
      }
      await trx.commit()
      return cart_item
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }
  public update = async ({ params, response, request, bouncer }: HttpContextContract) => {
    const { id } = params
    const payload = await request.validate(CartItemUpdateValidator)

    let cart_item: CartItem

    const trx = await Database.transaction()

    try {
      cart_item = await CartItem.findOrFail(id)
      try {
        await bouncer.with('CartItemPolicy').authorize('update', cart_item)
      } catch (error) {
        console.log('error')
        return response.status(403).json({ error: error.message })
      }
      if (typeof payload.quantity !== 'undefined') {
        cart_item.quantity = payload.quantity // Update the quantity
      } else {
        // Handle the case where payload.quantity is undefined
        throw new Error('Quantity is missing or invalid')
      }
      cart_item.quantity = payload.quantity // Update the quantity
      await cart_item.save()

      await trx.commit()
      return cart_item
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }
  public destroy = async ({ params, response,bouncer }: HttpContextContract) => {
    const { id } = params
    const trx = await Database.transaction()
    let cart_item: CartItem
    try {
      cart_item = await CartItem.findOrFail(id, { client: trx })

    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
    try {
      await bouncer.with('CartItemPolicy').authorize('delete', cart_item)
    } catch (error) {
      console.log('error')
      return response.status(403).json({ error: error.message })
    }
    try {
      await cart_item.delete()
      await trx.commit()
      return response.status(200).json({ success: 'Product  Deleted from the cart' })
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }
}

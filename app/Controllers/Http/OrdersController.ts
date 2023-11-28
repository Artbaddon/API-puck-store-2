import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CartItem from 'App/Models/CartItem'
import Database from '@ioc:Adonis/Lucid/Database'
import Order from 'App/Models/Order'
import OrderItem from 'App/Models/OrderItem'
import User from 'App/Models/User'

export default class OrdersController {
  public index = async ({ auth }: HttpContextContract) => {
    try {
      const user_id = auth.user!.id
      const orders = await User.query().where('id', user_id).preload('orders')
      return orders
    } catch (error) {}
  }
  public store = async ({ auth, response }: HttpContextContract) => {
    const user_id = auth.user!.id

    const trx = await Database.transaction()
    try {
      let cart_items = await CartItem.query().where('user_id', user_id)
      if (cart_items.length == 0) {
        await trx.rollback()
        throw new Error('Your Cart is empty')
      }
      let total_price = 0
      let total_amount = 0

      cart_items.forEach((item) => {
        const { price, quantity } = item
        total_amount += price * quantity
      })

      console.log(total_price)
      const order = await Order.create(
        {
          user_id: user_id,
          total_amount: total_amount,
        },
        { client: trx }
      )
      for (const cart_item of cart_items) {
        const { price, quantity } = cart_item

        total_price += price * quantity

        await OrderItem.create(
          {
            order_id: order.id,
            cart_item_id: cart_item.id,
            quantity: quantity,
            total_price: total_price,
            unit_price: price,
          },
          { client: trx }
        )
      }

      await trx.commit()

      await CartItem.query().delete().where('user_id', user_id)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }
}

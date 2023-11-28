import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import User from 'App/Models/User'
import AddressCreateValidator from 'App/Validators/AddressCreateValidator'
import AddressUpdateValidator from 'App/Validators/AddressUpdateValidator'

export default class AddressesController {
  public index = async ({ auth, response }: HttpContextContract) => {
    const user_id = auth.user!.id
    try {
      const addresses = await User.query().where('user_id', user_id).preload('addresses')
      return addresses
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }

  public store = async ({ auth, request, response }: HttpContextContract) => {
    const user_id = auth.user!.id
    const payload = await request.validate(AddressCreateValidator)
    const trx = await Database.transaction()

    try {
      const existingAddress = await Address.findBy('address_line_1', payload.address_line_1)
      if (existingAddress) {
        await trx.rollback()
        throw new Error('Address already exist')
      }
      const address = await Address.create({
        address_line_1: payload.address_line_1,
        address_line_2: payload.address_line_2,
        city: payload.city,
        user_id: user_id,
      })

      return address
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }
  public update = async ({ params, request, response, bouncer }: HttpContextContract) => {
    const { id } = params
    const payload = await request.validate(AddressUpdateValidator)
    const trx = await Database.transaction()
    try {
      try {
        const address = await Address.find(id)

        if (!address) {
          await trx.rollback()
          throw new Error('Address does not exist')
        }
        try {
          await bouncer.with('AddressPolicy').authorize('update', address)
        } catch (error) {
          console.log('error')
          return response.status(403).json({ error: error.message })
        }

        if (payload.address_line_1) {
          address.address_line_1 = payload.address_line_1
        }
        if (payload.address_line_2) {
          address.address_line_2 = payload.address_line_2
        }
        if (payload.city) {
          address.city = payload.city
        }
        address.save()
        await trx.commit()

        return address
      } catch (error) {}
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }
  public destroy = async ({ params, response, bouncer }: HttpContextContract) => {
    const { id } = params
    const trx = await Database.transaction()
    try {
      const existingAddress = await Address.find(id)

      if (!existingAddress) {
        await trx.rollback()
        throw new Error('Address does not exist')
      }
      try {
        await bouncer.with('AddressPolicy').authorize('update', existingAddress)
      } catch (error) {
        console.log('error')
        return response.status(403).json({ error: error.message })
      }
      await existingAddress.delete()

      await trx.commit()
      return response.status(200).json({ success: 'Address Deleted' })
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }
}

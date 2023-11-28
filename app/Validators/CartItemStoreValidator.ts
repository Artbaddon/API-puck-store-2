import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CartItemStoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    product_id: schema.number([rules.required()]),
    quantity: schema.number([rules.required(), rules.unsigned()]),
  })
  public messages: CustomMessages = {
    'required': 'the field {{ field }} is required',
  }
}

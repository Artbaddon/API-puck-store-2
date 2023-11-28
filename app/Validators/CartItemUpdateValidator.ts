import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CartItemUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    quantity: schema.number.optional([rules.unsigned()]),
  })
  public messages: CustomMessages = {}
}

import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AddressUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    address_line_1: schema.string.optional([
      rules.trim(),
      rules.maxLength(255),
      rules.minLength(3),
    ]),
    address_line_2: schema.string.optional([
      rules.trim(),
      rules.maxLength(255),
      rules.minLength(3),
    ]),
    city: schema.string.optional([rules.trim(), rules.maxLength(255), rules.minLength(3)]),
  })

  public messages: CustomMessages = {
    maxLength: 'The {{ field }} can not larger than 255 characters',
    minLength: 'The {{field}} can not be shorter than 3 characters',
  }
}

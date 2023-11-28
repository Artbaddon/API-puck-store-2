import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProductUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name: schema.string.optional([rules.alpha({ allow: ['space'] }), rules.trim(), rules.maxLength(50)]),
    price: schema.number.optional([rules.unsigned()]),
    category_id: schema.number.optional([rules.unsigned()]),
    description: schema.string.optional([rules.trim(), rules.maxLength(400), rules.trim()]),
    image: schema.file.optional({
      size: '5mb',
      extnames: ['jpg', 'png'],
    }),
  })

  public messages: CustomMessages = {
    'name.maxLength': 'Name can not be more than 50 characters',

    'description.maxLength': 'Description can not be more than 400 characters',

    'image.size': 'Image size should not be greater than 5mb',

    'image.extnames': 'Image should be jpg or png only',
  }
}

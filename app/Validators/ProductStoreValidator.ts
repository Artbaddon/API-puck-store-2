import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProductStoreValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name: schema.string([
      rules.alpha({ allow: ['space'] }),
      rules.required(),
      rules.trim(),
      rules.maxLength(50),
    ]),
    price: schema.number([rules.required(), rules.unsigned()]),
    category_id: schema.number([rules.required(), rules.unsigned()]),
    description: schema.string([
      rules.trim(),
      rules.required(),
      rules.maxLength(400),
      rules.trim(),
    ]),
    image: schema.file(
      {
        size: '5mb',
        extnames: ['jpg', 'png'],
      },
      [rules.required()]
    ),
  })

  public messages: CustomMessages = {
    'name.maxLength': 'Name can not be more than 50 characters',
    'required': 'The field {{field}} is required',

    'description.maxLength': 'Description can not be more than 400 characters',

    'image.file': 'Please provide a valid image',

    'image.size': 'Image size should not be greater than 5mb',
    'image.extnames': 'Image should be jpg or png only',
  }
}

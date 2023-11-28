import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional([rules.maxLength(50), rules.trim()]),
    description: schema.string.optional([rules.maxLength(400), rules.trim()]),
    category_img: schema.file.optional({
      size: '5mb',
      extnames: ['jpg', 'png'],
    }),
  })

  public messages: CustomMessages = {
    'name.maxLength': 'Name can not be more than 50 characters',

    'description.maxLength': 'Description can not be more than 400 characters',

    'category_img.file': 'Please provide a valid image',

    'category_img.size': 'Image size should not be greater than 5mb',
    'category_img.extnames': 'Image should be jpg or png only',
  }
}

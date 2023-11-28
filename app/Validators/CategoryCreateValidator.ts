import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string([rules.required(), rules.maxLength(50), rules.trim()]),
    description: schema.string([rules.required(), rules.maxLength(400), rules.trim()]),
    category_img: schema.file(
      {
        size: '5mb',
        extnames: ['jpg', 'png'],
      },
      [rules.required()]
    ),
  })

  public messages: CustomMessages = {
    'required': '{{field}} is required',
    'name.maxLength': 'Title can not be more than 50 characters',
    'description.maxLength': 'Description can not be more than 400 characters',
    'category_img.file': 'Please provide a valid image',
    'category_img.size': 'Image size should not be greater than 5mb',
    'category_img.extnames': 'Image should be jpg or png only',
  }
}

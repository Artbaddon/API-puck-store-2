import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProfileUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    first_name: schema.string.optional([
      rules.alpha({ allow: ['space'] }),
      rules.trim(),
      rules.minLength(3),
      rules.maxLength(50),
    ]),
    last_name: schema.string.optional([
      rules.alpha({ allow: ['space'] }),
      rules.trim(),
      rules.minLength(3),
      rules.maxLength(50),
    ]),
    profile_picture: schema.file.optional({
      size: '5mb',
      extnames: ['jpg', 'png','jpeg'],
    }),
    password: schema.string.optional([rules.trim(), rules.minLength(8)]),
  })

  public messages: CustomMessages = {
    'maxLength': '{{ field }} can not be larger than 50 characters',

    'minLength': '{{ field }} can not be larger than 50 characters',

    'password.minLength': 'Password has to be more tan 8 characters',

    'profile_picture.size': 'Profile picture size should not be greater than 5mb',

    'profile_picture.extnames': 'Profile picture should be jpg or png only',
  }
}

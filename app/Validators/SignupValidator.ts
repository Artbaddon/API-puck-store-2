import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SignupValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    first_name: schema.string([
      rules.required(),
      rules.maxLength(50),
      rules.trim(),
      rules.alpha({
        allow: ['space'],
      }),
      rules.minLength(3),
    ]),
    last_name: schema.string([
      rules.required(),
      rules.maxLength(50),
      rules.trim(),
      rules.alpha({
        allow: ['space'],
      }),
      rules.minLength(3),
    ]),
    email: schema.string([rules.required(), rules.email(), rules.trim()]),
    password: schema.string([rules.required(), rules.minLength(8)]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'required': 'The {{ field }} is required',
    'alpha': 'The {{ field }} must contain letters only',
    'first_name.maxLength': 'First name should be maximum 50 characters long',
    'first_name.minLength': 'First name should be minimum 4 characters long',

    'last_name.maxLength': 'Last name should be maximum 50 characters long',
    'last_name.minLength': 'Last name should be minimum 4 characters long',

    'email.email': 'Email should be a valid email address',

    'password.minLength': 'Password should be at least 8 characters long',
  }
}

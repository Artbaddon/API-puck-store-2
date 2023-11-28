import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IsAdmin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user

    if (!user || !user.is_admin) {
      return response.status(403).json({ error: 'Unauthorized - Admin access required'})
    }
    await next()
  }
}

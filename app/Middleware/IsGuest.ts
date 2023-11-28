import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IsGuest {
  public async handle({ auth,response }: HttpContextContract, next: () => Promise<void>) {
   
    await auth.use('api').check()
     
    if (auth.use('api').isLoggedIn) {
      console.log('is logged')
      return response.unauthorized({ error: 'Already Logged in' })

    }
    
   
    await next()
  }
}

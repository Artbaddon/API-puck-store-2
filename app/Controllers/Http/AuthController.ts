import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SignupValidator from 'App/Validators/SignupValidator'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
  public register = async ({ request, response }: HttpContextContract) => {
    try {
      const payload = await request.validate(SignupValidator)
      const user = await User.createUser(payload)

      if (!user) {
        return response.status(500).json({ error: 'Failed to create user' })
      }
      
      return response.status(201) // Return 201 for successful creation
    } catch (error) {
      console.error(error)
      return response.status(422).json({ error: 'Error creating user' })
    }
  }

  public login = async ({ request, response, auth }: HttpContextContract) => {
    try {
      const payload = await request.validate(LoginValidator)
      const user = await User.findBy('email', payload.email)

      if (!user) {
        return response.status(401).json({ error: 'Invalid email or password' })
      }

      const isPasswordValid = await Hash.verify(user.password, payload.password)

      if (!isPasswordValid) {
        return response.status(401).json({ error: 'Invalid email or password' })
      }

      const token = await auth.use('api').login(user, {
        expiresIn: '2 days',
      })

      return response.status(200).json(token.toJSON())
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Login failed' })
    }
  }

  public logout = async ({ auth, response }: HttpContextContract) => {
    try {
      await auth.use('api').logout()

      return response.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Logout failed' })
    }
  }
}

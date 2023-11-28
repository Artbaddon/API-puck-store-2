"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SignupValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/SignupValidator"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const LoginValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/LoginValidator"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
class AuthController {
    constructor() {
        this.register = async ({ request, response }) => {
            try {
                const payload = await request.validate(SignupValidator_1.default);
                const user = await User_1.default.createUser(payload);
                if (!user) {
                    return response.status(500).json({ error: 'Failed to create user' });
                }
                return response.status(201);
            }
            catch (error) {
                console.error(error);
                return response.status(422).json({ error: 'Error creating user' });
            }
        };
        this.login = async ({ request, response, auth }) => {
            try {
                const payload = await request.validate(LoginValidator_1.default);
                const user = await User_1.default.findBy('email', payload.email);
                if (!user) {
                    return response.status(401).json({ error: 'Invalid email or password' });
                }
                const isPasswordValid = await Hash_1.default.verify(user.password, payload.password);
                if (!isPasswordValid) {
                    return response.status(401).json({ error: 'Invalid email or password' });
                }
                const token = await auth.use('api').login(user, {
                    expiresIn: '2 days',
                });
                return response.status(200).json(token.toJSON());
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: 'Login failed' });
            }
        };
        this.logout = async ({ auth, response }) => {
            try {
                await auth.use('api').logout();
                return response.status(200).json({ message: 'Logged out successfully' });
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: 'Logout failed' });
            }
        };
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map
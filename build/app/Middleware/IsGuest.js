"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IsGuest {
    async handle({ auth, response }, next) {
        await auth.use('api').check();
        if (auth.use('api').isLoggedIn) {
            console.log('is logged');
            return response.unauthorized({ error: 'Already Logged in' });
        }
        await next();
    }
}
exports.default = IsGuest;
//# sourceMappingURL=IsGuest.js.map
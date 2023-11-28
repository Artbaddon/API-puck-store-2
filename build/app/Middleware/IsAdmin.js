"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IsAdmin {
    async handle({ auth, response }, next) {
        const user = auth.user;
        if (!user || !user.is_admin) {
            return response.status(403).json({ error: 'Unauthorized - Admin access required' });
        }
        await next();
    }
}
exports.default = IsAdmin;
//# sourceMappingURL=IsAdmin.js.map
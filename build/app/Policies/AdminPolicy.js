"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bouncer_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/Bouncer");
class AdminPolicy extends Bouncer_1.BasePolicy {
    async create(user) {
        if (user && user.is_admin) {
            return true;
        }
    }
    async update(user) {
        if (user && user.is_admin) {
            return true;
        }
    }
    async delete(user) {
        if (user && user.is_admin) {
            return true;
        }
    }
}
exports.default = AdminPolicy;
//# sourceMappingURL=AdminPolicy.js.map
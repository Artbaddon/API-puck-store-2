"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bouncer_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/Bouncer");
class AddressPolicy extends Bouncer_1.BasePolicy {
    async before(user) {
        if (user && user.is_admin) {
            return true;
        }
    }
    async update(user, address) {
        return address.user_id === user.id;
    }
    async delete(user, address) {
        return address.user_id === user.id;
    }
}
exports.default = AddressPolicy;
//# sourceMappingURL=AddressPolicy.js.map
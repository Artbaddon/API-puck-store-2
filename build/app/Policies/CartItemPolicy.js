"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bouncer_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/Bouncer");
class CartItemPolicy extends Bouncer_1.BasePolicy {
    async update(user, cartItem) {
        return user.id === cartItem.user_id;
    }
    async delete(user, cartItem) {
        return user.id === cartItem.user_id;
    }
}
exports.default = CartItemPolicy;
//# sourceMappingURL=CartItemPolicy.js.map
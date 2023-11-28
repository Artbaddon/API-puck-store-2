"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bouncer_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/Bouncer");
class WishlistItemPolicy extends Bouncer_1.BasePolicy {
    async update(user, wishList) {
        return user.id === wishList.user_id;
    }
    async delete(user, wishList) {
        return user.id === wishList.user_id;
    }
}
exports.default = WishlistItemPolicy;
//# sourceMappingURL=WishlistItemPolicy.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bouncer_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/Bouncer");
class ProfilePolicy extends Bouncer_1.BasePolicy {
    async before(user) {
        if (user && user.is_admin) {
            return true;
        }
    }
    async viewList(user, profile) {
        return profile.user_id === user.id;
    }
    async update(user, profile) {
        return profile.user_id === user.id;
    }
}
exports.default = ProfilePolicy;
//# sourceMappingURL=ProfilePolicy.js.map
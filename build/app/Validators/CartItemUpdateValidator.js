"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CartItemUpdateValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            quantity: Validator_1.schema.number.optional([Validator_1.rules.unsigned()]),
        });
        this.messages = {};
    }
}
exports.default = CartItemUpdateValidator;
//# sourceMappingURL=CartItemUpdateValidator.js.map
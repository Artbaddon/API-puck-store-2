"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CartItemStoreValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            product_id: Validator_1.schema.number([Validator_1.rules.required()]),
            quantity: Validator_1.schema.number([Validator_1.rules.required(), Validator_1.rules.unsigned()]),
        });
        this.messages = {
            'required': 'the field {{ field }} is required',
        };
    }
}
exports.default = CartItemStoreValidator;
//# sourceMappingURL=CartItemStoreValidator.js.map
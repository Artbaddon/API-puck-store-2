"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class AddressUpdateValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            address_line_1: Validator_1.schema.string.optional([
                Validator_1.rules.trim(),
                Validator_1.rules.maxLength(255),
                Validator_1.rules.minLength(3),
            ]),
            address_line_2: Validator_1.schema.string.optional([
                Validator_1.rules.trim(),
                Validator_1.rules.maxLength(255),
                Validator_1.rules.minLength(3),
            ]),
            city: Validator_1.schema.string.optional([Validator_1.rules.trim(), Validator_1.rules.maxLength(255), Validator_1.rules.minLength(3)]),
        });
        this.messages = {
            maxLength: 'The {{ field }} can not larger than 255 characters',
            minLength: 'The {{field}} can not be shorter than 3 characters',
        };
    }
}
exports.default = AddressUpdateValidator;
//# sourceMappingURL=AddressUpdateValidator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class LoginValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            email: Validator_1.schema.string([Validator_1.rules.email(), Validator_1.rules.required(), Validator_1.rules.trim()]),
            password: Validator_1.schema.string([Validator_1.rules.required(), Validator_1.rules.minLength(8)]),
        });
        this.messages = {
            'required': '{{ field }} is required',
            'email.email': 'Email should be a valid email address',
            'password.minLength': 'Password should be at least 8 characters long',
        };
    }
}
exports.default = LoginValidator;
//# sourceMappingURL=LoginValidator.js.map
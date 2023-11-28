"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class SignupValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            first_name: Validator_1.schema.string([
                Validator_1.rules.required(),
                Validator_1.rules.maxLength(50),
                Validator_1.rules.trim(),
                Validator_1.rules.alpha({
                    allow: ['space'],
                }),
                Validator_1.rules.minLength(3),
            ]),
            last_name: Validator_1.schema.string([
                Validator_1.rules.required(),
                Validator_1.rules.maxLength(50),
                Validator_1.rules.trim(),
                Validator_1.rules.alpha({
                    allow: ['space'],
                }),
                Validator_1.rules.minLength(3),
            ]),
            email: Validator_1.schema.string([Validator_1.rules.required(), Validator_1.rules.email(), Validator_1.rules.trim()]),
            password: Validator_1.schema.string([Validator_1.rules.required(), Validator_1.rules.minLength(8)]),
        });
        this.messages = {
            'required': 'The {{ field }} is required',
            'alpha': 'The {{ field }} must contain letters only',
            'first_name.maxLength': 'First name should be maximum 50 characters long',
            'first_name.minLength': 'First name should be minimum 4 characters long',
            'last_name.maxLength': 'Last name should be maximum 50 characters long',
            'last_name.minLength': 'Last name should be minimum 4 characters long',
            'email.email': 'Email should be a valid email address',
            'password.minLength': 'Password should be at least 8 characters long',
        };
    }
}
exports.default = SignupValidator;
//# sourceMappingURL=SignupValidator.js.map
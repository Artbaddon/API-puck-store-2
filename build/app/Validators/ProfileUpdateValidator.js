"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class ProfileUpdateValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            first_name: Validator_1.schema.string.optional([
                Validator_1.rules.alpha({ allow: ['space'] }),
                Validator_1.rules.trim(),
                Validator_1.rules.minLength(3),
                Validator_1.rules.maxLength(50),
            ]),
            last_name: Validator_1.schema.string.optional([
                Validator_1.rules.alpha({ allow: ['space'] }),
                Validator_1.rules.trim(),
                Validator_1.rules.minLength(3),
                Validator_1.rules.maxLength(50),
            ]),
            profile_picture: Validator_1.schema.file.optional({
                size: '5mb',
                extnames: ['jpg', 'png', 'jpeg'],
            }),
            password: Validator_1.schema.string.optional([Validator_1.rules.trim(), Validator_1.rules.minLength(8)]),
        });
        this.messages = {
            'maxLength': '{{ field }} can not be larger than 50 characters',
            'minLength': '{{ field }} can not be larger than 50 characters',
            'password.minLength': 'Password has to be more tan 8 characters',
            'profile_picture.size': 'Profile picture size should not be greater than 5mb',
            'profile_picture.extnames': 'Profile picture should be jpg or png only',
        };
    }
}
exports.default = ProfileUpdateValidator;
//# sourceMappingURL=ProfileUpdateValidator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class ProductUpdateValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            name: Validator_1.schema.string.optional([Validator_1.rules.alpha({ allow: ['space'] }), Validator_1.rules.trim(), Validator_1.rules.maxLength(50)]),
            price: Validator_1.schema.number.optional([Validator_1.rules.unsigned()]),
            category_id: Validator_1.schema.number.optional([Validator_1.rules.unsigned()]),
            description: Validator_1.schema.string.optional([Validator_1.rules.trim(), Validator_1.rules.maxLength(400), Validator_1.rules.trim()]),
            image: Validator_1.schema.file.optional({
                size: '5mb',
                extnames: ['jpg', 'png'],
            }),
        });
        this.messages = {
            'name.maxLength': 'Name can not be more than 50 characters',
            'description.maxLength': 'Description can not be more than 400 characters',
            'image.size': 'Image size should not be greater than 5mb',
            'image.extnames': 'Image should be jpg or png only',
        };
    }
}
exports.default = ProductUpdateValidator;
//# sourceMappingURL=ProductUpdateValidator.js.map
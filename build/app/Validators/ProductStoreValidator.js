"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class ProductStoreValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            name: Validator_1.schema.string([
                Validator_1.rules.alpha({ allow: ['space'] }),
                Validator_1.rules.required(),
                Validator_1.rules.trim(),
                Validator_1.rules.maxLength(50),
            ]),
            price: Validator_1.schema.number([Validator_1.rules.required(), Validator_1.rules.unsigned()]),
            category_id: Validator_1.schema.number([Validator_1.rules.required(), Validator_1.rules.unsigned()]),
            description: Validator_1.schema.string([
                Validator_1.rules.trim(),
                Validator_1.rules.required(),
                Validator_1.rules.maxLength(400),
                Validator_1.rules.trim(),
            ]),
            image: Validator_1.schema.file({
                size: '5mb',
                extnames: ['jpg', 'png'],
            }, [Validator_1.rules.required()]),
        });
        this.messages = {
            'name.maxLength': 'Name can not be more than 50 characters',
            'required': 'The field {{field}} is required',
            'description.maxLength': 'Description can not be more than 400 characters',
            'image.file': 'Please provide a valid image',
            'image.size': 'Image size should not be greater than 5mb',
            'image.extnames': 'Image should be jpg or png only',
        };
    }
}
exports.default = ProductStoreValidator;
//# sourceMappingURL=ProductStoreValidator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CategoryCreateValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            name: Validator_1.schema.string([Validator_1.rules.required(), Validator_1.rules.maxLength(50), Validator_1.rules.trim()]),
            description: Validator_1.schema.string([Validator_1.rules.required(), Validator_1.rules.maxLength(400), Validator_1.rules.trim()]),
            category_img: Validator_1.schema.file({
                size: '5mb',
                extnames: ['jpg', 'png'],
            }, [Validator_1.rules.required()]),
        });
        this.messages = {
            'required': '{{field}} is required',
            'name.maxLength': 'Title can not be more than 50 characters',
            'description.maxLength': 'Description can not be more than 400 characters',
            'category_img.file': 'Please provide a valid image',
            'category_img.size': 'Image size should not be greater than 5mb',
            'category_img.extnames': 'Image should be jpg or png only',
        };
    }
}
exports.default = CategoryCreateValidator;
//# sourceMappingURL=CategoryCreateValidator.js.map
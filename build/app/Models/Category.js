"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Product_1 = __importDefault(require("./Product"));
class Category extends Orm_1.BaseModel {
}
_a = Category;
Category.storeCategory = async (data, trx) => {
    const category = await _a.create({
        name: data.name,
        description: data.description,
        category_img: data.category_image,
    }, { client: trx });
    return category;
};
Category.updateCategory = async (data, trx) => {
    let category = await _a.query({ client: trx }).where('id', data.id).first();
    if (!category) {
        return Promise.reject(new Error('Category Not Found'));
    }
    if (data.name) {
        category.name = data.name;
    }
    if (data.description) {
        category.description = data.description;
    }
    if (data.category_img) {
        category.category_img = data.category_img;
    }
    await category.save();
    return category;
};
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Category.prototype, "category_img", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => Product_1.default, {
        foreignKey: 'category_id',
        localKey: 'id',
    }),
    __metadata("design:type", Object)
], Category.prototype, "products", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Category.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Category.prototype, "updatedAt", void 0);
exports.default = Category;
//# sourceMappingURL=Category.js.map
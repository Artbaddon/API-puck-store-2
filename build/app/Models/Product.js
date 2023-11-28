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
const Category_1 = __importDefault(require("./Category"));
const WishlistItem_1 = __importDefault(require("./WishlistItem"));
const CartItem_1 = __importDefault(require("./CartItem"));
class Product extends Orm_1.BaseModel {
}
_a = Product;
Product.storeProduct = async (data, trx) => {
    const product = await _a.create({
        name: data.name,
        description: data.name,
        price: data.price,
        image: data.image,
        category_id: data.category_id,
    }, { client: trx });
    return product;
};
Product.updateProduct = async (data, trx) => {
    let product = await _a.query({ client: trx }).where('id', data.id).first();
    if (!product) {
        return Promise.reject(new Error('Product Not Found'));
    }
    if (data.name) {
        product.name = data.name;
    }
    if (data.description) {
        product.description = data.description;
    }
    if (data.price) {
        product.price = data.price;
    }
    if (data.image) {
        product.image = data.image;
    }
    if (data.category_id) {
        product.category_id = data.category_id;
    }
    await product.save();
    return product;
};
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Product.prototype, "image", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Product.prototype, "category_id", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Category_1.default, {
        localKey: 'id',
        foreignKey: 'category_id',
    }),
    __metadata("design:type", Object)
], Product.prototype, "category", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => WishlistItem_1.default),
    __metadata("design:type", Object)
], Product.prototype, "wishlistItems", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => CartItem_1.default),
    __metadata("design:type", Object)
], Product.prototype, "cartItems", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Product.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Product.prototype, "updatedAt", void 0);
exports.default = Product;
//# sourceMappingURL=Product.js.map
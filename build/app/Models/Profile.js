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
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class Profile extends Orm_1.BaseModel {
}
_a = Profile;
Profile.createProfile = async (data, trx) => {
    await _a.create({
        first_name: data.first_name,
        last_name: data.last_name,
        user_id: data.user_id,
    }, { client: trx });
    return 'Profile Created';
};
Profile.getProfileById = async (id) => {
    const profile = await _a.query()
        .where('id', id)
        .preload('user', (userQuery) => {
        userQuery.preload('addresses'),
            userQuery.preload('orders'),
            userQuery.preload('cart_items'),
            userQuery.preload('wishlist_items');
    })
        .firstOrFail();
    return profile;
};
Profile.updateProfile = async (data, trx) => {
    const { id, first_name, last_name, password, profile_picture } = data;
    const profile = await _a.query({ client: trx }).where('id', id).preload('user').firstOrFail();
    if (password) {
        profile.user.password = password;
    }
    if (first_name) {
        profile.first_name = first_name;
    }
    if (last_name) {
        profile.last_name = last_name;
    }
    if (profile_picture) {
        profile.profile_picture = profile_picture;
    }
    await profile.save();
    return profile;
};
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Profile.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Profile.prototype, "first_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Profile.prototype, "last_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Profile.prototype, "profile_picture", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Profile.prototype, "user_id", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default, {
        localKey: 'id',
        foreignKey: 'user_id',
    }),
    __metadata("design:type", Object)
], Profile.prototype, "user", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Profile.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Profile.prototype, "updatedAt", void 0);
exports.default = Profile;
//# sourceMappingURL=Profile.js.map
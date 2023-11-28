"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.group(() => {
        Route_1.default.post('/login', 'AuthController.login');
        Route_1.default.post('/register', 'AuthController.register');
    }).middleware('isGuest');
    Route_1.default.get('/logout', 'AuthController.logout').as('logout').middleware('auth');
    Route_1.default.group(() => {
        Route_1.default.group(() => {
            Route_1.default.resource('categories', 'CategoriesController').only(['store', 'destroy', 'update']);
            Route_1.default.resource('products', 'ProductsController').only(['store', 'destroy', 'update']);
        }).middleware('isAdmin');
        Route_1.default.resource('profiles', 'ProfilesController').only(['update', 'show']);
        Route_1.default.resource('wishlistitems', 'WishlistItemsController').only(['index', 'store', 'destroy']);
        Route_1.default.resource('cart', 'CartItemsController').only(['store', 'destroy', 'index', 'update']);
        Route_1.default.resource('order', 'OrdersController').only(['store', 'index']);
        Route_1.default.resource('address', 'AddressesController').only(['store', 'update', 'destroy', 'index']);
    }).middleware('auth:api');
    Route_1.default.resource('products', 'ProductsController').only(['index', 'show']);
    Route_1.default.resource('categories', 'CategoriesController').only(['index', 'show']);
}).prefix('/api/v1');
//# sourceMappingURL=routes.js.map
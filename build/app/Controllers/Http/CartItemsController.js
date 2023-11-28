"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const CartItem_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CartItem"));
const Product_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Product"));
const CartItemStoreValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/CartItemStoreValidator"));
const CartItemUpdateValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/CartItemUpdateValidator"));
class CartItemsController {
    constructor() {
        this.index = async ({ auth }) => {
            const user_id = auth.user.id;
            const cart_items = CartItem_1.default.query().where('user_id', user_id).preload('product');
            return cart_items;
        };
        this.store = async ({ request, auth, response }) => {
            const payload = await request.validate(CartItemStoreValidator_1.default);
            const product_id = payload.product_id;
            const user_id = auth.user.id;
            const trx = await Database_1.default.transaction();
            try {
                let cart_item = await CartItem_1.default.query()
                    .where('user_id', user_id)
                    .where('product_id', product_id)
                    .first();
                const existingProduct = await Product_1.default.find(product_id);
                if (!existingProduct) {
                    await trx.rollback();
                    throw new Error('Product with this id does not exist');
                }
                const price = existingProduct.price;
                if (cart_item) {
                    cart_item.quantity += payload.quantity;
                    await cart_item.save();
                }
                else {
                    cart_item = await CartItem_1.default.create({
                        user_id: user_id,
                        product_id: product_id,
                        quantity: payload.quantity,
                        price: price,
                    });
                }
                await trx.commit();
                return cart_item;
            }
            catch (error) {
                await trx.rollback();
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
        this.update = async ({ params, response, request, bouncer }) => {
            const { id } = params;
            const payload = await request.validate(CartItemUpdateValidator_1.default);
            let cart_item;
            const trx = await Database_1.default.transaction();
            try {
                cart_item = await CartItem_1.default.findOrFail(id);
                try {
                    await bouncer.with('CartItemPolicy').authorize('update', cart_item);
                }
                catch (error) {
                    console.log('error');
                    return response.status(403).json({ error: error.message });
                }
                if (typeof payload.quantity !== 'undefined') {
                    cart_item.quantity = payload.quantity;
                }
                else {
                    throw new Error('Quantity is missing or invalid');
                }
                cart_item.quantity = payload.quantity;
                await cart_item.save();
                await trx.commit();
                return cart_item;
            }
            catch (error) {
                await trx.rollback();
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
        this.destroy = async ({ params, response, bouncer }) => {
            const { id } = params;
            const trx = await Database_1.default.transaction();
            let cart_item;
            try {
                cart_item = await CartItem_1.default.findOrFail(id, { client: trx });
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
            try {
                await bouncer.with('CartItemPolicy').authorize('delete', cart_item);
            }
            catch (error) {
                console.log('error');
                return response.status(403).json({ error: error.message });
            }
            try {
                await cart_item.delete();
                await trx.commit();
                return response.status(200).json({ success: 'Product  Deleted from the cart' });
            }
            catch (error) {
                await trx.rollback();
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
    }
}
exports.default = CartItemsController;
//# sourceMappingURL=CartItemsController.js.map
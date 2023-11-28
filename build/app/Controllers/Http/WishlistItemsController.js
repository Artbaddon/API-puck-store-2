"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WishlistItem_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/WishlistItem"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Product_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Product"));
class WishlistItemsController {
    constructor() {
        this.index = async ({ auth }) => {
            const wishlist_items = WishlistItem_1.default.query().where('user_id', auth.user.id).preload('product');
            return wishlist_items;
        };
        this.store = async ({ request, response, auth }) => {
            const product_id = request.input('product_id');
            const user_id = auth.user.id;
            const trx = await Database_1.default.transaction();
            try {
                const exisitingProduct = await Product_1.default.find(product_id);
                if (!exisitingProduct) {
                    await trx.rollback();
                    throw new Error('Product with this id does not exists');
                }
                const exisitingProductinWishlist = await WishlistItem_1.default.findBy('product_id', product_id);
                if (exisitingProductinWishlist) {
                    await trx.rollback();
                    throw new Error('Product already exists in wishlist');
                }
                const wishlist_item = await WishlistItem_1.default.create({
                    user_id: user_id,
                    product_id: product_id,
                }, trx);
                await trx.commit();
                return response.ok(wishlist_item);
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
            let wishlist_item;
            try {
                wishlist_item = await WishlistItem_1.default.findOrFail(id, { client: trx });
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
            try {
                await bouncer.with('WishlistItemPolicy').authorize('delete', wishlist_item);
            }
            catch (error) {
                console.log('error');
                return response.status(403).json({ error: error.message });
            }
            try {
                await wishlist_item.delete();
                await trx.commit();
                return response.status(200).json({ success: 'Product  Deleted' });
            }
            catch (error) {
                await trx.rollback();
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
    }
}
exports.default = WishlistItemsController;
//# sourceMappingURL=WishlistItemsController.js.map
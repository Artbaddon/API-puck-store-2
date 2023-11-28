"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CartItem_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CartItem"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Order_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Order"));
const OrderItem_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/OrderItem"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class OrdersController {
    constructor() {
        this.index = async ({ auth }) => {
            try {
                const user_id = auth.user.id;
                const orders = await User_1.default.query().where('id', user_id).preload('orders');
                return orders;
            }
            catch (error) { }
        };
        this.store = async ({ auth, response }) => {
            const user_id = auth.user.id;
            const trx = await Database_1.default.transaction();
            try {
                let cart_items = await CartItem_1.default.query().where('user_id', user_id);
                if (cart_items.length == 0) {
                    await trx.rollback();
                    throw new Error('Your Cart is empty');
                }
                let total_price = 0;
                let total_amount = 0;
                cart_items.forEach((item) => {
                    const { price, quantity } = item;
                    total_amount += price * quantity;
                });
                console.log(total_price);
                const order = await Order_1.default.create({
                    user_id: user_id,
                    total_amount: total_amount,
                }, { client: trx });
                for (const cart_item of cart_items) {
                    const { price, quantity } = cart_item;
                    total_price += price * quantity;
                    await OrderItem_1.default.create({
                        order_id: order.id,
                        cart_item_id: cart_item.id,
                        quantity: quantity,
                        total_price: total_price,
                        unit_price: price,
                    }, { client: trx });
                }
                await trx.commit();
                await CartItem_1.default.query().delete().where('user_id', user_id);
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
    }
}
exports.default = OrdersController;
//# sourceMappingURL=OrdersController.js.map
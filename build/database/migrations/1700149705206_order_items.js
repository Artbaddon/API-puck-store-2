"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'order_items';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer('order_id').unsigned().references('orders.id').onDelete('CASCADE').notNullable();
            table
                .integer('cart_item_id')
                .unsigned()
                .references('cart_items.id')
                .onDelete('CASCADE')
                .notNullable();
            table.integer('quantity').unsigned().notNullable();
            table.decimal('unit_price', 20, 2).notNullable();
            table.decimal('total_price', 20, 2).notNullable();
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1700149705206_order_items.js.map
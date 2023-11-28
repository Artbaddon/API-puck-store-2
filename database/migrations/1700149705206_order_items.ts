import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('order_id').unsigned().references('orders.id').onDelete('CASCADE').notNullable()
      table
        .integer('cart_item_id')
        .unsigned()
        .references('cart_items.id')
        .onDelete('CASCADE')
        .notNullable()
        
      table.integer('quantity').unsigned().notNullable()
      table.decimal('unit_price',20,2).notNullable()
      table.decimal('total_price',20,2).notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

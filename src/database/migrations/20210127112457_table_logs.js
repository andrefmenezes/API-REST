
exports.up = function(knex) {
    return knex.schema.createTable('table_prod', (table) => {
        table.increments('id').notNull().primary();
        table.text('codigo').notNull(); 
        table.float('qtd').notNull();
        table.text('desc').notNull(); 
      });
};
exports.down = function(knex) {
    return knex.schema.dropTable('table_prod');
};

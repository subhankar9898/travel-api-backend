/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // The 'up' function is what runs when you migrate. It builds the tables.
    return knex.schema
      // Table 1: zones
      .createTable('zones', (table) => {
        table.increments('id').primary(); // Creates an auto-incrementing ID as the primary key
        table.string('name', 255).notNullable().unique(); // Zone name, must be unique
      })
      // Table 2: states
      .createTable('states', (table) => {
        table.increments('id').primary();
        table.string('name', 255).notNullable().unique();
        // This is the foreign key that links a state to a zone
        table.integer('zone_id').unsigned().references('id').inTable('zones').onDelete('CASCADE');
      })
      // Table 3: cities
      .createTable('cities', (table) => {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        // This is the foreign key that links a city to a state
        table.integer('state_id').unsigned().references('id').inTable('states').onDelete('CASCADE');
      })
      // Table 4: places
      .createTable('places', (table) => {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.string('type', 255);
        table.string('establishment_year', 20);
        table.float('time_needed_hrs');
        table.float('google_review_rating');
        table.integer('entrance_fee_inr');
        table.boolean('airport_nearby');
        table.string('weekly_off', 50);
        table.string('significance', 255);
        table.boolean('dslr_allowed');
        table.string('best_time_to_visit', 50);
        // This is the foreign key that links a place to a city
        table.integer('city_id').unsigned().references('id').inTable('cities').onDelete('CASCADE');
      });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    // The 'down' function is for undoing the migration. It drops tables in reverse order of creation to avoid errors.
    return knex.schema
      .dropTableIfExists('places')
      .dropTableIfExists('cities')
      .dropTableIfExists('states')
      .dropTableIfExists('zones');
  };
  
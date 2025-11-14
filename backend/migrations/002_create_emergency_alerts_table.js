/**
 * Create emergency alerts table
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('emergency_alerts', function(table) {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // User relationship
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.index('user_id');

    // Alert details
    table.enum('type', [
      'medical', 'accident', 'fire', 'crime', 'lost', 'other'
    ]).notNullable();
    table.enum('severity', ['low', 'medium', 'high', 'critical']).notNullable();
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.text('custom_message');

    // Location information
    table.decimal('latitude', { precision: 10, scale: 8 }).notNullable();
    table.decimal('longitude', { precision: 11, scale: 8 }).notNullable();
    table.integer('accuracy_meters');
    table.decimal('altitude', { precision: 8, scale: 2 });
    table.string('address');

    // Status tracking
    table.enum('status', [
      'active', 'responding', 'resolved', 'false_alarm', 'cancelled'
    ]).defaultTo('active');
    table.timestamp('resolved_at');
    table.text('resolution_notes');

    // AI detection
    table.boolean('auto_generated').defaultTo(false);
    table.enum('ai_detection_type', [
      'crash_detection', 'fall_detection', 'no_movement_detection',
      'voice_activation', 'heart_rate_anomaly', 'deviation_from_pattern'
    ]);
    table.float('ai_confidence_score');
    table.jsonb('ai_detection_data');

    // Emergency response
    table.boolean('emergency_services_notified').defaultTo(false);
    table.timestamp('emergency_services_notified_at');
    table.boolean('emergency_services_called').defaultTo(false);
    table.timestamp('emergency_services_called_at');
    table.string('emergency_services_reference');

    // Response times
    table.integer('response_time_seconds');
    table.integer('resolution_time_seconds');

    // Statistics
    table.integer('helpers_notified').defaultTo(0);
    table.integer('helpers_responding').defaultTo(0);
    table.integer('helpers_arrived').defaultTo(0);

    // Timestamps
    table.timestamps(true, true);

    // Additional indexes
    table.index(['type']);
    table.index(['severity']);
    table.index(['status']);
    table.index(['created_at']);
    table.index(['latitude', 'longitude']); // For spatial queries
    table.index(['auto_generated']);
    table.index(['emergency_services_notified']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('emergency_alerts');
};
/**
 * Create users table
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // Authentication fields
    table.string('email').unique().notNullable();
    table.string('phone_number').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('salt').notNullable();

    // Profile information
    table.string('full_name').notNullable();
    table.date('date_of_birth');
    table.string('profile_picture_url');

    // Verification status
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('email_verified_at');
    table.timestamp('phone_verified_at');

    // Helper information
    table.boolean('is_helper').defaultTo(false);
    table.enum('helper_verification_status', ['pending', 'verified', 'rejected']).defaultTo('pending');
    table.timestamp('helper_verified_at');

    // Status and settings
    table.enum('status', ['active', 'inactive', 'suspended']).defaultTo('active');
    table.jsonb('preferences').defaultTo('{}');
    table.jsonb('location_sharing_settings').defaultTo('{}');

    // Security fields
    table.string('two_factor_secret');
    table.boolean('two_factor_enabled').defaultTo(false);
    table.string('reset_password_token');
    table.timestamp('reset_password_expires');
    table.string('email_verification_token');
    table.timestamp('email_verification_expires');

    // Device and session info
    table.jsonb('device_info').defaultTo('{}');
    table.timestamp('last_login_at');
    table.string('last_login_ip');

    // Timestamps
    table.timestamps(true, true);

    // Indexes
    table.index(['email']);
    table.index(['phone_number']);
    table.index(['is_verified']);
    table.index(['is_helper']);
    table.index(['status']);
    table.index(['created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
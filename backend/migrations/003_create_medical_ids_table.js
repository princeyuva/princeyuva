/**
 * Create medical IDs table for FHIR-compliant medical information
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('medical_ids', function(table) {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // User relationship
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.index('user_id');

    // Personal information
    table.string('full_name').notNullable();
    table.date('date_of_birth');
    table.integer('age');
    table.string('height'); // cm
    table.string('weight'); // kg
    table.enum('blood_type', [
      'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'
    ]).defaultTo('unknown');
    table.enum('gender', ['male', 'female', 'other', 'prefer_not_to_say']);
    table.string('photo_url');
    table.string('identification_number');

    // Emergency contacts
    table.jsonb('emergency_contacts').defaultTo('[]');

    // Medical conditions (FHIR compliant)
    table.jsonb('medical_conditions').defaultTo('[]'); // Array of medical conditions

    // Allergies
    table.jsonb('allergies').defaultTo('[]'); // Array of allergies

    // Medications
    table.jsonb('medications').defaultTo('[]'); // Array of current medications

    // Medical devices
    table.jsonb('medical_devices').defaultTo('[]'); // Array of medical devices

    // Insurance information
    table.jsonb('insurance_info').defaultTo('{}');

    // Doctor information
    table.jsonb('doctor_info').defaultTo('{}');

    // Advanced directives
    table.jsonb('advanced_directives').defaultTo('[]');

    // Organ donor status
    table.enum('organ_donor_status', ['donor', 'non_donor', 'unsure', 'registered_donor']).defaultTo('unsure');

    // Emergency instructions
    table.text('emergency_instructions');
    table.text('special_medical_needs');

    // QR code for first responders
    table.string('qr_code_url');
    table.string('emergency_access_key');
    table.timestamp('qr_code_expires_at');
    table.boolean('qr_code_active').defaultTo(true);

    // Verification and sharing
    table.timestamp('last_verified');
    table.string('verified_by'); // User ID of medical professional
    table.boolean('public_sharing_enabled').defaultTo(false);
    table.timestamp('public_sharing_expires');

    // Emergency access tracking
    table.timestamp('last_emergency_access');
    table.string('last_emergency_access_by'); // Helper or emergency service ID
    table.integer('emergency_access_count').defaultTo(0);

    // Data compliance
    table.boolean('gdpr_compliant').defaultTo(true);
    table.text('data_consent_version');

    // Timestamps
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable(); // Soft delete

    // Additional indexes
    table.index(['blood_type']);
    table.index(['organ_donor_status']);
    table.index(['qr_code_active']);
    table.index(['public_sharing_enabled']);
    table.index(['deleted_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('medical_ids');
};
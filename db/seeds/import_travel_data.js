const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Use a transaction to ensure all inserts succeed or none do.
  return knex.transaction(async (trx) => {
    // 1. Clear existing data in reverse order of creation to avoid foreign key constraints.
    await trx('places').del();
    await trx('cities').del();
    await trx('states').del();
    await trx('zones').del();

    // 2. Read the CSV file
    const records = [];
    const csvFilePath = path.join(__dirname, '..', '..', 'Top Indian Places to Visit.csv');

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => records.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    // 3. Process and insert data
    const zoneMap = new Map();
    // --- THIS IS THE CORRECTED LINE ---
    const stateMap = new Map();
    // ------------------------------------
    const cityMap = new Map();

    for (const record of records) {
      // If a row is missing essential data, skip it and continue to the next one.
      if (!record.Zone || !record.State || !record.City || !record.Name) {
        console.warn('Skipping incomplete row because essential data is missing:', record);
        continue; // This jumps to the next iteration of the loop
      }

      // --- Handle Zone ---
      let zoneId;
      if (!zoneMap.has(record.Zone)) {
        const [insertedZone] = await trx('zones').insert({ name: record.Zone }).returning('id');
        zoneId = insertedZone.id;
        zoneMap.set(record.Zone, zoneId);
      } else {
        zoneId = zoneMap.get(record.Zone);
      }

      // --- Handle State ---
      let stateId;
      if (!stateMap.has(record.State)) {
        const [insertedState] = await trx('states').insert({ name: record.State, zone_id: zoneId }).returning('id');
        stateId = insertedState.id;
        stateMap.set(record.State, stateId);
      } else {
        stateId = stateMap.get(record.State);
      }

      // --- Handle City ---
      const cityStateKey = `${record.City}-${record.State}`;
      let cityId;
      if (!cityMap.has(cityStateKey)) {
        const [insertedCity] = await trx('cities').insert({ name: record.City, state_id: stateId }).returning('id');
        cityId = insertedCity.id;
        cityMap.set(cityStateKey, cityId);
      } else {
        cityId = cityMap.get(cityStateKey);
      }

      // --- Handle Place ---
      await trx('places').insert({
        name: record.Name,
        type: record.Type,
        establishment_year: record['Establishment Year'],
        time_needed_hrs: parseFloat(record['time needed to visit in hrs']) || 0,
        google_review_rating: parseFloat(record['Google review rating']) || 0,
        entrance_fee_inr: parseInt(record['Entrance Fee in INR']) || 0,
        airport_nearby: (record['Airport with 50km Radius'] || '').toLowerCase() === 'yes',
        weekly_off: record['Weekly Off'],
        significance: record.Significance,
        dslr_allowed: (record['DSLR Allowed'] || '').toLowerCase() === 'yes',
        best_time_to_visit: record['Best Time to visit'],
        city_id: cityId,
      });
    }
  });
};


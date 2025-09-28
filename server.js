// --- Part 1: Setup ---
const express = require('express');
const knex = require('knex');
const cors = require('cors'); 
const knexConfig = require('./knexfile'); 

const app = express();
const db = knex(knexConfig.development);
const PORT = 3000;

// --- Part 2: Middleware ---
app.use(cors()); 

// --- Part 3: API Endpoints (The Routes) ---

app.get('/', (req, res) => {
  res.send('Welcome to the Travel API!');
});

// GET ALL PLACES
app.get('/api/places', async (req, res) => {
  try {
    const places = await db('places')
      .join('cities', 'places.city_id', 'cities.id')
      .join('states', 'cities.state_id', 'states.id')
      .join('zones', 'states.zone_id', 'zones.id')
      .select(
        'places.id as place_id',
        'places.name as place_name',
        'places.type',
        'cities.name as city',
        'states.name as state',
        'zones.name as zone',
        'places.google_review_rating as rating'
      );
    res.json(places);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Error fetching places from the database.' });
  }
});

// =================================================================
// === NEW CODE BLOCK: GET A SINGLE PLACE BY ITS ID ===
// =================================================================
app.get('/api/places/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL (e.g., the '5' in /api/places/5)

    const place = await db('places')
      .join('cities', 'places.city_id', 'cities.id')
      .join('states', 'cities.state_id', 'states.id')
      .join('zones', 'states.zone_id', 'zones.id')
      .where('places.id', id) // Find the place WHERE the ID matches
      .first() // We only want the first result (there should only be one)
      .select( // Select all the details for this one place
        'places.*', // Select all columns from the places table
        'cities.name as city_name',
        'states.name as state_name',
        'zones.name as zone_name'
      );

    if (place) {
      res.json(place); // If we found the place, send it back
    } else {
      // If no place with that ID exists, send a "Not Found" error
      res.status(404).json({ message: 'Place not found.' });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Error fetching place from the database.' });
  }
});
// =================================================================
// === END OF NEW CODE BLOCK ===
// =================================================================


// --- Part 4: Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
});


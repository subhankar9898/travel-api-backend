# Indian Travel Destinations API
This is a complete backend project built with Node.js, Express, and Knex, serving data about top tourist destinations in India from a SQLite database. It also includes a simple HTML/Tailwind CSS frontend to view the data.

This project was built to demonstrate a full-stack development workflow, from parsing data from a CSV file and seeding a database to creating a RESTful API and a basic user interface.

## Features

- **RESTful API:** Provides endpoints to fetch all travel places or a single place by its ID.  

- **Relational Database:** Uses a normalized SQLite database with four interconnected tables (Zones, States, Cities, Places).  

- **Data Seeding:** Includes a script to parse the original `Top Indian Places to Visit.csv` data and populate the database.  

- **Simple Frontend:** An `index.html` file that fetches and displays all destinations from the API in a clean, responsive layout.  

- **CORS Enabled:** The server is configured to allow cross-origin requests, so the frontend can fetch data without issues.

## 🛠️ How to Set Up and Run This Project

Follow these steps to get the project running on your local machine:

### 1. Clone the repository:

```bash
   git clone https://github.com/subhankar9898/Web-Portfolio.git
   ```

### 2. Navigate into the project directory:

```bash
cd travel-backend
```

### 3. Install all the necessary dependencies:

```bash
npm install
```

### 4. Run the database migrations to create the table structure:

```bash
npx knex migrate:latest
```

### 5. Seed the database with the data from the CSV file:

```bash
npx knex seed:run
```

### 6. Start the server:

```bash
node server.js
```

The server will be running at [**http://localhost:3000**](http://localhost:3000)http://localhost:3000. You can now open the index.html file in your browser to see the application in action.

# API Endpoints

The API provides the following endpoints:

- `GET /api/places`  
  **Description:** Fetches a list of all travel destinations with their essential details.  

  **Success Response:** `200 OK` with an array of place objects.  

- `GET /api/places/:id`  
  **Description:** Fetches complete details for a single destination by its unique ID.  

  **Success Response:** `200 OK` with a single place object.  

  **Error Response:** `404 Not Found` if a place with the specified ID does not exist.
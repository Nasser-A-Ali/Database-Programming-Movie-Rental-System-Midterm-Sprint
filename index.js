const { Pool } = require("pg");

// PostgreSQL connection
const pool = new Pool({
  user: "postgres", //This _should_ be your username, as it's the default one Postgres uses
  host: "localhost",
  database: "midterm_sprint", //This should be changed to reflect your actual database
  password: "your_database_password", //This should be changed to reflect the password you used when setting up Postgres
  port: 5432,
});

/**
 * Creates the database tables, if they do not already exist.
 */
async function createTable() {
  try {
    // Create Movies table
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Movies (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      release_year INT NOT NULL,
      genre TEXT NOT NULL,
      director TEXT NOT NULL
    );
  `);

    // Create Customers table
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Customers (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone_number TEXT NOT NULL
    );
  `);

    // Create Rentals table
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Rentals (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER REFERENCES Customers(id),
      movie_id INTEGER REFERENCES Movies(id),
      rental_date DATE NOT NULL,
      return_date DATE
    );
  `);

    console.log("Tables created successfully");
  } catch (error) {
    console.error("An error occured while creating the tables:", error.message);
  }
}

/**
 * Inserts a new movie into the Movies table.
 *
 * @param {string} title Title of the movie
 * @param {number} year Year the movie was released
 * @param {string} genre Genre of the movie
 * @param {string} director Director of the movie
 */
async function insertMovie(title, year, genre, director) {
  // TODO: Add code to insert a new movie into the Movies table
  const query = `
      INSERT INTO Movies (title, release_year, genre, director)
      VALUES ($1, $2, $3, $4)`;
  try {
    const values = [title, releaseYear, genre, director];
    await pool.query(query, values);
    console.log("Movie inserted successfully");
  } catch (error) {
    console.error(
      "An error occurred while inserting the movie:",
      error.message
    );
  }
}

/**
 * Prints all movies in the database to the console
 */
async function displayMovies() {
  // TODO: Add code to retrieve and print all movies from the Movies table
  try {
    await pool.query("SELECT * FROM Movies");
    console.log("Movies:");
    for (let row of result.rows) {
      console.log(row);
    }
  } catch (error) {
    console.error(
      "An error occurred while displaying the movies:",
      error.message
    );
  }
}

/**
 * Updates a customer's email address.
 *
 * @param {number} customerId ID of the customer
 * @param {string} newEmail New email address of the customer
 */
async function updateCustomerEmail(customerId, newEmail) {
  // TODO: Add code to update a customer's email address
  const query = `
      UPDATE Customers
      SET email = $1
      WHERE id = $2`;

  try {
    const values = [newEmail, customerId];
    await pool.query(query, values);
    console.log("Customer email has been updated to ", newEmail);
  } catch (error) {
    console.error(
      "An error occurred while updating the customer's email:",
      error.message
    );
  }
}

/**
 * Removes a customer from the database along with their rental history.
 *
 * @param {number} customerId ID of the customer to remove
 */
async function removeCustomer(customerId) {
  // TODO: Add code to remove a customer and their rental history
  try {
    pool.query("DELETE FROM Customers WHERE id = $1", [customerId]);
    pool.query("DELETE FROM Rentals WHERE customer_id = $1", [customerId]);
    console.log(`Removed customer with ID: ${customerId} successfully`);
  } catch (error) {
    console.error(
      `An error occurred while removing the customer with ID: ${customerId}`,
      error.message
    );
  }
}

/**
 * Prints a help message to the console
 */
function printHelp() {
  console.log("Usage:");
  console.log("  insert <title> <year> <genre> <director> - Insert a movie");
  console.log("  show - Show all movies");
  console.log("  update <customer_id> <new_email> - Update a customer's email");
  console.log("  remove <customer_id> - Remove a customer from the database");
}

/**
 * Runs our CLI app to manage the movie rentals database
 */
async function runCLI() {
  await createTable();

  const args = process.argv.slice(2);
  switch (args[0]) {
    case "insert":
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
      break;
    case "show":
      await displayMovies();
      break;
    case "update":
      if (args.length !== 3) {
        printHelp();
        return;
      }
      await updateCustomerEmail(parseInt(args[1]), args[2]);
      break;
    case "remove":
      if (args.length !== 2) {
        printHelp();
        return;
      }
      await removeCustomer(parseInt(args[1]));
      break;
    default:
      printHelp();
      break;
  }
}

runCLI();

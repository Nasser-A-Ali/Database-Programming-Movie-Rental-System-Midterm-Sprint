-- Nasser Ali
-- Nov 3, 2024
-- Description: This file contains the queries to create the tables and other manipulations as required per the problem statement.

-- Create tables
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    release_year INTEGER NOT NULL,
    genre TEXT NOT NULL,
    director TEXT NOT NULL
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL
);

CREATE TABLE rentals (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    movie_id INTEGER REFERENCES movies(id),
    rental_date DATE NOT NULL,
    return_date DATE
);

-- Insert 5 movies
INSERT INTO movies (title, release_year, genre, director) VALUES
('The Shawshank Redemption', 1994, 'Drama', 'Frank Darabont'),
('The Godfather', 1972, 'Crime', 'Francis Ford Coppola'),
('The Dark Knight', 2008, 'Action', 'Christopher Nolan'),
('The Lord of the Rings: The Return of the King', 2003, 'Adventure', 'Peter Jackson'),
('Pulp Fiction', 1994, 'Crime', 'Quentin Tarantino');

-- Insert 5 customers
INSERT INTO customers (first_name, last_name, email, phone) VALUES
    ('John', 'Doe', 'john@example.com', '123-456-7890'),
    ('Jane', 'Smith', 'jane@example.com', '234-567-8901'),
    ('Alice', 'Johnson', 'alice@example.com', '345-678-9012'),
    ('Bob', 'Brown', 'bob@example.com', '456-789-0123'),
    ('Charlie', 'Davis', 'charlie@example.com', '567-890-1234');

-- Insert 10 rentals
INSERT INTO rentals (customer_id, movie_id, rental_date, return_date) VALUES
    (1, 1, '2024-10-01', '2024-10-08'),
    (2, 2, '2024-10-02', '2024-10-09'),
    (3, 3, '2024-10-03', '2024-10-10'),
    (4, 4, '2024-10-04', '2024-10-11'),
    (5, 5, '2024-10-05', '2024-10-12'),
    (1, 2, '2024-10-06', '2024-10-13'),
    (2, 3, '2024-10-07', '2024-10-14'),
    (3, 4, '2024-10-08', '2024-10-15'),
    (4, 5, '2024-10-09', '2024-10-16'),
    (5, 1, '2024-10-10', '2024-10-17');

-- Find all movies rented by a specific customer, given their email.
SELECT customers.first_name, customers.last_name, movies.title
FROM customers
JOIN rentals ON customers.id = rentals.customer_id
JOIN movies ON rentals.movie_id = movies.id
WHERE customers.email = 'customer@email.com';

-- Given a movie title, List all customers who have rented the movie.
SELECT movies.title, customers.first_name, customers.last_name
FROM movies
JOIN rentals ON movies.id = rentals.movie_id
JOIN customers ON rentals.customer_id = customers.id
WHERE movies.title = 'Movie Title';

-- Get the rental history for a specific movie title.
SELECT movies.title, customers.first_name, customers.last_name, rentals.rental_date, rentals.return_date
FROM movies
JOIN rentals ON movies.id = rentals.movie_id
JOIN customers ON rentals.customer_id = customers.id
WHERE movies.title = 'Movie Title';

-- For a specific movie director:
-- Find the name of the customer, the date of the rental and title of the movie each time a movie by that director was rented.
SELECT customers.first_name, customers.last_name, rentals.rental_date, movies.title
FROM customers
JOIN rentals ON customers.id = rentals.customer_id
JOIN movies ON rentals.movie_id = movies.id
WHERE movies.director = 'Director Name';

-- List all currently rented out movies (movies who’s return dates haven’t been met).
SELECT movies.title, customers.first_name, customers.last_name, rentals.rental_date, rentals.return_date
FROM movies
JOIN rentals ON movies.id = rentals.movie_id
JOIN customers ON rentals.customer_id = customers.id
WHERE rentals.return_date > CURRENT_DATE;
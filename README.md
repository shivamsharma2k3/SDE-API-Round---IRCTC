# SDE API Round - IRCTC

This is a railway management system API similar to IRCTC, built using Node.js, Express, and MySQL.

## Features

- **User Registration & Login**: Users can register and log in to obtain a JWT.
- **Role-Based Access**:
  - **Admin**: Protected endpoints (e.g., add new trains) are secured using an API key.
  - **Users**: Can check seat availability, book seats, and view their booking details.
- **Concurrency-Safe Booking**: Uses MySQL transactions and row-level locking to handle simultaneous booking requests.

## Setup

1. **Clone the repo**

   ```bash
   git clone <repository_link>
   cd <folder_name>
2. Install dependencies
   ```bash
   npm install
3. Setup the database using MySQL
   ```bash
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user'
    );

    CREATE TABLE trains (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      source VARCHAR(255) NOT NULL,
      destination VARCHAR(255) NOT NULL,
      total_seats INT NOT NULL,
      available_seats INT NOT NULL
    );

    CREATE TABLE bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      train_id INT NOT NULL,
      booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (train_id) REFERENCES trains(id)
    );
4. Configure environment variables
5. Run the application
   ```bash
   npm start
6. Running Tests
   ```bash
   npm test
### Note:
1. **Environment Variables**: You will need to configure a `.env` file with your database and JWT secret information.
2. **Database Setup**: Ensure that the database schema is set up correctly before running the application.
3. **Running Tests**: The tests are run using Mocha and Chai, so ensure that you have the necessary packages installed (`mocha`, `chai`, `supertest`).
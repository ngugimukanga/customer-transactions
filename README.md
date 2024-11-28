# Fund Transfer API

## Description

This is a Node.js application that provides API endpoints for handling customer transactions, transferring funds between accounts, and retrieving account balances. The application is containerized using Docker and includes services for MySQL and RabbitMQ.

## Features

- **Create Transactions**: API for recording customer transactions.
- **Transfer Funds**: API for transferring funds from one account to another.
- **Account Balance**: API to retrieve the current balance of a customer account.

## Technologies Used

- **Node.js**: JavaScript runtime environment for building the application.
- **Express**: Web framework for building RESTful APIs.
- **MySQL**: Relational database for storing transaction details.
- **RabbitMQ**: Messaging queue for handling asynchronous tasks.
- **Winston**: Logging library for logging events and errors.
- **JWT (JSON Web Tokens)**: Authentication middleware for securing APIs.
- **Docker**: Containerization for application, database, and messaging queue.

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ngugimukanga/customer-transactions.git
   cd customer-transactions

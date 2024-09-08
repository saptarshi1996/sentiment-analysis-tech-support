# Sentiment Analysis Tech Support

## Overview

The **Sentiment Analysis Tech Support** project provides a comprehensive solution for analyzing customer feedback through sentiment analysis. It consists of a backend API built with FastAPI and a frontend web application built with React.js using Vite. This application allows users to upload feedback in CSV format, analyze its sentiment in real-time, and view the results in a structured format.

## Features

- **CSV Upload**: Easily upload customer feedback in CSV format.
- **Sentiment Analysis**: Analyze sentiment in real-time using an external sentiment analysis API.
- **Results Export**: Download analyzed results in CSV format.
- **Visualization**: View sentiment distribution and key themes through various charts.

## Screenshots

### Export Page
![Export Page](screenshots/export.png)

### Record Page
![Record Page](screenshots/record.png)

### Visualization - Bar Chart
![Bar Chart](screenshots/barchart.png)

### Visualization - Pie Chart
![Pie Chart](screenshots/piechart.png)

## Tech Stack

- **Backend**: FastAPI
- **Frontend**: ReactJS with Vite
- **Database**: MySQL with SQLAlchemy
- **Message Queue**: RabbitMQ
- **Sentiment Analysis**: Groq API
- **Visualization**: Chart.js
- **Realtime**: WebSockets

## Getting Started

### Prerequisites

- Python 3.8 or higher
- PIP
- Node.js 20.0.x or higher
- NVM (Node Version Manager)
- Docker
- Docker Compose
- GNU Make
- GROQ API Key ([Download here](https://console.groq.com/login))

### Setup

1. **Create Environment Variables**

   Create a `.env` file in the root directory from `.env.example` with the following content:

   ```env
   GROQ_API_KEY=
   SOCKET_URL=http://websocket:8083
   RABBITMQ_HOST=rabbitmq
   RABBITMQ_PORT=5672
   DB_USER=user
   DB_PASSWORD=password
   DB_NAME=sentiment
   DB_PORT=3306
   DB_HOST=mysql
   ```

2. **Frontend Environment Variables**

   Create a `.env` file in the `client/` directory from `.env.example` with the following content:

   ```env
   VITE_BACKEND_URL=http://localhost:8081/api
   VITE_SOCKET_URL=ws://localhost:8083
   ```

3. **Install Dependencies**

   Run the following commands to set up the environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   make inpip
   nvm install 20.11.1
   nvm use 20.11.1
   cd client && npm install
   make rabbitsql
   ```

4. **Database Setup**

   Initialize the tables from the `init.sql` file or set them up manually. In case of public key retrieval error, add this to the URL `?allowPublicKeyRetrieval=true&useSSL=false`.

5. **Queue Initialization**

   The RabbitMQ queue will be generated automatically when running the worker service.

6. **Access RabbitMQ UI**

   To access the RabbitMQ Management UI, visit: [http://localhost:15672](http://localhost:15672). Use the following credentials:

   ```plaintext
   Username: guest
   Password: guest
   ```

### Database Schema

![Database Schema](screenshots/schema.png)

## Backend Setup

1. **Run Backend Microservices**

   After the initial setup, start the backend services with:

   ```bash
   make dev
   ```

2. **View Service Logs**

   To view logs of the API, worker, and socket services respectively:

   ```bash
   make lgapi
   make lgwrk
   make lgsk
   ```

3. **Close services**

   To close the services:
   
   ```bash
   make down
   ```

## Frontend Setup

1. **Run Development Server**

   Start the ReactJS development server:

   ```bash
   cd client
   npm run dev
   ```

2. **Access Frontend**

   Access the Frontend UI at [http://localhost:5173](http://localhost:5173).

3. **Generate Production Build**

   Create a production build for the client:

   ```bash
   npm run build
   ```

## API Documentation

Access the Swagger documentation for the API at [http://localhost:8081/docs](http://localhost:8081/docs).

![Swagger Documentation](screenshots/swagger.png)

---

Let me know if you need further improvements or additional details!

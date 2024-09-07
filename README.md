# Sentiment Analysis Tech Support

## Overview

The **Sentiment Analysis Tech Support** project provides a solution for analyzing customer feedback through sentiment analysis. It consists of a backend API built with FastAPI and a frontend web application built with Next.js. This application allows users to upload feedback in CSV format, analyze its sentiment, and view results in a structured format.

## Features

- **CSV Upload**: Upload customer feedback in CSV format.
- **Sentiment Analysis**: Analyze sentiment using an external sentiment analysis API.
- **Results Export**: Download results in CSV format.
- **Pagination**: Navigate through lists of exports and records.
- **Visualization**: View sentiment distribution and key themes through charts.

## Tech Stack

- **Backend**: FastAPI
- **Frontend**: Next.js
- **Database**: PostgreSQL with SQLAlchemy
- **Message Queue**: RabbitMQ
- **Sentiment Analysis**: External sentiment analysis API
- **Visualization**: Chart.js

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 14.x or higher
- PostgreSQL
- RabbitMQ

### Backend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/saptarshi1996/sentiment-analysis-tech-support.git
    cd sentiment-analysis-tech-support
    ```

2. Set up a virtual environment and install dependencies:
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows use .venv\Scripts\activate
    pip install -r requirements.txt
    ```

3. Create a `.env` file in the root directory with the following content:
    ```env
    DATABASE_URL=postgresql://user:password@localhost/dbname
    RABBITMQ_HOST=localhost
    RABBITMQ_PORT=5672
    SENTIMENT_API_KEY=your_sentiment_api_key
    ```

4. Run the FastAPI server:
    ```bash
    uvicorn app.main:app --reload
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env.local` file in the frontend directory with the following content:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ```

4. Run the Next.js development server:
    ```bash
    npm run dev
    ```

## API Endpoints

### Upload CSV

- **Endpoint**: `POST /api/export`
- **Description**: Upload a CSV file with feedback.
- **Request**: `multipart/form-data`
- **Response**: Confirmation message.

### List Exports

- **Endpoint**: `GET /api/export`
- **Description**: List all exports with pagination and optional file name filtering.
- **Query Parameters**:
  - `page` (integer, default: 1)
  - `limit` (integer, default: 20)
  - `file_name` (string, optional)
- **Response**: List of exports with pagination details.

### Download CSV

- **Endpoint**: `GET /api/export/{export_id}/csv`
- **Description**: Download a CSV file of records for a specific export ID.
- **Response**: CSV file download.

## Frontend

- **Upload Page**: Allows users to upload a CSV file.
- **Export List**: Displays a list of exports with pagination.
- **Visualization**: Provides charts and graphs of sentiment analysis results.

## Contributing

We welcome contributions to this project. Please follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a Pull Request.

## Acknowledgements

- FastAPI
- Next.js
- Chart.js
- RabbitMQ
- PostgreSQL
- External Sentiment Analysis API

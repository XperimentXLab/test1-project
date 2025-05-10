# TEST1 Project

This project consists of a Django backend and a React frontend, containerized using Docker.

## Prerequisites

- Docker
- Docker Compose

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd TEST1
    ```

2.  **Set up environment variables:**
    *   Copy `c:\Folder\Apps Developing\PROJECT\TEST1\.env.example` to `c:\Folder\Apps Developing\PROJECT\TEST1\.env` and fill in the database credentials.
        ```bash
        cp .env.example .env
        ```
    *   Copy `c:\Folder\Apps Developing\PROJECT\TEST1\test1server\.envbackend.example` to `c:\Folder\Apps Developing\PROJECT\TEST1\test1server\.envbackend` and fill in the required values, especially `DJANGO_SECRET_KEY` and any production-specific settings.
        ```bash
        cp test1server/.envbackend.example test1server/.envbackend
        ```

3.  **Build and run the services:**
    ```bash
    docker-compose up --build -d
    ```

4.  **Apply database migrations (if running for the first time or after model changes):**
    ```bash
    docker-compose exec backend python manage.py migrate
    ```

## Accessing the Applications

-   **Backend API:** http://localhost:8080/ (or your specific API endpoints)
-   **Frontend:** http://localhost:5173/

## Development

To stop the services:
```bash
docker-compose down
```
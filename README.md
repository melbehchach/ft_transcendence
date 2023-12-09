# PONG CLUB

## Running Locally

To run the frontend and backend locally, follow these steps:

0. first you need to .env file with the following variables:

```bash
42_UID
42_SECRET
42_CALLBACK_URI

POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
DATABASE_URL

JWT_SECRET
```

1. Run the database:

```bash
docker-compose up database
```

2. In a new terminal, vavigate to the frontend directory and install the dependencies:

```bash
cd frontend
npm install -f
```

3. Start the frontend:

```bash
npm run dev
```

4. In a new terminal, navigate to the backend directory and install the dependencies:

```bash
cd backend
npm install -f
```

5. Start the backend:

```bash
npm run start:dev
```

## Running with Docker

To run the application with Docker, use this:

```bash
docker-compose up --build
```
You can also use the Makefile:

```bash
make
```

Here are the available commands:
* make : Builds and starts the Docker containers.
* make down: Stops and removes the Docker containers.
* make clean: Stops the Docker containers and removes the Docker images and volumes.
* make re: Runs make clean and then make up.
* make fclean: Runs make clean and then removes all Docker objects and cache.

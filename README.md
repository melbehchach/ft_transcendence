## Running Locally

To run the frontend and backend locally, follow these steps:

1. Navigate to the frontend directory and install the dependencies:

```bash
cd frontend
npm install -f
```

2. Start the frontend:

```bash
npm run dev -- -p 3001
```

3. In a new terminal window, navigate to the backend directory and install the dependencies:

```bash
cd backend
npm install -f
```

4. Start the backend:

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
